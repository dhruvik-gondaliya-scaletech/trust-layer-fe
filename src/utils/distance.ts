import cv from '@techstark/opencv-js';

/**
 * Estimates the ratio of the main object area to the total frame area.
 * Useful for guiding the user to move closer or farther.
 * 
 * @param src The source image Mat (RGBA)
 * @returns Ratio of largest contour area to total frame area (0.0 to 1.0)
 */
export function getDistanceRatio(src: any): number {
  const frameArea = src.cols * src.rows;
  if (frameArea === 0) return 0;

  let gray: any = null;
  let blurred: any = null;
  let thresholded: any = null;
  let contours: any = null;
  let hierarchy: any = null;

  try {
    gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

    blurred = new cv.Mat();
    cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);

    thresholded = new cv.Mat();
    cv.threshold(blurred, thresholded, 0, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU);

    const whitePixels = cv.countNonZero(thresholded);
    if (whitePixels > frameArea * 0.9) {
      cv.bitwise_not(thresholded, thresholded);
    }

    contours = new cv.MatVector();
    hierarchy = new cv.Mat();
    cv.findContours(thresholded, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    let significantCount = 0;
    let minX = src.cols;
    let maxX = 0;
    let minY = src.rows;
    let maxY = 0;

    for (let i = 0; i < contours.size(); ++i) {
      const contour = contours.get(i);
      const area = cv.contourArea(contour);

      if (area > frameArea * 0.005) {
        significantCount++;
        const rect = cv.boundingRect(contour);
        if (rect.x < minX) minX = rect.x;
        if (rect.y < minY) minY = rect.y;
        if (rect.x + rect.width > maxX) maxX = rect.x + rect.width;
        if (rect.y + rect.height > maxY) maxY = rect.y + rect.height;
      }
      contour.delete();
    }

    if (significantCount > 0) {
      const unionWidth = maxX - minX;
      const unionHeight = maxY - minY;
      const unionArea = unionWidth * unionHeight;
      const unionRatio = unionArea / frameArea;

      if (unionRatio > 0.75) {
        return 0.9;
      }

      return unionRatio;
    } else {
      let stddevVal = 100;
      let meanVal = 0;
      let mean: any = null;
      let stddev: any = null;
      try {
        mean = new cv.Mat();
        stddev = new cv.Mat();
        cv.meanStdDev(gray, mean, stddev);
        stddevVal = stddev.doubleAt(0, 0);
        meanVal = mean.doubleAt(0, 0);
      } catch {
        // ignore
      } finally {
        if (mean) mean.delete();
        if (stddev) stddev.delete();
      }

      if (stddevVal < 12) {
        if (meanVal > 15) {
          return 0.9;
        }
      }
      return 0.0;
    }
  } catch (err) {
    console.error("OpenCV.js Error in getDistanceRatio:", err);
    return 0.5;
  } finally {
    if (gray) gray.delete();
    if (blurred) blurred.delete();
    if (thresholded) thresholded.delete();
    if (contours) contours.delete();
    if (hierarchy) hierarchy.delete();
  }
}

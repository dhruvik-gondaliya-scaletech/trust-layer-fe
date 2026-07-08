import cv from '@techstark/opencv-js';

/**
 * Computes a blur score for an OpenCV Mat using the Laplacian variance method.
 * Lower variance values indicate a blurrier image.
 * 
 * @param src The source image Mat (RGBA or RGB)
 * @returns The variance score
 */
export function getBlurScore(src: any): number {
  let gray: any = null;
  let laplacian: any = null;
  let mean: any = null;
  let stddev: any = null;

  try {
    gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

    laplacian = new cv.Mat();
    cv.Laplacian(gray, laplacian, cv.CV_64F);

    mean = new cv.Mat();
    stddev = new cv.Mat();
    cv.meanStdDev(laplacian, mean, stddev);

    // Variance is stddev squared
    const variance = Math.pow(stddev.doubleAt(0, 0), 2);
    return variance;
  } catch (err) {
    console.error("OpenCV.js Error in getBlurScore:", err);
    return 999;
  } finally {
    if (gray) gray.delete();
    if (laplacian) laplacian.delete();
    if (mean) mean.delete();
    if (stddev) stddev.delete();
  }
}

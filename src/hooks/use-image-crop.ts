"use client";

import React, { useState, useRef, ChangeEvent, SyntheticEvent } from "react";
import { toast } from "sonner";

interface UseImageCropProps {
  cropBoxSize?: number;
  cropAreaSize?: number;
  onCropComplete?: (blob: Blob) => void;
}

export function useImageCrop({
  cropBoxSize = 220,
  cropAreaSize = 256,
  onCropComplete,
}: UseImageCropProps = {}) {
  const [cropMode, setCropMode] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [baseSize, setBaseSize] = useState({ width: 0, height: 0 });

  const imageRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setCropMode(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const nWidth = img.naturalWidth;
    const nHeight = img.naturalHeight;
    const aspectRatio = nWidth / nHeight;

    let width = cropBoxSize;
    let height = cropBoxSize;

    if (aspectRatio > 1) {
      width = cropBoxSize * aspectRatio;
    } else {
      height = cropBoxSize / aspectRatio;
    }

    setBaseSize({ width, height });
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStart.x;
    const dy = e.touches[0].clientY - dragStart.y;
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const cancelCrop = () => {
    setCropMode(false);
    setImageSrc(null);
  };

  const getCroppedBlob = (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const image = imageRef.current;
      if (!image) {
        reject(new Error("Image is not loaded"));
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = cropAreaSize;
      canvas.height = cropAreaSize;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.clearRect(0, 0, cropAreaSize, cropAreaSize);

      const scaleRatio = cropAreaSize / cropBoxSize;
      const canvasBaseWidth = baseSize.width * scaleRatio;
      const canvasBaseHeight = baseSize.height * scaleRatio;
      const renderWidth = canvasBaseWidth * zoom;
      const renderHeight = canvasBaseHeight * zoom;
      const canvasOffsetX = offset.x * scaleRatio;
      const canvasOffsetY = offset.y * scaleRatio;

      const drawX = (cropAreaSize / 2) - (renderWidth / 2) + canvasOffsetX;
      const drawY = (cropAreaSize / 2) - (renderHeight / 2) + canvasOffsetY;

      ctx.drawImage(image, drawX, drawY, renderWidth, renderHeight);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
            if (onCropComplete) {
              onCropComplete(blob);
            }
          } else {
            reject(new Error("Canvas toBlob returned null"));
          }
        },
        "image/jpeg",
        0.9
      );
    });
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return {
    cropMode,
    setCropMode,
    imageSrc,
    setImageSrc,
    zoom,
    setZoom,
    offset,
    baseSize,
    imageRef,
    fileInputRef,
    handleFileChange,
    handleImageLoad,
    handleMouseDown,
    handleMouseMove,
    handleMouseUpOrLeave,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    cancelCrop,
    getCroppedBlob,
    openFileDialog,
  };
}

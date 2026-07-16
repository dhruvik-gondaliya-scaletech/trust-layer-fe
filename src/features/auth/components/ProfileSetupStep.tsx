"use client";

import { Spinner } from "@/components/ui/spinner";
import React, { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import Image from "next/image";
import { ProfileSetupInput } from "@/lib/validations/verify";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, Camera } from "lucide-react";
import { BottomActionBar } from "@/components/ui/bottom-action-bar";
import { Form, FormField, FormControl, Field, FieldLabel, FieldError } from "@/components/ui/field";
import { useUploadProfilePhoto } from "@/hooks/queries/useUsers";
import { useImageCrop } from "@/hooks/use-image-crop";

interface ProfileSetupStepProps {
  form: UseFormReturn<ProfileSetupInput>;
  isPending: boolean;
  onSubmit: (data: ProfileSetupInput) => void;
  onBack: () => void;
  renderTracker?: () => React.ReactNode;
}

export const ProfileSetupStep: React.FC<ProfileSetupStepProps> = ({
  form,
  isPending,
  onSubmit,
  onBack,
  renderTracker,
}) => {
  const avatarUrl = form.watch("avatar");
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const displayUrl = localPreviewUrl || avatarUrl || null;

  // Clean up object URL when component unmounts or before creating a new one
  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  const {
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
    getCroppedBlob,
    openFileDialog,
  } = useImageCrop({
    cropBoxSize: 220,
    cropAreaSize: 256,
  });

  const uploadPhotoMutation = useUploadProfilePhoto({
    onSuccess: (user) => {
      form.setValue("avatar", user.profilePhotoUrl || undefined);
      setCropMode(false);
      setImageSrc(null);
      setIsUploading(false);
      toast.success("Profile photo updated.");
    },
    onError: (error) => {
      setIsUploading(false);
      toast.error(error.message || "Photo upload failed. Please try again.");
    },
  });

  const handleCropSave = async () => {
    setIsUploading(true);

    try {
      const croppedBlob = await getCroppedBlob();

      // Revoke the old local URL if exists
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }

      const localUrl = URL.createObjectURL(croppedBlob);
      setLocalPreviewUrl(localUrl);
      setImageError(false);

      const croppedFile = new File([croppedBlob], "profile_photo.jpg", {
        type: "image/jpeg",
      });

      uploadPhotoMutation.mutate(croppedFile);
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Failed to crop image.");
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-[140px] lg:pb-0 justify-center">
      {/* Top Header */}
      <div className="flex items-center justify-center p-3 relative bg-transparent border-none">
        <button
          onClick={onBack}
          type="button"
          className="absolute left-4 p-2 rounded-full text-foreground hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-sm font-bold text-slate-400 tracking-wide uppercase">Step 3 of 3</h1>
      </div>

      <div className="flex-1 px-5 pt-4 max-w-sm mx-auto w-full flex flex-col justify-center">
        {/* Progress Tracker */}
        {renderTracker?.()}

        <div className="text-center mb-6">
          <h1 className="text-2xl font-black mb-1.5 text-foreground leading-tight tracking-tight">
            Set up your profile
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Help buyers and sellers learn more about who they are transacting with.
          </p>
        </div>

        {/* Premium Card Container */}
        <div className="space-y-6">
          {cropMode ? (
            /* Crop Mode Interface */
            <div className="bg-white/80 backdrop-blur-xl rounded-[28px] p-6 shadow-[0_20px_50px_rgba(8,15,30,0.03)] border border-slate-100 space-y-6 flex flex-col items-center">
              <div className="text-center">
                <h3 className="text-sm font-bold text-slate-800">Crop Profile Photo</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">
                  Drag to move and slide to zoom
                </p>
              </div>

              {/* Crop Container Box */}
              <div
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="relative w-[220px] h-[220px] bg-black rounded-2xl overflow-hidden cursor-move touch-none select-none border border-slate-100 shadow-md"
              >
                {imageSrc && (
                  <Image
                    ref={imageRef}
                    src={imageSrc}
                    alt="Crop preview"
                    unoptimized
                    width={baseSize.width || 220}
                    height={baseSize.height || 220}
                    draggable={false}
                    onLoad={handleImageLoad}
                    className="absolute max-w-none origin-center select-none pointer-events-none transition-none"
                    style={{
                      width: `${baseSize.width}px`,
                      height: `${baseSize.height}px`,
                      transform: `translate3d(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px), 0) scale(${zoom})`,
                      top: "50%",
                      left: "50%",
                    }}
                  />
                )}
                {/* Circular Mask Overlay */}
                <div className="absolute inset-0 pointer-events-none border-2 border-white/80 rounded-full bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]" />
              </div>

              {/* Zoom Slider */}
              <div className="w-full flex items-center gap-3 px-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider select-none">Zoom</span>
                <Slider
                  min={1}
                  max={3}
                  step={0.01}
                  value={[zoom]}
                  onValueChange={(val) => setZoom(val[0])}
                  className="flex-1"
                />
                <span className="text-xs font-extrabold text-foreground w-8 text-right select-none">
                  {Math.round(zoom * 100)}%
                </span>
              </div>

              {/* Action Buttons for crop */}
              <div className="w-full flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setCropMode(false);
                    setImageSrc(null);
                  }}
                  className="flex-1 h-11 text-xs font-bold border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200 active:scale-[0.98]"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleCropSave}
                  disabled={isUploading}
                  className="flex-1 h-11 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/10 transition-all duration-200 active:scale-[0.98]"
                >
                  {isUploading ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <Spinner className="w-3.5 h-3.5" />
                      Saving...
                    </span>
                  ) : (
                    "Apply Crop"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            /* Standard Profile Setup Form & Avatar Selection */
            <div className="space-y-6">
              {/* Profile Avatar Selection Box */}
              <div className="flex flex-col items-center gap-4">
                {/* Main Avatar Circle */}
                <Button
                  type="button"
                  onClick={openFileDialog}
                  variant="ghost"
                  className="group cursor-pointer border-2 border-dashed border-slate-200 rounded-full hover:border-blue-500 hover:bg-blue-50/10 transition-all select-none p-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/10 h-auto w-auto hover:scale-105 duration-200"
                >
                  <Avatar className="size-24">
                    {displayUrl && !imageError ? (
                      <AvatarImage
                        src={displayUrl}
                        alt="Custom profile"
                        className="object-cover"
                        onError={() => setImageError(true)}
                      />
                    ) : null}
                    <AvatarFallback className="bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50/30 transition-colors">
                      <Camera className="w-8 h-8 opacity-65" />
                    </AvatarFallback>
                  </Avatar>
                </Button>

                <div className="text-center select-none cursor-pointer" onClick={openFileDialog}>
                  <h3 className="text-sm font-bold text-slate-800">Profile Photo (Optional)</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                    Add a profile picture to help build trust.
                  </p>
                </div>
              </div>

              {/* Hidden file input */}
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <Form {...form}>
                <form id="profile-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-left" noValidate>
                  {/* Username handle Field */}
                  <FormField control={form.control} name="username" render={({ field }) => (
                    <Field className="flex flex-col gap-1.5 border-none p-0">
                      <FieldLabel htmlFor="profile-username" className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                        Username <span className="text-destructive">*</span>
                      </FieldLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            id="profile-username"
                            type="text"
                            disabled={isPending}
                            placeholder="username"
                            className="pl-4 h-14 text-[15px] font-bold bg-slate-50/30 border-slate-200 focus-visible:ring-4 focus-visible:ring-blue-500/10 focus-visible:border-blue-600 rounded-2xl transition-all duration-200"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      {!form.formState.errors.username ? (
                        <p className="text-[11px] text-slate-400 leading-relaxed ml-1 font-medium">
                          Choose a unique username visible to buyers and sellers.
                        </p>
                      ) : (
                        <FieldError className="text-left ml-1 mt-1" />
                      )}
                    </Field>
                  )} />

                  {/* Short Bio Description Field */}
                  <FormField control={form.control} name="bio" render={({ field }) => (
                    <Field className="flex flex-col gap-1.5 border-none p-0">
                      <FieldLabel htmlFor="profile-bio" className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">About Me</FieldLabel>
                      <FormControl>
                        <Textarea
                          id="profile-bio"
                          disabled={isPending}
                          placeholder="Tell buyers and sellers a little about yourself."
                          rows={3}
                          className="text-[15px] font-semibold bg-slate-50/30 border-slate-200 focus-visible:ring-4 focus-visible:ring-blue-500/10 focus-visible:border-blue-600 rounded-2xl p-4 min-h-[100px] transition-all duration-200"
                          {...field}
                        />
                      </FormControl>
                      <FieldError className="text-left ml-1 mt-1" />
                    </Field>
                  )} />

                  {/* Hidden avatar input */}
                  <input type="hidden" {...form.register("avatar")} />
                </form>
              </Form>
            </div>
          )}
        </div>

        <BottomActionBar>
          <Button form="profile-form" type="submit" disabled={isPending || cropMode} className="w-full h-14 text-[15px] font-bold rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/10 transition-all duration-200 active:scale-[0.98]">
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner className="w-4 h-4" />
                Saving Profile...
              </span>
            ) : (
              "Finish Account Setup"
            )}
          </Button>
        </BottomActionBar>
      </div>
    </div>
  );
};



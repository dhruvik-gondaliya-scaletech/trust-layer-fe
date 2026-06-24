"use client";

import React, { useState } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ProfileSetupInput } from "@/lib/validations/verify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronLeft, Loader2 } from "lucide-react";
import { BottomActionBar } from "@/components/ui/bottom-action-bar";

interface ProfileSetupStepProps {
  register: UseFormRegister<ProfileSetupInput>;
  errors: FieldErrors<ProfileSetupInput>;
  isPending: boolean;
  onSubmit: (data: ProfileSetupInput) => void;
  handleSubmit: any;
  setValue: any;
  onBack: () => void;
}

const AVATAR_OPTIONS = [
  "🐶", "🦊", "🦁", "🐧", "🦉", "🦄", "🐼", "🐨"
];

export const ProfileSetupStep: React.FC<ProfileSetupStepProps> = ({
  register,
  errors,
  isPending,
  onSubmit,
  handleSubmit,
  setValue,
  onBack,
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);

  const selectAvatar = (avatar: string) => {
    setSelectedAvatar(avatar);
    setValue("avatar", avatar);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-[160px]">
      {/* Top Header */}
      <div className="flex items-center justify-center p-4 relative bg-background border-none">
        <button
          onClick={onBack}
          type="button"
          className="absolute left-4 p-2 -ml-2 rounded-full text-foreground hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="text-[16px] font-semibold text-foreground">Step 3 of 3</h1>
      </div>

      <div className="flex-1 px-5 pt-2 max-w-sm mx-auto w-full">
        {/* Progress Tracker */}
        <div className="flex items-center justify-center gap-2 mb-8 select-none">
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-[13px] font-bold border border-green-100">
            <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} /> Email
          </div>
          <div className="h-px w-4 bg-gray-200" />
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-[13px] font-bold border border-green-100">
            <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} /> Phone
          </div>
          <div className="h-px w-4 bg-gray-200" />
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-[13px] font-bold border border-blue-100">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" /> Profile
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-[28px] font-extrabold mb-2 text-foreground leading-tight tracking-tight">
            Profile Setup
          </h1>
          <p className="text-[15px] text-muted-foreground font-medium">
            Customize your public profile identity
          </p>
        </div>

        {/* Premium Card Container */}
        <div className="bg-white rounded-[24px] p-5 shadow-xl shadow-blue-900/5 border border-gray-100 space-y-6">
          {/* Profile Avatar Selection Box */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center border border-primary/15 relative text-4xl select-none shadow-inner">
              {selectedAvatar}
            </div>
            <span className="text-xs font-bold text-muted-foreground">Select Avatar</span>
            
            <div className="flex justify-center gap-2 max-w-xs flex-wrap">
              {AVATAR_OPTIONS.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => selectAvatar(avatar)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border transition-all hover:scale-105 active:scale-95 ${
                    selectedAvatar === avatar
                      ? "border-primary bg-primary/10 scale-105"
                      : "border-border/60 bg-background hover:bg-muted"
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left" noValidate>
            {/* Username handle Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-foreground ml-1">Username</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground select-none">
                  @
                </span>
                <Input
                  id="profile-username"
                  type="text"
                  disabled={isPending}
                  placeholder="username"
                  className={`pl-8 h-14 text-[16px] font-bold bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20 ${errors.username ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                  {...register("username")}
                />
              </div>
              {errors.username ? (
                <p className="text-red-500 text-[12px] font-medium text-left ml-1">{errors.username.message}</p>
              ) : (
                <p className="text-[11px] text-muted-foreground/80 leading-relaxed ml-1">
                  Alphanumeric characters and underscores only.
                </p>
              )}
            </div>

            {/* Short Bio Description Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-foreground ml-1">Short Bio (Optional)</label>
              <Textarea
                id="profile-bio"
                disabled={isPending}
                placeholder="Tell us a little bit about yourself..."
                rows={3}
                className={`text-[16px] font-medium bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20 rounded-2xl p-4 min-h-[100px] ${errors.bio ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                {...register("bio")}
              />
              {errors.bio && (
                <p className="text-red-500 text-[12px] font-medium text-left ml-1">{errors.bio.message}</p>
              )}
            </div>

            {/* Hidden avatar input */}
            <input type="hidden" {...register("avatar")} />
          </form>
        </div>
      </div>

      <BottomActionBar>
        <Button form="profile-form" type="submit" disabled={isPending} className="w-full h-14 text-[16px] font-bold">
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving Profile...
            </span>
          ) : (
            "Complete Setup"
          )}
        </Button>
      </BottomActionBar>
    </div>
  );
};

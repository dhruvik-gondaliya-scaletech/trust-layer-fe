"use client";

import React, { useState } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ProfileSetupInput } from "@/lib/validations/verify";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="flex-1 flex flex-col justify-between relative min-h-screen sm:min-h-[840px]">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between px-6 py-5 select-none border-b border-border/10">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="w-9 h-9 rounded-full"
          >
            <ChevronLeft className="w-5 h-5 text-foreground/80" />
          </Button>
          <span className="text-sm font-bold text-foreground">Step 3 of 3</span>
          <div className="w-9" />
        </div>

        {/* Wizard Progress Indicator Row */}
        <div className="flex items-center justify-center gap-3 px-6 py-4 border-b border-border/5 select-none">
          <div className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[11px] font-bold text-emerald-600">
            <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />
            <span>Email</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[11px] font-bold text-emerald-600">
            <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />
            <span>Phone</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-bold text-primary">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
            <span>Profile</span>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col justify-center px-6 py-6 gap-6">
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

        {/* Form Inputs */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 text-left max-w-sm mx-auto w-full"
          noValidate
        >
          {/* Username handle Field */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="profile-username"
              className="text-xs font-bold text-foreground/80"
            >
              Username
            </Label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground select-none">
                @
              </span>
              <Input
                id="profile-username"
                type="text"
                disabled={isPending}
                placeholder="username"
                className={cn(
                  "pl-8",
                  errors.username
                    ? "border-destructive focus-visible:ring-destructive/20"
                    : "border-border/80"
                )}
                aria-invalid={errors.username ? "true" : "false"}
                aria-describedby={errors.username ? "username-error" : undefined}
                {...register("username")}
              />
            </div>
            {errors.username ? (
              <span
                id="username-error"
                className="text-[11px] font-medium text-destructive mt-0.5"
                role="alert"
              >
                {errors.username.message}
              </span>
            ) : (
              <span className="text-[10px] text-muted-foreground/80 leading-relaxed px-1">
                Alphanumeric characters and underscores only.
              </span>
            )}
          </div>

          {/* Short Bio Description Field */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="profile-bio"
              className="text-xs font-bold text-foreground/80"
            >
              Short Bio (Optional)
            </Label>
            <Textarea
              id="profile-bio"
              disabled={isPending}
              placeholder="Tell us a little bit about yourself..."
              rows={3}
              className={
                errors.bio
                  ? "border-destructive focus-visible:ring-destructive/20"
                  : "border-border/80"
              }
              aria-invalid={errors.bio ? "true" : "false"}
              aria-describedby={errors.bio ? "bio-error" : undefined}
              {...register("bio")}
            />
            {errors.bio && (
              <span
                id="bio-error"
                className="text-[11px] font-medium text-destructive mt-0.5"
                role="alert"
              >
                {errors.bio.message}
              </span>
            )}
          </div>

          {/* Hidden avatar input */}
          <input type="hidden" {...register("avatar")} />

          {/* Complete Button at bottom */}
          <div className="mt-6">
            <Button
              type="submit"
              disabled={isPending}
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10 rounded-2xl h-12 text-sm font-bold active:scale-[0.98] transition-all"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Profile...
                </>
              ) : (
                "Complete Setup"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

"use client";

import { ArrowRight, ShieldCheck, Star } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "../utils/format";
import type { User } from "@/types/api.types";
import { useRole } from "@/providers/role-provider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PartyCardProps {
  label: string;
  user: User | null | undefined;
  trustScore?: number;
  onClick?: () => void;
}

export function PartyCard({ label, user, trustScore, onClick }: PartyCardProps) {
  const { role } = useRole();
  const isSeller = role === "seller";
  const theme = {
    text: isSeller ? "text-blue-600" : "text-[#10B981]",
    bgSoft: isSeller ? "bg-blue-100" : "bg-[#10B981]/20",
  };

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const displayName = fullName || user?.username || "Unknown";
  const isVerified = Boolean(user?.phoneVerifiedAt && user?.emailVerifiedAt);

  const profilePhotoUrl = user?.profilePhotoUrl;
  const isEmoji = Boolean(profilePhotoUrl && !profilePhotoUrl.startsWith("http") && !profilePhotoUrl.startsWith("/"));

  return (
    <Card 
      onClick={onClick}
      className={cn(
        "p-4 border-gray-100 shadow-sm rounded-2xl flex items-center justify-between bg-white",
        onClick ? "cursor-pointer hover:bg-gray-50 transition-colors" : ""
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar className={cn("w-12 h-12 rounded-full", theme.bgSoft)}>
          {!isEmoji && <AvatarImage src={profilePhotoUrl ?? undefined} alt={displayName} />}
          <AvatarFallback className={cn("font-bold text-[18px]", theme.text, theme.bgSoft)}>
            {isEmoji ? profilePhotoUrl : getInitials(displayName)}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="font-bold text-[15px] text-gray-900">{displayName}</span>
            {isVerified && <ShieldCheck className={cn("w-3.5 h-3.5", theme.text)} />}
          </div>
          {fullName && user?.username && (
            <span className="text-[12px] text-gray-500 -mt-0.5 mb-0.5">@{user.username}</span>
          )}
          <div className="flex items-center gap-2 text-[12px] font-semibold text-gray-500">
            {typeof trustScore === "number" && (
              <>
                <span className="flex items-center gap-0.5 text-orange-500">
                  <Star className="w-3 h-3 fill-current" /> {trustScore}
                </span>
                <span>•</span>
              </>
            )}
            <span>{label}</span>
          </div>
        </div>
      </div>
      
      {onClick && (
        <Button variant="ghost" className={cn("h-9 w-9 p-0 rounded-full bg-gray-50 hover:bg-gray-100", theme.text)}>
          <ArrowRight className="w-4 h-4" />
        </Button>
      )}
    </Card>
  );
}

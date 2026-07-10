"use client";

import { TrustProfileCard } from "@/components/trust-profile-card";
import type { User } from "@/types/api.types";

interface SellerProfileSectionProps {
  seller?: User;
  trustScore?: number;
}

export function SellerProfileSection({ seller, trustScore }: SellerProfileSectionProps) {
  if (!seller) return null;

  const displayName = seller.username
    ? `@${seller.username}`
    : [seller.firstName, seller.lastName].filter(Boolean).join(" ") || "Seller";

  const memberSinceYear = seller.createdAt
    ? new Date(seller.createdAt).getFullYear()
    : new Date().getFullYear();

  const isVerified = Boolean(seller.emailVerifiedAt && seller.phoneVerifiedAt);

  return (
    <div>
      <TrustProfileCard
        variant="medium"
        user={{
          username: seller.username ? `@${seller.username}` : "Seller",
          firstName: seller.firstName,
          lastName: seller.lastName,
          avatarUrl: seller.profilePhotoUrl || "",
          trustScore: trustScore ?? 95,
          memberSince: memberSinceYear,
          isTrustedMember: isVerified,
        }}
      />
    </div>
  );
}

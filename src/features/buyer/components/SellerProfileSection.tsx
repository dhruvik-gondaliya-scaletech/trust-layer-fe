"use client";

import { TrustProfileCard } from "@/components/trust-profile-card";

// Mock seller profile until deal.seller is wired up from the API.
export function SellerProfileSection() {
  return (
    <div>
      <TrustProfileCard
        variant="medium"
        user={{
          username: "@vintage_vault",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
          trustScore: 96,
          rating: 4.9,
          reviewCount: 184,
          successfulDeals: 184,
          memberSince: 2022,
          isTrustedMember: true,
        }}
      />
    </div>
  );
}

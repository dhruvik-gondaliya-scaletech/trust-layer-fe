import React from "react";
import DisputeListingContainer from "@/features/dispute/container/DisputeListingContainer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dispute Resolution Center | TrustLayer Dashboard",
  description: "Manage, monitor, and resolve all active disputes and return requests.",
};

export default function DisputeListingPage() {
  return <DisputeListingContainer />;
}

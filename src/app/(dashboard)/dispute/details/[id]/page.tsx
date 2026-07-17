import React from "react";
import DisputeDetailsContainer from "@/features/dispute/container/DisputeDetailsContainer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dispute Details | TrustLayer Dashboard",
  description: "Review, respond, track, and resolve open disputes and return shipments safely.",
};

export default function DisputeDetailsPage() {
  return <DisputeDetailsContainer />;
}

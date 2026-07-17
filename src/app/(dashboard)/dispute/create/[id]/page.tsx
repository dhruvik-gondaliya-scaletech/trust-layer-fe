import React from "react";
import CreateDisputeContainer from "@/features/dispute/container/CreateDisputeContainer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "File a Dispute | TrustLayer Dashboard",
  description: "Raise a dispute, outline issues, and submit evidence to resolve disputes safely.",
};

export default function CreateDisputePage() {
  return <CreateDisputeContainer />;
}

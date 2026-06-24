import React from "react";
import { RegisterContainer } from "@/features/auth/container/RegisterContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account - TrustLayer",
  description: "Create your TrustLayer account to start trusted transactions.",
};

export default function RegisterPage() {
  return <RegisterContainer />;
}

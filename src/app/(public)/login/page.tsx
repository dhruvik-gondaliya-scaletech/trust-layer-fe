import React from "react";
import { LoginContainer } from "@/features/auth/container/LoginContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - TrustLayer",
  description: "Sign in to your TrustLayer account to start secure transactions.",
};

export default function LoginPage() {
  return <LoginContainer />;
}

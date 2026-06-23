"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { loginSchema, LoginInput } from "@/lib/validations/login";
import { zodResolver } from "@/lib/validations/resolver";
import { useLoginMutation } from "@/hooks/queries/useLogin";
import { LoginForm } from "../components/LoginForm";
import { FRONTEND_ROUTES } from "@/lib/contants";

export const LoginContainer: React.FC = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "alex@email.com",
      password: "Password123!",
    },
  });

  const mutation = useLoginMutation({
    onSuccess: (data) => {
      toast.success("Welcome back!", {
        description: "You have signed in successfully.",
      });
      reset();
      // Redirect to dashboard route
      router.push(FRONTEND_ROUTES.DASHBOARD);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to sign in. Please try again.");
    },
  });

  const onSubmit = (data: LoginInput) => {
    mutation.mutate(data);
  };

  return (
    <LoginForm
      register={register}
      errors={errors}
      isPending={mutation.isPending}
      onSubmit={onSubmit}
      handleSubmit={handleSubmit}
    />
  );
};

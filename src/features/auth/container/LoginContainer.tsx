"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { loginSchema, LoginInput } from "@/lib/validations/login";
import { zodResolver } from "@/lib/validations/resolver";
import { useLoginMutation } from "@/hooks/queries/useAuth";
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
      email: "",
      password: "",
    },
  });

  const mutation = useLoginMutation({
    onSuccess: (data, variables) => {
      reset();
      // If registration token is returned instead of access/refresh, proceed to verification
      if (data.registrationToken) {
        toast.info("Please verify your account to continue.");
        router.push(`${FRONTEND_ROUTES.VERIFY}?email=${encodeURIComponent(variables.email)}`);
      } else {
        toast.success("Welcome back!", {
          description: "You have signed in successfully.",
        });
        router.push(FRONTEND_ROUTES.DASHBOARD);
      }
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

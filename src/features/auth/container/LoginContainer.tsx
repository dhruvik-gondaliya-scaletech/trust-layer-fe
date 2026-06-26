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
    setValue,
    getValues,
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
      
      const emailVerified = data.emailVerified ?? false;
      const phoneVerified = data.phoneVerified ?? false;
      const profileComplete = data.profileComplete ?? false;

      if (emailVerified && phoneVerified && profileComplete) {
        toast.success("Welcome back!", {
          description: "You have signed in successfully.",
        });
        router.push(FRONTEND_ROUTES.DASHBOARD);
      } else {
        toast.info("Please complete verification/setup to continue.");
        router.push(`${FRONTEND_ROUTES.VERIFY}?email=${encodeURIComponent(variables.email)}`);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to sign in. Please try again.");
    },
  });

  const onSubmit = (data: LoginInput) => {
    mutation.mutate(data);
  };

  const handlePreSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Sync browser-autofilled values that might not have triggered react-hook-form change events
    const fields: Array<keyof LoginInput> = ["email", "password"];
    fields.forEach((field) => {
      const el = document.getElementsByName(field)[0] as HTMLInputElement | undefined;
      if (el && el.value && !getValues(field)) {
        setValue(field, el.value, { shouldValidate: true });
      }
    });

    handleSubmit(onSubmit)(e);
  };

  return (
    <LoginForm
      register={register}
      errors={errors}
      isPending={mutation.isPending}
      onSubmit={handlePreSubmit}
    />
  );
};

"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { registerSchema, RegisterInput } from "@/lib/validations/register";
import { zodResolver } from "@/lib/validations/resolver";
import { useRegisterMutation } from "@/hooks/queries/useAuth";
import { RegisterForm } from "../components/RegisterForm";
import { FRONTEND_ROUTES } from "@/lib/contants";

export const RegisterContainer: React.FC = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  });

  const mutation = useRegisterMutation({
    onSuccess: (data, variables) => {
      toast.success("Account created successfully!", {
        description: `Welcome to TrustLayer, ${variables.firstName}! Let's verify your email.`,
      });
      reset();
      // Redirect to verification wizard
      router.push(`${FRONTEND_ROUTES.VERIFY}?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create account. Please try again.");
    },
  });

  const onSubmit = (data: RegisterInput) => {
    mutation.mutate(data);
  };

  const handlePreSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Sync browser-autofilled values that might not have triggered react-hook-form change events
    const fields: Array<keyof RegisterInput> = [
      "firstName",
      "lastName",
      "email",
      "password",
      "confirmPassword",
    ];
    fields.forEach((field) => {
      const el = document.getElementsByName(field)[0] as HTMLInputElement | undefined;
      if (el && el.value && !getValues(field)) {
        setValue(field, el.value, { shouldValidate: true });
      }
    });

    handleSubmit(onSubmit)(e);
  };

  return (
    <RegisterForm
      register={register}
      errors={errors}
      isPending={mutation.isPending}
      onSubmit={handlePreSubmit}
    />
  );
};

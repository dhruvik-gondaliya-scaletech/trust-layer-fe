"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAddAddress } from "@/hooks/queries/useAddresses";
import AddShippingAddress from "./AddShippingAddress";
import { AddressFormInput } from "@/lib/validations/address";

export default function AddShippingAddressContainer() {
  const router = useRouter();
  const addAddressMutation = useAddAddress();

  const handleAddAddressSubmit = async (data: AddressFormInput & { isDefault?: boolean }) => {
    try {
      await addAddressMutation.mutateAsync({
        type: data.type,
        customLabel: data.customLabel,
        name: data.name,
        street: data.street,
        apt: data.apt,
        zip: data.zip,
        city: data.city,
        state: data.state,
        country: data.country,
        alternatePhone: data.alternatePhone,
      });
      router.back();
    } catch (e) {
      console.error("Failed to add address", e);
    }
  };

  return (
    <AddShippingAddress
      onSubmit={handleAddAddressSubmit}
      isSubmitting={addAddressMutation.isPending}
      onBack={() => router.back()}
    />
  );
}

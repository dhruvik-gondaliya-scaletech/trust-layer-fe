"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useAddresses,
  useSetDefaultAddress,
  useDeleteAddress,
} from "@/hooks/queries/useAddresses";
import ShippingAddressList from "./ShippingAddressList";
import { Loader2 } from "lucide-react";
import { FRONTEND_ROUTES } from "@/lib/contants";

export default function SelectShippingAddressContainer() {
  const router = useRouter();
  const { data: addresses = [], isLoading } = useAddresses();
  const setDefaultAddressMutation = useSetDefaultAddress();
  const deleteAddressMutation = useDeleteAddress();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const defaultAddrId = addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || null;
  const activeAddressId = selectedAddressId || defaultAddrId;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 size={36} className="text-primary animate-spin" />
        <p className="text-[13px] text-slate-400 font-bold mt-3">Loading addresses...</p>
      </div>
    );
  }

  return (
    <ShippingAddressList
      addresses={addresses}
      selectedAddressId={activeAddressId}
      onSelectAddress={(id) => setSelectedAddressId(id)}
      onSetDefault={async (id) => {
        await setDefaultAddressMutation.mutateAsync(id);
      }}
      onDelete={async (id) => {
        await deleteAddressMutation.mutateAsync(id);
        if (selectedAddressId === id) {
          setSelectedAddressId(null);
        }
      }}
      onAddNewAddress={() => router.push(FRONTEND_ROUTES.ADD_SHIPPING_ADDRESS)}
      onBack={() => router.back()}
    />
  );
}

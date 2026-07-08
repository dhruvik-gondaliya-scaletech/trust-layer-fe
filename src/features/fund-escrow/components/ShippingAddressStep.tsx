"use client";

import { motion } from "framer-motion";
import { Truck, Home, Briefcase, MapPin, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ShippingAddress } from "@/types/address.types";
import { stepVariants } from "@/styles/animation-tokens";

interface ShippingAddressStepProps {
  addresses: ShippingAddress[];
  selectedAddress: ShippingAddress | undefined;
  onSelectAddress: (id: string) => void;
  onSetDefaultAddress: (id: string) => void;
  onDeleteAddress: (id: string) => void;
  onAddAddressClick: () => void;
}

export function ShippingAddressStep({
  addresses,
  selectedAddress,
  onSelectAddress,
  onSetDefaultAddress,
  onDeleteAddress,
  onAddAddressClick,
}: ShippingAddressStepProps) {
  return (
    <motion.div
      key="step1"
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="flex flex-col gap-6"
    >
      <div>
        <h2 className="text-[20px] font-extrabold tracking-tight">Select Shipping Address</h2>
        <p className="text-[13px] text-slate-500 mt-1">
          Choose where you would like this item delivered.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {addresses.length === 0 ? (
          <Card className="rounded-[20px] border-dashed border-2 border-slate-200 bg-slate-50/50 p-8 flex flex-col items-center justify-center gap-3 text-center">
            <Truck className="text-slate-400 stroke-[1.5]" size={36} />
            <div>
              <p className="font-bold text-[14px]">No address saved</p>
              <p className="text-[12px] text-slate-400 mt-1">
                You need to add a shipping address to receive this item.
              </p>
            </div>
            <Button
              onClick={onAddAddressClick}
              className="h-10 rounded-[14px] bg-primary hover:bg-primary/95 text-white px-4 font-bold text-[13px]"
            >
              Add Shipping Address
            </Button>
          </Card>
        ) : (
          <>
            {[...addresses]
              .sort((a, b) => (a.isDefault ? -1 : b.isDefault ? 1 : 0))
              .map((address) => {
                const isSelected = selectedAddress?.id === address.id;
                return (
                  <div
                    key={address.id}
                    onClick={() => onSelectAddress(address.id)}
                    className={cn(
                      "group relative flex gap-4 p-4 rounded-[20px] border-2 cursor-pointer bg-white transition-all",
                      isSelected
                        ? "border-primary shadow-soft bg-blue-50/10"
                        : "border-slate-100 hover:border-slate-200"
                    )}
                  >
                    <div className="mt-1 flex items-center justify-center shrink-0">
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                          isSelected ? "border-primary bg-primary" : "border-slate-300"
                        )}
                      >
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[14px]">{address.name}</span>
                        <Badge variant="outline" className="text-[10px] font-bold py-0 h-4 border-slate-200">
                          {address.type === "Home" ? (
                            <Home size={10} className="mr-1 inline-block align-text-top" />
                          ) : address.type === "Office" ? (
                            <Briefcase size={10} className="mr-1 inline-block align-text-top" />
                          ) : (
                            <MapPin size={10} className="mr-1 inline-block align-text-top" />
                          )}
                          {address.type}
                        </Badge>
                        {address.isDefault && (
                          <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 text-[10px] font-bold py-0 h-4 border-none">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-[13px] text-slate-500">
                        {address.street}
                        {address.apt && `, ${address.apt}`}
                      </p>
                      <p className="text-[13px] text-slate-500">
                        {address.city}, {address.state} {address.zip}
                      </p>
                      <p className="text-[13px] text-slate-500">{address.country}</p>
                      {address.alternatePhone && (
                        <p className="text-[12px] text-slate-400 font-mono mt-1">
                          Phone: {address.alternatePhone}
                        </p>
                      )}

                      <div className="flex gap-4 mt-3 pt-2 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!address.isDefault && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSetDefaultAddress(address.id);
                            }}
                            className="text-[11px] text-slate-400 font-bold hover:text-slate-600 transition-colors"
                          >
                            Set as Default
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteAddress(address.id);
                          }}
                          className="text-[11px] text-destructive font-bold hover:text-destructive/80 flex items-center gap-1 transition-colors"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

            <Button
              variant="outline"
              onClick={onAddAddressClick}
              className="h-12 border-dashed border-2 border-slate-200 rounded-[20px] bg-slate-50 hover:bg-slate-100 flex items-center justify-center gap-2 text-slate-500 font-bold text-[13px] transition-colors mt-2"
            >
              <Plus size={16} /> Add New Address
            </Button>
          </>
        )}
      </div>
    </motion.div>
  );
}

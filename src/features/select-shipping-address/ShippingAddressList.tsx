"use client";
import React from "react";
import { ShippingAddress } from "@/types/address.types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Home, Briefcase, MapPin, Plus, ChevronLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { BottomActionBar } from "@/components/ui/bottom-action-bar";

interface ShippingAddressListProps {
  addresses: ShippingAddress[];
  selectedAddressId: string | null;
  onSelectAddress: (id: string) => void;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
  onAddNewAddress: () => void;
  onBack: () => void;
}

export default function ShippingAddressList({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onSetDefault,
  onDelete,
  onAddNewAddress,
  onBack,
}: ShippingAddressListProps) {
  const sortedAddresses = [...addresses].sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-[120px] text-foreground">
      {/* ─── Header ─── */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center p-4 w-full">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="w-10 h-10 rounded-full text-slate-500 hover:bg-slate-50 -ml-2"
          >
            <ChevronLeft size={20} />
          </Button>
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full px-5 py-6 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Select Shipping Address</h1>
          <p className="text-[14px] text-slate-500">
            Choose where you would like this item delivered.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {sortedAddresses.map((address) => {
            const isSelected = address.id === selectedAddressId;
            return (
              <Card
                key={address.id}
                onClick={() => onSelectAddress(address.id)}
                className={cn(
                  "p-5 cursor-pointer border-2 transition-all relative overflow-hidden rounded-[20px] bg-white",
                  isSelected ? "border-primary bg-blue-50/50 shadow-sm" : "border-slate-100 hover:border-slate-200"
                )}
              >
                <div className="flex gap-4">
                  <div className={cn(
                    "mt-1 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors",
                    isSelected ? "bg-primary border-primary" : "border-slate-300"
                  )}>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {address.type === "Home" ? (
                          <Home className="w-4 h-4 text-slate-500" />
                        ) : address.type === "Office" ? (
                          <Briefcase className="w-4 h-4 text-slate-500" />
                        ) : (
                          <MapPin className="w-4 h-4 text-slate-500" />
                        )}
                        <span className="font-bold text-[15px]">{address.type}</span>
                      </div>
                      {address.isDefault && (
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          DEFAULT ADDRESS
                        </span>
                      )}
                    </div>
                    <p className="text-[14px] font-semibold mb-1">{address.name}</p>
                    <p className="text-[13px] text-slate-500 leading-relaxed">
                      {address.street} {address.apt && `, ${address.apt}`} <br />
                      {address.city}, {address.state} {address.zip} <br />
                      {address.country}
                    </p>
                    {address.alternatePhone && (
                      <p className="text-[13px] text-slate-500 mt-2 font-mono">{address.alternatePhone}</p>
                    )}
                  </div>
                </div>

                {/* Inline Actions */}
                <div className={cn(
                  "mt-4 pt-4 border-t flex items-center",
                  isSelected ? "border-blue-100/50" : "border-slate-100"
                )}>
                  <div className="flex gap-4 w-full" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onDelete(address.id)}
                      className="text-[13px] font-bold text-slate-500 hover:text-destructive transition-colors flex items-center gap-1.5 p-1 -ml-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                    <div className="flex-1" />
                    {!address.isDefault && (
                      <button
                        onClick={() => onSetDefault(address.id)}
                        className="text-[13px] font-bold text-primary hover:underline transition-colors flex items-center gap-1.5 p-1 -mr-1 cursor-pointer"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}

          <Button
            variant="outline"
            className="w-full h-[56px] rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 font-bold hover:bg-slate-100 hover:text-slate-900 transition-colors"
            onClick={onAddNewAddress}
          >
            <Plus className="w-5 h-5 mr-2" /> Add New Address
          </Button>
        </div>
      </div>

      <BottomActionBar>
        <Button
          disabled={!selectedAddressId}
          onClick={onBack}
          className="w-full h-14 text-[16px] font-bold"
        >
          Continue
        </Button>
      </BottomActionBar>
    </div>
  );
}


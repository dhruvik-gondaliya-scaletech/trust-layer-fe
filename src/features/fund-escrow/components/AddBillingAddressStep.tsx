"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { stepVariants } from "@/styles/animation-tokens";

interface AddBillingAddressStepProps {
  billingFirstName: string;
  setBillingFirstName: (value: string) => void;
  billingLastName: string;
  setBillingLastName: (value: string) => void;
  billingStreet: string;
  setBillingStreet: (value: string) => void;
  billingApt: string;
  setBillingApt: (value: string) => void;
  billingCity: string;
  setBillingCity: (value: string) => void;
  billingState: string;
  setBillingState: (value: string) => void;
  billingZip: string;
  setBillingZip: (value: string) => void;
}

export function AddBillingAddressStep({
  billingFirstName,
  setBillingFirstName,
  billingLastName,
  setBillingLastName,
  billingStreet,
  setBillingStreet,
  billingApt,
  setBillingApt,
  billingCity,
  setBillingCity,
  billingState,
  setBillingState,
  billingZip,
  setBillingZip,
}: AddBillingAddressStepProps) {
  return (
    <motion.div
      key="step3-add-billing"
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="flex flex-col gap-5 pt-2"
    >
      <div>
        <h2 className="text-[20px] font-extrabold tracking-tight">Add Billing Address</h2>
        <p className="text-[13px] text-slate-500 mt-1">
          Ensure this matches the address registered with your bank.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="billingFirstName" className="text-[13px] font-bold text-slate-700">
              First Name
            </Label>
            <Input
              id="billingFirstName"
              value={billingFirstName}
              onChange={(e) => setBillingFirstName(e.target.value)}
              placeholder="Alex"
              className="rounded-[14px] h-12 bg-white border-slate-200"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="billingLastName" className="text-[13px] font-bold text-slate-700">
              Last Name
            </Label>
            <Input
              id="billingLastName"
              value={billingLastName}
              onChange={(e) => setBillingLastName(e.target.value)}
              placeholder="Johnson"
              className="rounded-[14px] h-12 bg-white border-slate-200"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="billingStreet" className="text-[13px] font-bold text-slate-700">
            Street Address
          </Label>
          <Input
            id="billingStreet"
            value={billingStreet}
            onChange={(e) => setBillingStreet(e.target.value)}
            placeholder="123 Main Street"
            className="rounded-[14px] h-12 bg-white border-slate-200"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="billingApt" className="text-[13px] font-bold text-slate-700">
            Apartment, suite, unit (optional)
          </Label>
          <Input
            id="billingApt"
            value={billingApt}
            onChange={(e) => setBillingApt(e.target.value)}
            placeholder="Apt 4B"
            className="rounded-[14px] h-12 bg-white border-slate-200"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 flex flex-col gap-2">
            <Label htmlFor="billingCity" className="text-[13px] font-bold text-slate-700">
              City
            </Label>
            <Input
              id="billingCity"
              value={billingCity}
              onChange={(e) => setBillingCity(e.target.value)}
              placeholder="Austin"
              className="rounded-[14px] h-12 bg-white border-slate-200"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="billingState" className="text-[13px] font-bold text-slate-700">
              State
            </Label>
            <Input
              id="billingState"
              value={billingState}
              onChange={(e) => setBillingState(e.target.value)}
              placeholder="TX"
              className="rounded-[14px] h-12 bg-white border-slate-200"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="billingZip" className="text-[13px] font-bold text-slate-700">
            ZIP Code
          </Label>
          <Input
            id="billingZip"
            value={billingZip}
            onChange={(e) => setBillingZip(e.target.value)}
            placeholder="78701"
            maxLength={5}
            className="rounded-[14px] h-12 bg-white border-slate-200"
          />
        </div>
      </div>
    </motion.div>
  );
}

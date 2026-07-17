"use client";

import React from "react";
import { Truck } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Dispute, Deal } from "@/types/api.types";

interface ReturnDetailsCardProps {
  dispute: Dispute;
  deal: Deal;
}

export function ReturnDetailsCard({ dispute, deal }: ReturnDetailsCardProps) {
  if (dispute.action !== "return") return null;

  return (
    <Card className="rounded-[24px] border-slate-100 shadow-soft bg-white p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
          <Truck className="w-4 h-4 text-indigo-500" />
        </div>
        <h3 className="text-[15px] font-bold text-slate-800">Return Details</h3>
      </div>

      {dispute.trackingNumber ? (
        <div className="grid grid-cols-2 gap-3 text-[13px] pt-1">
          <div className="bg-slate-50 p-3 rounded-xl">
            <span className="text-slate-400 block text-[11px] font-bold uppercase">Carrier</span>
            <span className="font-extrabold text-slate-700 capitalize">{dispute.carrier}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl">
            <span className="text-slate-400 block text-[11px] font-bold uppercase">Tracking #</span>
            <span className="font-extrabold text-slate-700">{dispute.trackingNumber}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl col-span-2 flex justify-between items-center">
            <div>
              <span className="text-slate-400 block text-[11px] font-bold uppercase">Return Status</span>
              <span className="font-extrabold text-slate-700 capitalize">
                {deal.status.replace("return_", "Return ")}
              </span>
            </div>
            {dispute.trackingUrl && (
              <a
                href={dispute.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-primary hover:underline bg-primary/5 px-3 py-1.5 rounded-lg"
              >
                Track Shipment
              </a>
            )}
          </div>
        </div>
      ) : (
        <div className="text-[12.5px] text-slate-500 bg-slate-50/50 p-3.5 rounded-xl border border-slate-100 italic">
          Waiting for the buyer to submit tracking and carrier information.
        </div>
      )}
    </Card>
  );
}

"use client";

import type { ComponentType } from "react";
import { CheckCircle2, Clock, Truck, PackageCheck, AlertTriangle, RotateCcw, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStatusBanner } from "../utils/dealStatusMeta";
import { formatDateTime } from "../utils/format";
import type { Deal } from "@/types/api.types";
import { motion } from "framer-motion";
import { useRole } from "@/providers/role-provider";

const ICON_BY_STATUS: Record<Deal["status"], ComponentType<{ size?: number; className?: string }>> = {
  draft: Clock,
  open: Clock,
  funded: CheckCircle2,
  shipped: Truck,
  delivered: PackageCheck,
  disputed: AlertTriangle,
  return_approved: RotateCcw,
  return_shipped: RotateCcw,
  return_delivered: RotateCcw,
  return_completed: RotateCcw,
  cancelled: XCircle,
  closed: CheckCircle2,
};

interface StatusBannerProps {
  deal: Deal;
}

export function StatusBanner({ deal }: StatusBannerProps) {
  const { role } = useRole();
  const isSeller = role === "seller";
  
  const status = deal.status;
  const banner = getStatusBanner(deal.status);
  const Icon = ICON_BY_STATUS[status] || CheckCircle2;

  const gradient = isSeller 
    ? "bg-gradient-to-br from-blue-500 to-blue-600" 
    : "bg-gradient-to-br from-[#10B981] to-[#059669]";

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "rounded-2xl p-5 shadow-lg relative overflow-hidden text-white",
        gradient
      )}
    >
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
      <div className="relative z-10">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0 backdrop-blur-md mt-0.5">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-[18px] font-bold leading-tight mb-1.5">
              {banner.title}
            </h2>
            <div className="text-[13px] text-white/90 font-medium whitespace-pre-wrap leading-relaxed space-y-1">
              {banner.lines.map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-md flex justify-between items-center mt-2">
          <span className="text-[12px] font-semibold text-white/90">Last Updated</span>
          <span className="text-[12px] font-bold text-white">{formatDateTime(deal.updatedAt)}</span>
        </div>
      </div>
    </motion.div>
  );
}

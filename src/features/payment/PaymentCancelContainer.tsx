"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FRONTEND_ROUTES } from "@/lib/contants";

export default function PaymentCancelContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dealNumber = searchParams.get("dealNumber");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        <XCircle size={28} />
      </div>
      <h2 className="text-[18px] font-extrabold tracking-tight">Checkout Cancelled</h2>
      <p className="text-[13px] text-slate-500 mt-2 max-w-[300px] mx-auto">
        You backed out of the secure payment page. Nothing was charged and your deal is still
        waiting to be funded.
      </p>
      <div className="flex flex-col gap-2.5 mt-6 w-full max-w-[280px]">
        {dealNumber && (
          <Button
            onClick={() => router.push(`${FRONTEND_ROUTES.FUND_ESCROW(dealNumber)}?step=payment`)}
            className="h-12 bg-primary hover:bg-primary/95 rounded-[14px] text-white font-bold text-[14px]"
          >
            Return to Checkout
          </Button>
        )}
        <Button
          variant="ghost"
          onClick={() => router.push(FRONTEND_ROUTES.DASHBOARD)}
          className="h-12 rounded-[14px] font-bold text-[14px] text-slate-600"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}

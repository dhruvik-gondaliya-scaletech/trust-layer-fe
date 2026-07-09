"use client";

import React from "react";
import { useRole } from "@/providers/role-provider";
import { useRouter } from "next/navigation";
import { FRONTEND_ROUTES } from "@/lib/contants";

interface QuickInsightsProps {
  activeListings: number;
  awaitingFunds: number;
  inTransit: number;
  completedDeals: number;
}

export const QuickInsights: React.FC<QuickInsightsProps> = ({
  activeListings,
  awaitingFunds,
  inTransit,
  completedDeals,
}) => {
  const { role } = useRole();
  const router = useRouter();
  const isBuyer = role === "buyer";

  const cards = [
    {
      value: activeListings,
      label: isBuyer ? "Active Orders" : "Active Deals",
      route: `${FRONTEND_ROUTES.TIMELINE}?status=Active`,
    },
    {
      value: awaitingFunds,
      label: isBuyer ? "Awaiting Deposit" : "Awaiting Funds",
      route: `${FRONTEND_ROUTES.TIMELINE}?status=Awaiting+Delivery`,
    },
    {
      value: inTransit,
      label: "In Transit",
      route: `${FRONTEND_ROUTES.TIMELINE}?status=In+Transit`,
    },
    {
      value: completedDeals,
      label: "Completed",
      route: `${FRONTEND_ROUTES.TIMELINE}?status=Completed`,
    },
  ];

  return (
    <section className="flex flex-col gap-3 select-none" aria-label="Quick Insights">
      <h2 className="text-[16px] font-bold text-foreground px-1">Quick Insights</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-card rounded-[14px] border border-border h-[96px] md:h-[110px] flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 hover:shadow-sm active:scale-95 transition-all duration-150 shadow-none"
          >
            <p className="text-[30px] font-bold leading-none mb-1 text-primary">
              {card.value}
            </p>
            <p className="text-[13px] font-medium text-muted-foreground text-center px-2 leading-tight">
              {card.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

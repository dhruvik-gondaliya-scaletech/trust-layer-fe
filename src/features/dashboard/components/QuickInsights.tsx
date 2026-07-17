"use client";

import React from "react";
import { useRole } from "@/providers/role-provider";
import { FRONTEND_ROUTES } from "@/lib/contants";
import { Briefcase, DollarSign, Truck, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const isBuyer = role === "buyer";

  const cards = [
    {
      value: activeListings,
      label: isBuyer ? "Active Orders" : "Active Deals",
      route: `${FRONTEND_ROUTES.DEAL_LISTING}?status=Active`,
      icon: Briefcase,
      iconColor: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      value: awaitingFunds,
      label: isBuyer ? "Awaiting Deposit" : "Awaiting Funds",
      route: `${FRONTEND_ROUTES.DEAL_LISTING}?status=Awaiting+Delivery`,
      icon: DollarSign,
      iconColor: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      value: inTransit,
      label: "In Transit",
      route: `${FRONTEND_ROUTES.DEAL_LISTING}?status=In+Transit`,
      icon: Truck,
      iconColor: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-50 dark:bg-purple-950/30",
    },
    {
      value: completedDeals,
      label: "Completed",
      route: `${FRONTEND_ROUTES.DEAL_LISTING}?status=Completed`,
      icon: CheckCircle2,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
  ];

  return (
    <section className="flex flex-col gap-3 select-none" aria-label="Quick Insights">
      <h2 className="text-[16px] font-bold text-foreground px-1">Quick Insights</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              // onClick={() => router.push(card.route)}
              className="bg-card rounded-[14px] border border-border h-[96px] md:h-[110px] px-5 flex items-center justify-between cursor-pointer hover:border-primary/40 hover:shadow-sm active:scale-[0.98] transition-all duration-150 shadow-none"
            >
              <div className="flex flex-col items-start gap-1">
                <p className="text-[30px] font-extrabold leading-none text-foreground">
                  {card.value}
                </p>
                <p className="text-[13px] font-semibold text-muted-foreground leading-tight">
                  {card.label}
                </p>
              </div>
              <div className={cn("p-2.5 rounded-2xl shrink-0 flex items-center justify-center", card.iconBg)}>
                <Icon className={cn("w-5 h-5 stroke-[2.5]", card.iconColor)} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};


import React from "react";

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
  const cards = [
    { value: activeListings, label: "Active Listings" },
    { value: awaitingFunds, label: "Awaiting Funds" },
    { value: inTransit, label: "In Transit" },
    { value: completedDeals, label: "Completed Deals" },
  ];

  return (
    <section className="w-full px-6 flex flex-col gap-3 select-none">
      <h2 className="text-foreground font-bold text-base tracking-tight">
        Quick Insights
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="flex flex-col p-4 bg-card border border-border/60 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200"
          >
            <span className="text-2xl font-extrabold text-foreground tracking-tight">
              {card.value}
            </span>
            <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider mt-1">
              {card.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

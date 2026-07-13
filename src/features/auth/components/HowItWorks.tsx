import React from "react";
import { Shield, Lock, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { slideUp, staggerContainer } from "@/lib/motion";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Seller creates the deal",
    description: "Upload proof, set price and shipping. Get a shareable link.",
    icon: Shield,
  },
  {
    id: 2,
    title: "Buyer secures payment",
    description: "Funds are held by TrustLayer. Seller is cleared to ship.",
    icon: Lock,
  },
  {
    id: 3,
    title: "Buyer confirms receipt",
    description: "Funds release to the seller. Both leave reviews.",
    icon: ShieldCheck,
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <div id="how-it-works-section" className="w-full px-6 py-8">
      <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-6">
        How it works
      </h2>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        className="flex flex-col gap-4"
      >
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.id}
              variants={slideUp}
              className="flex items-center gap-4 p-5 bg-card border border-border/60 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/5 text-primary">
                <Icon className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-sm sm:text-base font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

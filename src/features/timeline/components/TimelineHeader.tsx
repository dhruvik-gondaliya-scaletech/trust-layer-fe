"use client";

import { ChevronLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimelineHeaderProps {
  onBack: () => void;
}

export function TimelineHeader({ onBack }: TimelineHeaderProps) {
  return (
    <header className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border/40 z-30 shrink-0">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={onBack}
          className="w-10 h-10 rounded-full border border-border/80 flex items-center justify-center hover:bg-muted/50 active:scale-95 transition-all bg-background cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 text-foreground stroke-[2.5]" />
        </Button>

        <div className="flex items-center gap-1.5 font-black text-foreground tracking-tight text-base">
          <Shield className="w-4.5 h-4.5 text-primary fill-primary/10" />
          <span>Escrow Deal</span>
        </div>

        <div className="w-10 h-10" />
      </div>
    </header>
  );
}

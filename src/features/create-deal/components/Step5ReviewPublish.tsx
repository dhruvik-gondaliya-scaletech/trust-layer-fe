"use client";

import React, { useState } from "react";
import { Check, Mail, ShieldAlert, Sparkles, Copy, Calendar, Tag, Info, ArrowLeft, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { FRONTEND_ROUTES } from "@/lib/contants";

interface Step5ReviewPublishProps {
  formData: {
    title: string;
    price: number;
    category: string;
    condition: string;
    orderType: string;
    isGraded: boolean;
    gradedSerial?: string;
    description: string;
  };
  mainPhoto: string | null;
  productPhotos: {
    back: string | null;
    leftSide: string | null;
    rightSide: string | null;
    detail: string | null;
  };
  verificationVideo: Blob | null;
  trustScore: number;
  onBack: () => void;
}

export const Step5ReviewPublish: React.FC<Step5ReviewPublishProps> = ({
  formData,
  mainPhoto,
  productPhotos,
  verificationVideo,
  trustScore,
  onBack,
}) => {
  const router = useRouter();
  const [buyerEmail, setBuyerEmail] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [dealId, setDealId] = useState("");

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) {
      toast.error("Please agree to the escrow terms of service");
      return;
    }

    setIsSubmitting(true);
    // Simulate API Deal creation
    setTimeout(() => {
      setIsSubmitting(false);
      const generatedId = Math.random().toString(36).substring(2, 10).toUpperCase();
      setDealId(generatedId);
      setIsSuccess(true);
      toast.success("Escrow deal successfully created!");
    }, 1500);
  };

  const copyDealLink = () => {
    const link = `https://trustlayer.escrow/deals/${dealId}`;
    navigator.clipboard.writeText(link);
    toast.success("Deal invitation link copied to clipboard!");
  };

  // Convert video blob to local URL for preview
  const videoUrl = verificationVideo ? URL.createObjectURL(verificationVideo) : null;

  if (isSuccess) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="flex-1 flex flex-col justify-center items-center text-center p-6 bg-background relative overflow-hidden"
        >
          {/* Confetti Particle simulation */}
          <div className="absolute top-10 left-10 w-3 h-3 rounded-full bg-primary/20 animate-ping" />
          <div className="absolute bottom-16 right-12 w-4 h-4 rounded-full bg-emerald-500/20 animate-bounce" />

          <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 mb-6 shadow-sm shadow-emerald-500/10">
            <Check className="w-10 h-10 text-emerald-500 stroke-[3]" />
          </div>

          <h2 className="text-2xl font-extrabold text-foreground tracking-tight mb-2">
            Escrow Deal Created!
          </h2>
          <p className="text-xs text-muted-foreground max-w-[300px] leading-relaxed mb-8">
            Your verification proofs have been secured. Send the deal invitation link to your buyer.
          </p>

          {/* Deal details preview */}
          <div className="w-full bg-muted/30 border border-border/40 rounded-3xl p-5 mb-8 flex flex-col gap-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-border/30">
              <span className="text-xs font-bold text-foreground max-w-[200px] truncate">{formData.title}</span>
              <span className="text-sm font-extrabold text-primary">${formData.price.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
              <span>Deal ID</span>
              <span className="text-foreground">{dealId}</span>
            </div>

            <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
              <span>Security Score</span>
              <span className="text-emerald-500 font-black">{trustScore}/100</span>
            </div>
          </div>

          {/* Copy Link box */}
          <div className="w-full bg-muted/40 rounded-2xl p-3 border border-border/30 flex items-center justify-between mb-8 gap-3">
            <span className="text-[11px] font-medium text-muted-foreground truncate select-all pl-2">
              trustlayer.escrow/deals/{dealId}
            </span>
            <Button
              onClick={copyDealLink}
              size="sm"
              variant="secondary"
              className="rounded-xl h-8 font-bold text-[10px] tracking-wider uppercase flex items-center gap-1.5 shrink-0 bg-primary/5 text-primary hover:bg-primary/10 border-none"
            >
              <Copy className="w-3.5 h-3.5" /> Copy
            </Button>
          </div>

          <div className="w-full flex flex-col gap-3">
            <Button
              onClick={() => router.push(FRONTEND_ROUTES.DASHBOARD)}
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10 rounded-2xl h-12 text-sm font-bold active:scale-[0.98] transition-all"
            >
              Go to Dashboard
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  const extraPhotosCount = Object.values(productPhotos).filter(Boolean).length;

  return (
    <form onSubmit={handlePublish} className="flex flex-col gap-6 text-left select-none">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-extrabold text-foreground tracking-tight">Review Deal Details</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Verify all information and secured media proofs before launching this transaction.
        </p>
      </div>

      {/* Product Summary Box */}
      <div className="w-full bg-muted/30 border border-border/40 rounded-3xl p-5 flex flex-col gap-4">
        {/* Main info row */}
        <div className="flex gap-4">
          {mainPhoto ? (
            <img src={mainPhoto} alt="Product preview" className="w-16 h-16 rounded-2xl object-cover border border-border/40 shrink-0" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-muted border border-border/40 flex items-center justify-center shrink-0">
              <Tag className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
          <div className="flex flex-col justify-center min-w-0 flex-1">
            <h3 className="text-sm font-extrabold text-foreground truncate">{formData.title}</h3>
            <span className="text-base font-black text-primary mt-1">${formData.price.toLocaleString()}</span>
          </div>
        </div>

        {/* Specifications List */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/20">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Category</span>
            <span className="text-xs font-semibold text-foreground">{formData.category}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Condition</span>
            <span className="text-xs font-semibold text-foreground">{formData.condition}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Order Type</span>
            <span className="text-xs font-semibold text-foreground">{formData.orderType}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Graded</span>
            <span className="text-xs font-semibold text-foreground">
              {formData.isGraded ? `Yes (${formData.gradedSerial || "N/A"})` : "No"}
            </span>
          </div>
        </div>

        {formData.description && (
          <div className="flex flex-col gap-1 pt-3 border-t border-border/20">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Description</span>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{formData.description}</p>
          </div>
        )}
      </div>

      {/* Captured Media Proof Section */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-bold text-foreground">Verified Media Proofs</span>

        <div className="grid grid-cols-3 gap-2">
          {/* Main Photo Card */}
          {mainPhoto && (
            <div className="relative aspect-square rounded-xl overflow-hidden border border-border/30 bg-muted">
              <img src={mainPhoto} alt="Main" className="w-full h-full object-cover" />
              <div className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-xs">
                <Check className="w-2.5 h-2.5" />
              </div>
              <div className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-bold text-white tracking-wide uppercase">
                Main
              </div>
            </div>
          )}

          {/* Extra photos count indicator */}
          {extraPhotosCount > 0 && (
            <div className="relative aspect-square rounded-xl border border-border/30 bg-muted/40 flex flex-col items-center justify-center">
              <span className="text-xs font-extrabold text-foreground">{extraPhotosCount}</span>
              <span className="text-[8px] font-bold text-muted-foreground tracking-wider uppercase mt-0.5">
                Extra Pics
              </span>
              <div className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-xs">
                <Check className="w-2.5 h-2.5" />
              </div>
            </div>
          )}

          {/* Video indicator */}
          {videoUrl && (
            <div className="relative aspect-square rounded-xl overflow-hidden border border-border/30 bg-black">
              <video src={videoUrl} className="w-full h-full object-cover opacity-70" />
              <div className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-xs">
                <Check className="w-2.5 h-2.5" />
              </div>
              <div className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-bold text-white tracking-wide uppercase">
                Video
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Buyer Email */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="buyer-email" className="text-xs font-semibold text-foreground/80">
          Buyer Email Address (Optional)
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="buyer-email"
            type="email"
            value={buyerEmail}
            onChange={(e) => setBuyerEmail(e.target.value)}
            placeholder="buyer@example.com"
            className="pl-9 border-border/80"
          />
        </div>
        <p className="text-[10px] text-muted-foreground leading-normal">
          We will automatically send the secure checkout link to this email.
        </p>
      </div>

      {/* Escrow Agreement Checkbox */}
      <label className="flex items-start gap-2.5 cursor-pointer mt-2 bg-muted/20 border border-border/30 rounded-2xl p-4">
        <input
          type="checkbox"
          checked={agreedTerms}
          onChange={(e) => setAgreedTerms(e.target.checked)}
          className="mt-0.5 accent-primary h-4 w-4 rounded-md border-border/80 shrink-0"
        />
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-bold text-foreground">Secure Escrow Agreement</span>
          <span className="text-[10px] text-muted-foreground leading-normal">
            I agree that this transaction is protected by TrustLayer Escrow. Funds will be held until the buyer receives and validates the product condition.
          </span>
        </div>
      </label>

      {/* Navigation Actions */}
      <div className="flex gap-3 mt-4">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="w-14 border-border/80 rounded-2xl h-12 flex items-center justify-center active:scale-[0.98] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10 rounded-2xl h-12 text-sm font-bold active:scale-[0.98] transition-all"
        >
          {isSubmitting ? "Creating escrow deal..." : "Create Escrow Deal"}
        </Button>
      </div>
    </form>
  );
};

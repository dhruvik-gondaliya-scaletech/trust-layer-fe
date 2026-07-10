import { Spinner } from "@/components/ui/spinner";
import { CreateDealContainer } from "@/features/create-deal/container/CreateDealContainer";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Create Secure Escrow Deal | TrustLayer",
  description: "Create a new verified transaction protected by TrustLayer escrow.",
};

export default function CreateDealPage() {
  return (
    <div className="w-full flex-1 flex flex-col min-h-0 bg-[#F8FAFC]">
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <Spinner className="w-8 h-8 text-primary" />
        </div>
      }>
        <CreateDealContainer />
      </Suspense>
    </div>
  );
}

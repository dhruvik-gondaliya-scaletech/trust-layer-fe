import { Spinner } from "@/components/ui/spinner";
import { CreateDealContainer } from "@/features/create-deal/container/CreateDealContainer";
import { Suspense } from "react";

export const metadata = {
  title: "Update Deal | TrustLayer",
  description: "Modify your transaction details and verify media before publishing.",
};

export default function UpdateDealPage() {
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
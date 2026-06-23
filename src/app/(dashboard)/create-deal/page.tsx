import { CreateDealContainer } from "@/features/create-deal/container/CreateDealContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Secure Escrow Deal | TrustLayer",
  description: "Create a new verified transaction protected by TrustLayer escrow.",
};

export default function CreateDealPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <CreateDealContainer />
    </div>
  );
}

import { Suspense } from "react";
import FundEscrowContainer from "@/features/fund-escrow/container/FundEscrowContainer";

export default function FundEscrowPage() {
  return (
    <Suspense fallback={null}>
      <FundEscrowContainer />
    </Suspense>
  );
}

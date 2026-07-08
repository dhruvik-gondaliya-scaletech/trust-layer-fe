import { Suspense } from "react";
import PaymentCancelContainer from "@/features/payment/PaymentCancelContainer";

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={null}>
      <PaymentCancelContainer />
    </Suspense>
  );
}

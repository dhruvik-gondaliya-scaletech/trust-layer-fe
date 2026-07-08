import { Suspense } from "react";
import PaymentSuccessContainer from "@/features/payment/PaymentSuccessContainer";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <PaymentSuccessContainer />
    </Suspense>
  );
}

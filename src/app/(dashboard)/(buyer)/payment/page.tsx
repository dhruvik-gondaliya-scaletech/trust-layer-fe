import { redirect } from "next/navigation";
import { FRONTEND_ROUTES } from "@/lib/contants";

export default function PaymentIndexPage() {
  redirect(FRONTEND_ROUTES.DASHBOARD);
}

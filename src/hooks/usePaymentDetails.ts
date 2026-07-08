import { useState } from "react";
import type { BillingAddress, CheckoutSubView, PaymentMethodType } from "@/types/fund-escrow.types";

const DEFAULT_BILLING_ADDRESS: BillingAddress = {
  name: "Alex Johnson",
  street: "123 Main Street",
  apt: "",
  city: "Austin",
  state: "TX",
  zip: "78701",
  country: "United States",
};

// Card details are collected on Stripe's hosted Checkout page; this hook only
// manages the local billing-address record and checkout sub-view state.
export function usePaymentDetails() {
  const [checkoutSubView, setCheckoutSubView] = useState<CheckoutSubView>("main");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("card");
  const [savedBillingAddress, setSavedBillingAddress] = useState<BillingAddress | null>(DEFAULT_BILLING_ADDRESS);

  const [billingFirstName, setBillingFirstName] = useState("Alex");
  const [billingLastName, setBillingLastName] = useState("Johnson");
  const [billingStreet, setBillingStreet] = useState("123 Main Street");
  const [billingApt, setBillingApt] = useState("");
  const [billingCity, setBillingCity] = useState("Austin");
  const [billingState, setBillingState] = useState("TX");
  const [billingZip, setBillingZip] = useState("78701");

  const isBillingFormValid = Boolean(
    billingFirstName && billingLastName && billingStreet && billingCity && billingState && billingZip
  );

  const handleSaveBillingAddress = () => {
    if (!isBillingFormValid) return;

    setSavedBillingAddress({
      name: `${billingFirstName} ${billingLastName}`,
      street: billingStreet,
      apt: billingApt,
      city: billingCity,
      state: billingState,
      zip: billingZip,
      country: "United States",
    });
    setCheckoutSubView("main");
  };

  return {
    checkoutSubView,
    setCheckoutSubView,
    paymentMethod,
    setPaymentMethod,

    savedBillingAddress,

    billingFirstName,
    setBillingFirstName,
    billingLastName,
    setBillingLastName,
    billingStreet,
    setBillingStreet,
    billingApt,
    setBillingApt,
    billingCity,
    setBillingCity,
    billingState,
    setBillingState,
    billingZip,
    setBillingZip,
    isBillingFormValid,

    handleSaveBillingAddress,
  };
}

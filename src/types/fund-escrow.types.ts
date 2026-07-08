import type { ShippingAddress } from "@/types/address.types";
import type { Wallet } from "@/types/api.types";

export interface Deal {
    id: string;
    dealNumber: string;
    title: string;
    price: number;
    shippingCost: number;
    feePayer: string;
    carrier: string;
    shippingType: string;
    condition?: string;
    trustScore?: number;
    seller?: {
        username: string | null;
        profilePhotoUrl: string | null;
    };
}

export interface FundEscrowWizardProps {
    deal: Deal;
    currentStep: number;
    setStep: (step: number) => void;
    selectedAddress: ShippingAddress | undefined;
    addresses: ShippingAddress[];
    wallet: Wallet | undefined;
    onSelectAddress: (id: string) => void;
    onSetDefaultAddress: (id: string) => void;
    onDeleteAddress: (id: string) => void;
    onAddAddressClick: () => void;
    onSubmitPayment: (paymentMethod: PaymentMethodType) => Promise<void>;
    isSubmittingPayment: boolean;
    onGoToTimeline: () => void;
}

export type CheckoutSubView = "main" | "add-billing";
export type PaymentMethodType = "card" | "wallet";

export interface BillingAddress {
    name: string;
    street: string;
    apt: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

export interface AgreementChecked {
    details: boolean;
    shipping: boolean;
    fees: boolean;
}

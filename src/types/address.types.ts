export interface ShippingAddress {
  id: string;
  type: "Home" | "Office" | "Other";
  customLabel?: string;
  name: string;
  street: string;
  apt?: string;
  zip: string;
  city: string;
  state: string;
  country: string;
  alternatePhone?: string;
  isDefault: boolean;
}

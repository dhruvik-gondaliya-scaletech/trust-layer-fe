import httpService from "@/lib/http-services";
import { API_CONFIG } from "@/lib/contants";
import { ShippingAddress } from "@/types/address.types";
import { AddressFormInput } from "@/lib/validations/address";

interface BackendAddress {
  id: string;
  label?: string;
  contactName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  alternatePhone?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

function mapToFrontend(backend: BackendAddress): ShippingAddress {
  let type: "Home" | "Office" | "Other" = "Other";
  let customLabel: string | undefined = undefined;

  if (backend.label === "Home" || backend.label === "Office") {
    type = backend.label;
  } else if (backend.label) {
    type = "Other";
    customLabel = backend.label;
  }

  return {
    id: backend.id,
    type,
    customLabel,
    name: backend.contactName,
    street: backend.line1,
    apt: backend.line2,
    city: backend.city,
    state: backend.state,
    zip: backend.zip,
    country: backend.country || "United States",
    alternatePhone: backend.alternatePhone,
    isDefault: backend.isDefault ?? false,
  };
}

function mapToBackend(input: AddressFormInput) {
  const label = input.type === "Other" ? input.customLabel : input.type;
  return {
    label: label || undefined,
    contactName: input.name,
    line1: input.street,
    line2: input.apt || undefined,
    city: input.city,
    state: input.state,
    zip: input.zip,
    country: input.country || "United States",
    alternatePhone: input.alternatePhone || undefined,
  };
}

class AddressService {
  async getAddresses(): Promise<ShippingAddress[]> {
    const res = await httpService.get<BackendAddress[]>(API_CONFIG.USERS.ADDRESSES);
    // httpService unwraps the success envelope, so res.data is the array of BackendAddress
    const addresses = res.data || [];
    return addresses.map(mapToFrontend);
  }

  async addAddress(input: AddressFormInput): Promise<ShippingAddress> {
    const backendDto = mapToBackend(input);
    const res = await httpService.post<BackendAddress>(API_CONFIG.USERS.ADDRESSES, backendDto);
    return mapToFrontend(res.data);
  }

  async setDefaultAddress(id: string): Promise<ShippingAddress[]> {
    await httpService.patch<BackendAddress>(API_CONFIG.USERS.ADDRESS_BY_ID(id), {
      isDefault: true,
    });
    return this.getAddresses();
  }

  async deleteAddress(id: string): Promise<ShippingAddress[]> {
    await httpService.delete<void>(API_CONFIG.USERS.ADDRESS_BY_ID(id));
    return this.getAddresses();
  }
}

const addressService = new AddressService();
export default addressService;

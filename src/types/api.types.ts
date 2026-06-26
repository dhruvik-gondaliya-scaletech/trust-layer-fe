// ─── Enums ────────────────────────────────────────────────────────────────────

export type OtpType = "email_verification" | "phone_verification";
export type UserRole = "user" | "admin";
export type UserStatus = "active" | "frozen" | "banned";
export type ProductType =
  | "trading_cards"
  | "sports_cards"
  | "toy"
  | "plush"
  | "figure"
  | "other";
export type OrderType = "online" | "in_person";
export type HandlingTime = "1-2" | "3-5";
export type Carrier = "USPS" | "UPS" | "FedEx" | "Other";
export type ShippingType = "standard" | "priority";
export type FeePayer = "seller" | "buyer" | "split";
export type DealStatus =
  | "draft"
  | "open"
  | "funded"
  | "shipped"
  | "delivered"
  | "disputed"
  | "completed"
  | "cancelled";
export type MediaType =
  | "main_photo"
  | "additional_photo"
  | "video"
  | "closeup"
  | "damage"
  | "serial_cert"
  | "package_label"
  | "package_video"
  | "drop_off_receipt";

// ─── Data Models ──────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  username: string | null;
  profilePhotoUrl: string | null;
  bio: string | null;
  location: string | null;
  emailVerifiedAt: string | null;
  phoneVerifiedAt: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface PublicUser {
  id: string;
  username: string | null;
  profilePhotoUrl: string | null;
  bio: string | null;
  location: string | null;
  createdAt: string;
}

export interface DealMedia {
  id: string;
  dealId: string;
  uploadedBy: string;
  type?: MediaType;
  url: string;
  mimeType: string | null;
  sizeBytes: number | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Deal {
  id: string;
  dealNumber: string;
  sellerId: string;
  buyerId: string | null;
  title: string;
  price: string;
  productType: ProductType;
  orderType: OrderType;
  isGraded: boolean;
  serialNumber: string | null;
  description: string | null;
  condition: string | null;
  notes: string | null;
  handlingTime: HandlingTime | null;
  carrier: Carrier | null;
  carrierOther: string | null;
  shippingType: ShippingType | null;
  shippingCost: string;
  isInsured: boolean;
  requireSignatureDelivery: boolean;
  requireBuyerPackagingPhotos: boolean;
  feePayer: FeePayer;
  platformFeeAmount: string;
  buyerPaysAmount: string;
  sellerReceivesAmount: string;
  trustScore: number;
  status: DealStatus;
  publishedAt: string | null;
  fundedAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  autoReleaseAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  // Relations (when loaded)
  seller?: User;
  buyer?: User | null;
  media?: DealMedia[];
}

// ─── Auth DTOs ────────────────────────────────────────────────────────────────

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface VerifyOtpDto {
  type: OtpType;
  code: string;
}

export interface ResendOtpDto {
  type: OtpType;
}

export interface SendPhoneOtpDto {
  phone: string;
}

export interface AuthTokenResponse {
  accessToken?: string;
  refreshToken?: string;
  registrationToken?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  profileComplete?: boolean;
}

export interface RegisterResponse extends AuthTokenResponse {
  message: string;
}

export interface MessageResponse {
  message: string;
  registrationToken?: string;
  accessToken?: string;
  refreshToken?: string;
}

// ─── User DTOs ────────────────────────────────────────────────────────────────

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
  location?: string;
  profilePhotoUrl?: string;
}

// ─── Deal DTOs ────────────────────────────────────────────────────────────────

export interface CreateDealDto {
  title: string;
  price: number;
  productType: ProductType;
  orderType?: OrderType;
  isGraded?: boolean;
  serialNumber?: string;
  description?: string;
  condition?: string;
  notes?: string;
  handlingTime?: HandlingTime;
  carrier?: Carrier;
  carrierOther?: string;
  shippingType?: ShippingType;
  shippingCost?: number;
  isInsured?: boolean;
  requireSignatureDelivery?: boolean;
  requireBuyerPackagingPhotos?: boolean;
  feePayer?: FeePayer;
  trustScore?: number;
}

export type UpdateDealDto = Partial<CreateDealDto>;

export interface PresignedUrlResponse {
  presignedUrl: string;
  key: string;
  url: string;
}

export interface ConfirmMediaDto {
  key: string;
  mimeType: string;
  sizeBytes: number;
  sortOrder: number;
}

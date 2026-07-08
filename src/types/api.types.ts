import type { ProofType, UploadPurpose, NotificationType } from "@/types/enums";

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
  | "return_approved"
  | "return_shipped"
  | "return_delivered"
  | "return_completed"
  | "cancelled"
  | "closed";
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
export type NotificationChannel = "email" | "sms" | "in_platform";
export type NotificationStatus = "pending" | "sent" | "failed";

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
  stripePaymentIntentId: string | null;
  trustScore: number;
  status: DealStatus;
  publishedAt: string | null;
  fundedAt: string | null;
  trackingNumber: string | null;
  shippingNotes: string | null;
  shippedAt: string | null;
  estimatedDeliveryAt: string | null;
  deliveredAt: string | null;
  autoReleaseAt: string | null;
  expiresAt: string | null;
  shippingAddressId: string | null;
  shippingContactName: string | null;
  shippingLine1: string | null;
  shippingLine2: string | null;
  shippingCity: string | null;
  shippingState: string | null;
  shippingZip: string | null;
  shippingCountry: string | null;
  shippingPhone: string | null;
  shippingAlternatePhone: string | null;
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
  shippingCost?: number | null;
  feePayer?: FeePayer;
  trustScore?: number;
  publish?: boolean;
  media?: ConfirmMediaDto[];
}

export type UpdateDealDto = Partial<Omit<CreateDealDto, "media">>;

export interface ConfirmMediaDto {
  key: string;
  mimeType: string;
  sizeBytes?: number;
  sortOrder?: number;
  proofType: ProofType;
}

export interface DeclineDealDto {
  reason: string;
  explanation?: string;
}

export interface ShipDealDto {
  carrier: string;
  shippingType: ShippingType;
  trackingNumber: string;
  estimatedDeliveryAt: string;
  isInsured?: boolean;
  notes?: string;
}

export interface DealStatusResponse {
  dealNumber: string;
  status: DealStatus;
}

// ─── S3 DTOs ──────────────────────────────────────────────────────────────────

export interface S3PreSignFileRequest {
  purpose: UploadPurpose;
  fileName: string;
  contentType: string;
  /**
   * For purpose=deal_media when the deal already exists: presigns the file
   * directly into that deal's own S3 folder instead of the shared temp/ folder.
   * The caller must be a party to the deal.
   */
  dealId?: string;
}

export interface S3PreSignRequestDto {
  files: S3PreSignFileRequest[];
}

export interface S3PreSignResponse {
  url: string;
  fields: Record<string, string>;
  key: string;
  cdnUrl: string;
}

// ─── Wallet Models ─────────────────────────────────────────────────────────────

export interface Wallet {
  id: string;
  userId: string;
  pendingBalance: string;
  availableBalance: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// ─── Notification Models ───────────────────────────────────────────────────────

export interface Notification {
  id: string;
  userId: string;
  dealId: string | null;
  type: NotificationType;
  channel: NotificationChannel;
  status: NotificationStatus;
  subject: string | null;
  body: string;
  sentAt: string | null;
  readAt: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface PaginatedNotifications {
  items: Notification[];
  total: number;
  page: number;
  limit: number;
}

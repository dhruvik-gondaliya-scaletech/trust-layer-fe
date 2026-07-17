export enum ProofType {
    ITEM_MEDIA = 'item_media',
    DROP_OFF_RECEIPT = 'drop_off_receipt',
    PACKAGE = 'package',
    UNBOXING = 'unboxing',
    DISPUTE_EVIDENCE = 'dispute_evidence',
    SELLER_EVIDENCE = 'seller_evidence',
    RETURN_ITEM = 'return_item',
    RETURN_PACKAGE = 'return_package',
}

export enum VerificationStep {
    EMAIL_VERIFY = "email-verify",
    EMAIL_SUCCESS = "email-success",
    PHONE_INPUT = "phone-input",
    PHONE_VERIFY = "phone-verify",
    PHONE_SUCCESS = "phone-success",
    PROFILE_SETUP = "profile-setup",
}

export enum Role {
    BUYER = "buyer",
    SELLER = "seller",
}

export enum PaymentMethodType {
    CARD = "card",
    WALLET = "wallet",
}

export enum OrderType {
    ONLINE = "online",
    IN_PERSON = "in_person",
}

export enum UploadPurpose {
    PROFILE_PHOTO = 'profile_photo',
    DEAL_MEDIA = 'deal_media',
}

export enum NotificationType {
    EMAIL_OTP = 'email_otp',
    PHONE_OTP = 'phone_otp',
    DEAL_CREATED = 'deal_created',
    DEAL_PUBLISHED = 'deal_published',
    DEAL_FUNDED_SELLER = 'deal_funded_seller',
    DEAL_FUNDED_BUYER = 'deal_funded_buyer',
    DEAL_DECLINED = 'deal_declined',
    DEAL_SHIPPED = 'deal_shipped',
    DEAL_COMPLETED = 'deal_completed',
}

export enum DealStatus {
    DRAFT = 'draft',
    OPEN = 'open',
    FUNDED = 'funded',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    DISPUTED = 'disputed',
    RETURN_APPROVED = 'return_approved',
    RETURN_SHIPPED = 'return_shipped',
    RETURN_DELIVERED = 'return_delivered',
    RETURN_COMPLETED = 'return_completed',
    CANCELLED = 'cancelled',
    CLOSED = 'closed',
}

export enum DealDetailsActionType {
    CONFIRM_DELIVERY = 'confirm-delivery',
    REVIEW = 'review',
    PUBLISH = 'publish',
}

export enum CameraMode {
    MAIN = "main",
    FRONT = "front",
    BACK = "back",
    SIDE = "side",
    DETAIL = "detail",
    VIDEO = "video",
}

export enum DisputeStatus {
    CREATED = 'created',
    SELLER_RESPONDED = 'seller_responded',
    ESCALATED = 'escalated',
    RESOLVED = 'resolved',
}

export enum DisputeAction {
    REFUND = 'refund',
    RETURN = 'return',
    DECLINE = 'decline',
}
# Graph Report - .  (2026-07-02)

## Corpus Check
- 165 files · ~56,730 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 640 nodes · 1545 edges · 21 communities (16 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Checkout & Onboarding UI|Checkout & Onboarding UI]]
- [[_COMMUNITY_Dashboard UI Components|Dashboard UI Components]]
- [[_COMMUNITY_Auth & Landing Pages|Auth & Landing Pages]]
- [[_COMMUNITY_Deal Status & Timeline|Deal Status & Timeline]]
- [[_COMMUNITY_Deal Creation Wizard Steps|Deal Creation Wizard Steps]]
- [[_COMMUNITY_Fund Escrow Wizard Flow|Fund Escrow Wizard Flow]]
- [[_COMMUNITY_Buyer Deal View|Buyer Deal View]]
- [[_COMMUNITY_User Verification Flow|User Verification Flow]]
- [[_COMMUNITY_Proof & Trust Score|Proof & Trust Score]]
- [[_COMMUNITY_Deal Queries & API Types|Deal Queries & API Types]]
- [[_COMMUNITY_Address & Escrow State|Address & Escrow State]]
- [[_COMMUNITY_Auth Storage & OTP|Auth Storage & OTP]]
- [[_COMMUNITY_App Layout & Providers|App Layout & Providers]]
- [[_COMMUNITY_Auth Provider & Session|Auth Provider & Session]]
- [[_COMMUNITY_HTTP & Service Layer|HTTP & Service Layer]]
- [[_COMMUNITY_Dashboard Data & Utils|Dashboard Data & Utils]]
- [[_COMMUNITY_HTTP Client Singleton|HTTP Client Singleton]]
- [[_COMMUNITY_Your Activity Widget|Your Activity Widget]]
- [[_COMMUNITY_Window Hook|Window Hook]]
- [[_COMMUNITY_Signup Validation|Signup Validation]]
- [[_COMMUNITY_OpenCV Type Defs|OpenCV Type Defs]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 71 edges
2. `Button()` - 45 edges
3. `FRONTEND_ROUTES` - 22 edges
4. `ShippingAddress` - 16 edges
5. `Label` - 13 edges
6. `BottomActionBar()` - 11 edges
7. `Card()` - 11 edges
8. `useDeal()` - 11 edges
9. `useRole()` - 11 edges
10. `HttpService` - 10 edges

## Surprising Connections (you probably didn't know these)
- `SheetFooter()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/sheet.tsx → src/lib/utils.ts
- `DashboardLayout()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/(dashboard)/layout.tsx → src/providers/auth-provider.tsx
- `PublicLayout()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/(public)/layout.tsx → src/providers/auth-provider.tsx
- `Home()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/page.tsx → src/providers/auth-provider.tsx
- `AnimatedModal()` --calls--> `cn()`  [EXTRACTED]
  src/components/shared/animated-modal.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (21 total, 5 thin omitted)

### Community 0 - "Checkout & Onboarding UI"
Cohesion: 0.05
Nodes (60): AddShippingAddress(), AddBillingAddressStepProps, cardElementOptions, DashboardEmptyProps, DECLINE_REASONS, DeclineModal(), DeclineModalProps, ProfileSetupStep() (+52 more)

### Community 1 - "Dashboard UI Components"
Cohesion: 0.05
Nodes (37): DashboardEmpty(), DashboardError(), DashboardErrorProps, DashboardHeader(), DashboardHeaderProps, getGreeting(), DashboardSkeleton(), HowItWorks() (+29 more)

### Community 2 - "Auth & Landing Pages"
Cohesion: 0.07
Nodes (25): Home(), LoginForm(), LoginFormProps, RegisterForm(), RegisterFormProps, WalkthroughOverlay(), WalkthroughOverlayProps, BuyerDealPageContainer() (+17 more)

### Community 3 - "Deal Status & Timeline"
Cohesion: 0.06
Nodes (36): DealStatusCard(), DealStatusCardProps, DELIVERED_OR_LATER, EscrowTimelineSteps(), EscrowTimelineStepsProps, IN_TRANSIT_OR_LATER, MediaCarousel(), MediaCarouselProps (+28 more)

### Community 4 - "Deal Creation Wizard Steps"
Cohesion: 0.09
Nodes (34): CATEGORIES, CONDITIONS, Step1FormData, Step1ItemDetails(), HANDLING_TIMES, Step3Shipping(), Step3ShippingData, Step3ShippingProps (+26 more)

### Community 5 - "Fund Escrow Wizard Flow"
Cohesion: 0.10
Nodes (31): AddBillingAddressStep(), AddCardStep(), FundEscrowWizard(), FundingStep(), FundingStepProps, ShippingAddressStep(), ShippingAddressStepProps, SuccessStep() (+23 more)

### Community 6 - "Buyer Deal View"
Cohesion: 0.08
Nodes (28): BottomCta(), BottomCtaProps, BuyerView(), FeedbackSuccessModal(), FeedbackSuccessModalProps, FeeSummaryCard(), FeeSummaryCardProps, MediaGallery() (+20 more)

### Community 7 - "User Verification Flow"
Cohesion: 0.11
Nodes (30): EmailVerifyStep(), EmailVerifyStepProps, PhoneInputStep(), PhoneInputStepProps, PhoneVerifyStep(), PhoneVerifyStepProps, ProfileSetupStepProps, VerifyContainer() (+22 more)

### Community 8 - "Proof & Trust Score"
Cohesion: 0.09
Nodes (27): CameraFeedback, CameraValidation(), CameraValidationProps, Step1ItemDetailsProps, PHOTO_SLOTS, Step2ProofVerification(), Step2ProofVerificationProps, FLUID_COLORS (+19 more)

### Community 9 - "Deal Queries & API Types"
Cohesion: 0.09
Nodes (21): dealKeys, Carrier, ConfirmMediaDto, CreateDealDto, Deal, DealMedia, DealStatus, DeclineDealDto (+13 more)

### Community 10 - "Address & Escrow State"
Cohesion: 0.12
Nodes (18): AddShippingAddressProps, AddShippingAddressContainer(), FundEscrowContainer(), stripePromise, addressKeys, useAddAddress(), useAddresses(), useDeleteAddress() (+10 more)

### Community 11 - "Auth Storage & OTP"
Cohesion: 0.13
Nodes (19): removeCookie(), removeStorageItem(), removeStorageItems(), setCookie(), setStorageItem(), setStorageItems(), clearTokens(), storeTokens() (+11 more)

### Community 12 - "App Layout & Providers"
Cohesion: 0.13
Nodes (13): geistMono, inter, metadata, ConfettiContext, ConfettiContextValue, ConfettiOptions, ConfettiOrigin, ConfettiProvider() (+5 more)

### Community 13 - "Auth Provider & Session"
Cohesion: 0.20
Nodes (14): getCookie(), getStorageItem(), AuthContext, AuthContextValue, AuthProvider(), AuthStatus, hasStoredToken(), useLoginMutation() (+6 more)

### Community 14 - "HTTP & Service Layer"
Cohesion: 0.16
Nodes (10): API_CONFIG, ApiError, ApiErrorResponse, ApiSuccessResponse, PUBLIC_ROUTES, s3Service, walletService, S3PreSignRequestDto (+2 more)

### Community 15 - "Dashboard Data & Utils"
Cohesion: 0.20
Nodes (7): formatCurrency(), DashboardData, dashboardKeys, dealsService, usersService, PublicUser, UpdateProfileDto

## Knowledge Gaps
- **113 isolated node(s):** `stripePromise`, `metadata`, `metadata`, `metadata`, `metadata` (+108 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Button()` connect `Checkout & Onboarding UI` to `Dashboard UI Components`, `Auth & Landing Pages`, `Deal Status & Timeline`, `Deal Creation Wizard Steps`, `Fund Escrow Wizard Flow`, `Buyer Deal View`, `User Verification Flow`, `Proof & Trust Score`, `Address & Escrow State`?**
  _High betweenness centrality (0.159) - this node is a cross-community bridge._
- **Why does `cn()` connect `Checkout & Onboarding UI` to `Dashboard UI Components`, `Deal Status & Timeline`, `Deal Creation Wizard Steps`, `Fund Escrow Wizard Flow`, `Buyer Deal View`, `User Verification Flow`, `Proof & Trust Score`?**
  _High betweenness centrality (0.133) - this node is a cross-community bridge._
- **Why does `FRONTEND_ROUTES` connect `Auth & Landing Pages` to `Checkout & Onboarding UI`, `Dashboard UI Components`, `Deal Creation Wizard Steps`, `User Verification Flow`, `Address & Escrow State`, `Auth Storage & OTP`, `HTTP & Service Layer`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **What connects `stripePromise`, `metadata`, `metadata` to the rest of the system?**
  _113 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Checkout & Onboarding UI` be split into smaller, more focused modules?**
  _Cohesion score 0.051511758118701005 - nodes in this community are weakly interconnected._
- **Should `Dashboard UI Components` be split into smaller, more focused modules?**
  _Cohesion score 0.0544464609800363 - nodes in this community are weakly interconnected._
- **Should `Auth & Landing Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.07239819004524888 - nodes in this community are weakly interconnected._
# 🛡️ TrustLayer Frontend

A premium, secure, and production-ready mobile-first frontend application for the **TrustLayer** platform. TrustLayer is a peer-to-peer escrow and deal facilitation platform designed specifically for high-value collectibles (trading cards, sports cards, figures, toys, plush, etc.). It enables buyers and sellers to conduct trusted transactions with automated trust scoring, secure media uploads, and integrated verification flows.

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` or `.env.local` file in the root directory and configure the base URL for the backend API:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the application in action.

---

## 🛠 Tech Stack

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **Runtime & UI Library:** [React 19](https://react.dev/) & [Radix UI](https://www.radix-ui.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) with HSL design tokens & CSS Variables
- **State Management:** [TanStack React Query v5](https://tanstack.com/query/latest)
- **API Client:** [Axios](https://axios-http.com/) (configured with auto-refresh interceptors)
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) (centralized transitions)
- **Date Handling:** [date-fns](https://date-fns.org/)
- **Feedback:** [Sonner](https://github.com/emilkowalski/sonner) (Toast notifications)

---

## 📂 Project Structure

```text
├── public/                # Static assets (icons, images)
├── src/
│   ├── app/               # Next.js App Router (Pages, Layouts, Route Guards)
│   ├── components/        # Reusable UI components & Design System primitives
│   ├── features/          # Feature-based logic divided into container (smart) and components (dumb)
│   │   ├── auth/          # Registration, Login, and OTP Verification UI
│   │   ├── deals/         # Deal creation, S3 uploads, and Transaction views
│   │   └── profile/       # User profile details and settings
│   ├── hooks/             # Custom React hooks (queries, mutations, and authentication)
│   ├── lib/               # Utility functions (date formatting, storage helpers, validations)
│   ├── services/          # API HTTP services and S3 client integrations
│   ├── styles/            # Global CSS, HSL palette declarations, and Tailwind configuration
│   └── types/             # Strict TypeScript definitions & API models
```

---

## ✨ Core Features

- **Mobile-First Layout Constraint:** Engineered with a strict responsive constraint wrapper (`max-width: 430px`, centered layout with background framing on wider screens) matching modern mobile application standards.
- **Verification Flow Guards:** Prevents unauthorized dashboard access using route-level server-side guards and client-side middleware. Users are securely redirected until email, phone OTP, and profile requirements are met.
- **P2P Escrow & Deal Management:** Facilitates the creation and modification of secure deals. Seamlessly displays fee breakdowns (buyer, seller, or split platform fee modes) and updates trust scores.
- **Direct-to-S3 Presigned Media Uploads:** High-performance, 3-step media ingestion pipeline (Retrieve S3 Presigned URL ➡️ Upload file directly to AWS S3 ➡️ Confirm upload metadata with database).
- **State Handling Discipline:** Enforces loading skeletons, user-friendly error views (without exposing backend stack traces), empty states, and unauthorized (401/403) fallbacks on every screen.

---

## 🎨 Design & Styling Guidelines

- **HSL Design Palette:** Uses unified brand colors (primary blue `#0066FF`, background `#F8FAFC`, etc.) mapped via CSS variables.
- **Responsive Layout Wrapper:** All page contents must sit inside the centered constraint layout:
  ```tsx
  // Example page wrapper structure
  <div className="mx-auto max-width-[430px] min-h-screen bg-[#F8FAFC] shadow-2xl overflow-x-hidden relative">
    {/* Page content */}
  </div>
  ```
- **Conditional Class Merging:** Always use the `cn` utility (combining `clsx` and `tailwind-merge`) when applying conditional classes dynamically.

---

## 🚢 Production Build & Deployment

To verify TypeScript types and build the production bundle:
```bash
npm run build
```
The project is optimized for deployment on the [Vercel Platform](https://vercel.com).



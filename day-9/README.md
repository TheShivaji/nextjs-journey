# Day 9: User Card Studio ⚡

A modern, vibrant User Profile Card management studio built as part of Day 9 of the Next.js Learning Journey.

## 🚀 Tech Stack & Highlights

- **Framework**: Next.js (App Router, Turbopack)
- **Database & ORM**: Serverless Neon PostgreSQL + **Drizzle ORM**
- **API & Mutations Layer**: Next.js **Server Actions** (`actions/userActions.ts`) with auto-retry resilience.
- **Client State Management**: **TanStack React Query** (`@tanstack/react-query`) utilizing `useQuery`, `useMutation`, and cache invalidation.
- **Styling & Aesthetics**: Tailwind CSS with sleek dark mode glassmorphism, dynamic gradients, and ambient background glows.

---

## ✨ Features

1. **Instant Card Generation**: Fill in specifications (Name, Email, Role, Bio, Gradient Preset) and inject cards instantly via TanStack Query mutations.
2. **Active Deck Grid**: View all crafted developer cards with active status ping indicators.
3. **Deep Inspection & Management (`/users/[id]`)**: Click any card to inspect full specs, toggle inline modification mode (Edit), or permanently purge (Delete).

---

## 🛠️ Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Database Initialization**:
   Ensure your `.env` contains a valid `DATABASE_URL` pointing to your Neon Postgres instance, then verify schema:
   ```bash
   node scripts/init-db.mjs
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

# Next.js Learning Journey 🚀

Welcome to my daily Next.js learning repository! This repo tracks my step-by-step progress as I learn Next.js, transitioning from standard React and MERN stack concepts to modern Next.js development patterns.

---

## 📅 Roadmap & Daily Log

### 🟦 Day 1: Introduction & Environment Setup
* **Concepts Learned:**
  * Introduction to Next.js and how it differs from standard React (`Vite` / `CRA`).
  * Understanding the Next.js project structure, configuration files (`next.config.mjs`), and routing concepts.
  * Setting up the development environment.

---

### 🟨 Day 2: Advanced Routing & Client vs Server Components
* **Concepts Learned:**
  * **File-based Routing:** Static routing using nested folders under `app/` (e.g., `product`, `contact`, `shiv`).
  * **Dynamic Routing:** Creating dynamic routes using bracket notation (e.g., `product/price/[id]`).
  * **Component Types:** Understanding the difference between Server Components (default in App Router) and Client Components using `"use client"`.
  * **State & Event Handling:** Using React hooks like `useState` and `useEffect` in Next.js Client Components.

---

### 🟩 Day 3: Full-Stack Integration (Notes App CRUD)
* **Concepts Learned:**
  * **API Routes:** Creating backend endpoints in Next.js using `app/api/route.js`.
  * **Database Connection:** Integrating MongoDB Atlas using Mongoose.
  * **Full CRUD Operations:** Creating, reading, updating, and deleting notes.
  * **Frontend-Backend Integration:** Fetching data from local APIs (`/api/notes`) and displaying it dynamically with a glassmorphic dark-themed UI.
  * **Crucial Debugging:** Identifying and fixing Mongoose queries, schema timestamps (`createdAt`), database connection awaiting, and Next.js route parameter rules.

---

### 🟧 Day 4: Next.js MVC (Model-View-Controller) Architecture
* **Concepts Learned:**
  * Cleaner API Code: Writing modular API endpoints that are easy to maintain, scale, and test.

---

### 🟪 Day 5: Next.js Navigation Hooks & Redirects
* **Concepts Learned:**
  * **`usePathname` Hook:** Client-side hook for tracking the active path and building active links/indicators in navbars/sidebars.
  * **`useSearchParams` Hook:** Client-side hook for retrieving URL search/query parameters (e.g. `?tab=settings`, `?product=1`, or checking redirect errors like `?error=deprecated`).
  * **`useParams` Hook:** Client-side hook for reading dynamic route parameters (e.g., retrieving `id` from `[id]/page.jsx` or `slug` from `[slug]/page.jsx`).
  * **`useRouter` Hook:** Client-side hook for programmatic navigation (e.g., `router.push()`, `router.replace()`, `router.refresh()`, `router.back()`).
  * **`redirect()` Function:** Used for instant redirect redirection during both server and client rendering phases.
  * **Prerender Suspense Boundaries:** Discovered why client components utilizing `useSearchParams()` must be wrapped in a React `<Suspense>` boundary during static generation/prerendering.

---

### 🟥 Day 6: Server Actions & Modern Form Handling
* **Concepts Learned:**
  * **Server Actions (`"use server"`):** Defining asynchronous functions that execute strictly on the server, removing the need for manual API routes to perform operations like database creation/updates.
  - **React 19 Form Hooks (`useActionState`, `useTransition`):** Managing pending states, spinners, and structured success/error notifications inline without manual state trackers.
  - **Cache Revalidation (`revalidatePath`):** Informing Next.js to purge route cache on the server, triggering automatic UI updates in components without page reloads.
  - **JSON Serialization Limits:** Solving Next.js's serialization restrictions on Server-to-Client boundary calls by converting Mongoose ObjectIds (`_id.toString()`) and Dates (`toISOString()`) into plain JSON-serializable types.
  - **Dynamic Admin Dashboard:** Building robust administrative pages using combined Server Component data fetching and interactive Client Component filters.

---

### 🟫 Day 7: State Management & TanStack Query (Todo App)
* **Concepts Learned:**
  * **Zustand Store (`hook/useTodoStore.js`):** Client-side global state management using Zustand for UI interactions.
  * **TanStack React Query:** Integrating `@tanstack/react-query` (`useQuery`, `useMutation`) with Next.js for asynchronous server synchronization and caching.

---

### 🔲 Day 8: Complete Posts CRUD with Prisma & TypeScript
* **Concepts Learned:**
  * **Prisma ORM (`prisma/schema.prisma`):** Defining relational database schemas and running Prisma Client migrations connected to PostgreSQL.
  * **TypeScript Server Actions:** Writing strongly-typed server actions (`app/action/user.action.ts`) for database operations.
  * **Full Flow Architecture:** Building Dashboard lists (`posts/page.tsx`), Post creation studios (`createPost/page.tsx`), and standalone post detail pages (`posts/[id]/page.tsx`).

---

### ⚡ Day 9: User Cards Studio with Drizzle ORM & TanStack Query
* **Concepts Learned:**
  * **Drizzle ORM (`schema/drizzle.ts`):** Lightweight SQL-first ORM setup connected to serverless **Neon PostgreSQL**.
  * **Database Init Scripts (`scripts/init-db.mjs`):** Automated SQL table verification bypassing interactive TTY terminal prompts.
  * **Server Actions API (`actions/userActions.ts`):** Type-safe CRUD operations wrapped in retry resilience (`withRetry`) to gracefully handle serverless sleep wakeups.
  * **Interactive Studio & Deep Inspection:** Dashboard with TanStack Query mutations (`useMutation`) and standalone profile spec management pages (`users/[id]/page.tsx`).
  * **Hydration Warning Suppression:** Fixing browser extension attributes interference on root HTML/Body elements.

---

## 📂 Master Directory Structure

Here is how the project workspace is structured:

```text
Nextjs learrning/
├── day-1/                     # Basic setup and intro
├── day-2/                     # Routing, Dynamic routes, Client components
├── day-3/                     # Full Stack Notes App (Monolithic API)
├── day-4/                     # Clean MVC Architecture Refactor
├── day-5/                     # Navigation Hooks & Redirects Practice
├── day-6/                     # Next.js Server Actions Practice
├── day-7/                     # TanStack Query & Zustand Todo App
├── day-8/                     # Complete Posts CRUD with Prisma ORM
└── day-9/                     # User Cards Studio with Drizzle ORM & TanStack Query
    ├── actions/
    │   └── userActions.ts     # Server Actions (getUsers, getUserById, createUser, updateUser, deleteUser)
    ├── app/
    │   ├── layout.tsx         # Root Layout with hydration warning suppression
    │   ├── providers.tsx      # TanStack QueryClientProvider
    │   ├── page.tsx           # Studio Dashboard & Active Deck Grid
    │   └── users/[id]/
    │       └── page.tsx       # Standalone inspection, edit & delete page
    ├── lib/
    │   └── db.ts              # Neon SQL client + Drizzle ORM instance
    └── schema/
        └── drizzle.ts         # Table schema (users with role, bio, avatarColor)
```

---

## 🛠️ How to Run Any Day's Project

To run a specific day's application, navigate into its folder and start the development server:

```bash
cd day-9
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action!

---

*Keep learning, keep building!* 🚀

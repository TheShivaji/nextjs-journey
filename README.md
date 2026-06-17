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

## 📂 Master Directory Structure

Here is how the project workspace is structured:

```text
Nextjs learrning/
├── day-1/                     # Basic setup and intro
│
├── day-2/                     # Routing, Dynamic routes, Client components
│   └── app/
│       ├── product/
│       │   ├── contact/
│       │   ├── price/[id]/    # Dynamic routing
│       │   └── shiv/
│
├── day-3/                     # Full Stack Notes App (Monolithic API)
│   ├── app/
│   │   ├── api/notes/         # Route Handlers
│   │   └── lib/               # Database and Models
│
├── day-4/                     # Clean MVC Architecture Refactor
│   ├── lib/
│   │   ├── db.js              # Database connection
│   │   ├── models/            # Mongoose Schemas (Models)
│   │   └── controllers/       # Business Logic Functions (Controllers)
│   └── app/
│       ├── api/notes/         # Router calling the Controller
│       └── page.js            # Frontend View (UI)
│
└── day-5/                     # Navigation Hooks & Redirects Practice
    ├── app/
    │   ├── components/
    │   │   └── slidebar.jsx   # Sidebar using usePathname
    │   └── shop/
    │       ├── page.jsx       # Server component redirect('/shop/products')
    │       ├── Dashboard/     # useSearchParams tab filter wrapped in Suspense
    │       ├── orders/        # useSearchParams checkout receipt wrapped in Suspense
    │       ├── products/
    │       │   ├── page.jsx   # useRouter programmatic navigation
    │       │   └── [id]/      # useParams, useRouter, redirect action log dashboard
    │       └── categories/
    │           ├── page.jsx   # Category listing utilizing searchParams
    │           └── [slug]/    # useParams dynamic slug, redirect('deprecated')
```

---

## 🛠️ How to Run Any Day's Project

To run a specific day's application, navigate into its folder and start the development server:

1. **Navigate to the day's folder:**
   ```bash
   cd day-4
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action!

---

## 💡 Key Takeaway: The Next.js MVC Pattern
By day 4, we transitioned from writing database queries directly inside routes (like in `day-3`) to decoupling them using a MERN-style controller setup.

**Inside route handlers (`app/api/notes/route.js`):**
```javascript
import { getNotes, createNote } from "@/lib/controllers/note.controller";

export const GET = async (req) => await getNotes(req);
export const POST = async (req) => await createNote(req);
```

**Inside controllers (`lib/controllers/note.controller.js`):**
```javascript
export async function getNotes(req) {
    await connectDB();
    const notes = await Note.find().sort({ createdAt: -1 });
    return Response.json(notes, { status: 200 });
}
```
This keeps endpoints highly clean, reusable, and readable!

---

*Keep learning, keep building!* 🚀

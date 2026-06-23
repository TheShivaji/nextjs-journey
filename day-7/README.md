# Day 7: Todo App with Next.js, TanStack Query, and Zustand

This project is a modern, full-stack Todo application built to practice state management and data fetching. It uses the Next.js App Router along with powerful libraries to handle both global state and server-state efficiently.

## 🚀 Features
- **Next.js App Router**: Utilizing the latest Next.js features with Server Actions for backend communication.
- **TanStack React Query**: Used for data fetching, caching, and mutations (`useQuery`, `useMutation`), making the app highly performant and reactive.
- **Zustand**: A small, fast, and scalable bearbones state-management solution used for client-side state (e.g., filtering todos by All, Active, Completed).
- **Shadcn UI**: Beautifully designed components (Buttons, Inputs, Checkboxes, Cards) for a premium look and feel.
- **MongoDB & Mongoose**: Backend database connection and schemas to persist the todos.
- **Zod**: Schema validation for creating and updating todos.

## 🛠️ Tech Stack
- **Framework**: Next.js 16 (App Router)
- **State Management**: Zustand
- **Data Fetching/Mutations**: @tanstack/react-query
- **Styling**: Tailwind CSS + Shadcn UI
- **Database**: MongoDB + Mongoose
- **Validation**: Zod

## 📦 Getting Started

First, install the dependencies:
```bash
npm install
```

Then, run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

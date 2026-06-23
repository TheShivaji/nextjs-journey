import { TodoApp } from "@/components/TodoApp";

export default function Home() {
  return (
    <div className="min-h-screen bg-background bg-gradient-to-br from-background to-muted/50">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
         <header className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-foreground mb-4 tracking-tight">Todo App</h1>
          <p className="text-muted-foreground text-lg font-medium">Built with Next.js, Zustand, TanStack Query & shadcn/ui</p>
        </header>
        <main>
          <TodoApp />
        </main>
      </div>

      <footer className="mt-auto py-8 text-center text-sm text-muted-foreground">
        <p>This app demonstrates CRUD operations with modern React patterns</p>
      </footer>
    </div>
  )
}

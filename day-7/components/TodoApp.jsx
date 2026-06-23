"use client";

import { useState } from "react";
import { useTodosQuery, useCreateTodoMutation, useToggleTodoMutation, useDeleteTodoMutation } from "@/hook/useTodos";
import { useTodoStore } from "@/hook/useTodoStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";

export function TodoApp() {
  const [title, setTitle] = useState("");
  const { filter, setFilter } = useTodoStore();
  
  const { data: todos, isLoading, isError, error } = useTodosQuery();
  const createTodo = useCreateTodoMutation();
  const toggleTodo = useToggleTodoMutation();
  const deleteTodo = useDeleteTodoMutation();

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    createTodo.mutate({ title, completed: false });
    setTitle("");
  };

  const filteredTodos = todos?.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true; // "all"
  }) || [];

  return (
    <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">My Tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleCreate} className="flex gap-2">
          <Input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="What needs to be done?" 
            disabled={createTodo.isPending}
            className="flex-1"
          />
          <Button type="submit" disabled={createTodo.isPending}>
            Add Task
          </Button>
        </form>

        <div className="flex justify-center gap-2">
          <Button 
            variant={filter === "all" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilter("all")}
            className="w-24 transition-all"
          >
            All
          </Button>
          <Button 
            variant={filter === "active" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilter("active")}
            className="w-24 transition-all"
          >
            Active
          </Button>
          <Button 
            variant={filter === "completed" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilter("completed")}
            className="w-24 transition-all"
          >
            Completed
          </Button>
        </div>

        <div className="space-y-3 min-h-[200px]">
          {isLoading && <div className="flex justify-center items-center h-full"><p className="text-muted-foreground animate-pulse">Loading tasks...</p></div>}
          {isError && <p className="text-center text-destructive">{error.message}</p>}
          {!isLoading && !isError && filteredTodos.length === 0 && (
            <p className="text-center text-muted-foreground mt-10">No tasks found. You're all caught up!</p>
          )}
          
          <div className="space-y-2">
            {filteredTodos.map((todo) => (
              <div 
                key={todo._id} 
                className="group flex items-center justify-between p-3 border rounded-xl hover:bg-accent/50 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <Checkbox 
                    checked={todo.completed} 
                    onCheckedChange={() => toggleTodo.mutate(todo._id)} 
                    disabled={toggleTodo.isPending && toggleTodo.variables === todo._id}
                    className="h-5 w-5"
                  />
                  <span className={`text-sm font-medium transition-all duration-200 ${todo.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {todo.title}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => deleteTodo.mutate(todo._id)}
                  disabled={deleteTodo.isPending && deleteTodo.variables === todo._id}
                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

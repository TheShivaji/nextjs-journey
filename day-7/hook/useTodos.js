import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTodos, createTodo, toggleTodo, deleteTodo } from '@/actions/todu.action'
import { toast } from 'sonner'

export function useTodosQuery() {
  return useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const result = await getTodos();
      if (!result.success) throw new Error(result.error);
      return result.data;
    }
  });
}

export function useCreateTodoMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const result = await createTodo(data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success("Todo created!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create todo");
    }
  });
}

export function useToggleTodoMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const result = await toggleTodo(id);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to toggle todo");
    }
  });
}

export function useDeleteTodoMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const result = await deleteTodo(id);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success("Todo deleted!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete todo");
    }
  });
}

import { create } from 'zustand'

export const useTodoStore = create((set) => ({
  filter: 'all', // 'all', 'active', 'completed'
  setFilter: (filter) => set({ filter }),
}))

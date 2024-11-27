import { create } from 'zustand'

interface SidebarStore {
  isExpanded: boolean
  toggleSidebar: () => void
}

export const useSidebar = create<SidebarStore>((set) => ({
  isExpanded: false,
  toggleSidebar: () => set((state) => ({ isExpanded: !state.isExpanded }))
}))

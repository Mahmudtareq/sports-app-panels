import { create } from "zustand";

interface BannerStore {
  usedCategories: string[];
  setUsedCategories: (categories: string[]) => void;
}

export const useBannerStore = create<BannerStore>((set) => ({
  usedCategories: [],
  setUsedCategories: (categories) => set({ usedCategories: categories }),
}));

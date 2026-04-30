// stores/useCategoryFilterStore.ts
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { create } from "zustand";

interface Category {
  _id: string;
  name: string;
  slug: string;
  status: boolean;
  position: number;
  parent: string | null;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  subCategories: any[];
}

interface GalleryItem {
  _id: string;
  title: string;
  image: string;
  author?: string;
  category: string[];
  aspectRatio?: number;
  [key: string]: any;
}

interface GalleryPaginationData {
  docs: GalleryItem[];
  totalDocs: number;
  page: number;
  limit: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface CategoryFilterState {
  selectedCategory: string | null;
  categories: Category[];
  galleryData: GalleryItem[];
  paginationInfo: {
    totalDocs: number;
    page: number;
    limit: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
  isLoading: boolean;
  error: string | null;
  setSelectedCategory: (categorySlug: string | null) => void;
  setCategories: (categories: Category[]) => void;
  setGalleryData: (data: GalleryItem[]) => void;
  setPaginationInfo: (info: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useCategoryFilterStore = create<CategoryFilterState>((set) => ({
  selectedCategory: null,
  categories: [],
  galleryData: [],
  paginationInfo: null,
  isLoading: false,
  error: null,
  setSelectedCategory: (categorySlug) =>
    set({ selectedCategory: categorySlug }),
  setCategories: (categories) => set({ categories }),
  setGalleryData: (data) => set({ galleryData: data }),
  setPaginationInfo: (info) => set({ paginationInfo: info }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      selectedCategory: null,
      galleryData: [],
      paginationInfo: null,
      isLoading: false,
      error: null,
    }),
}));

// Custom hook for category filtering with URL sync
export function useCategoryFilter(
  fetchGalleryFn: (category: string) => Promise<any>,
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    selectedCategory,
    categories,
    galleryData,
    paginationInfo,
    isLoading,
    error,
    setSelectedCategory,
    setCategories,
    setGalleryData,
    setPaginationInfo,
    setLoading,
    setError,
  } = useCategoryFilterStore();

  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from URL on mount
  useEffect(() => {
    if (!isInitialized) {
      const categoryFromUrl = searchParams.get("category");
      if (categoryFromUrl) {
        setSelectedCategory(categoryFromUrl);
      }
      setIsInitialized(true);
    }
  }, [searchParams, isInitialized, setSelectedCategory]);

  // Fetch gallery data when category changes
  useEffect(() => {
    if (!isInitialized) return;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const categoryParam = selectedCategory || "";
        const response = await fetchGalleryFn(categoryParam);

        // Handle both 'ok' and 'status' response formats
        const isSuccess = response.ok || response.status;

        if (isSuccess && response.data) {
          // Check if data has docs array (paginated response)
          if (response.data.docs) {
            // Paginated response
            setGalleryData(response.data.docs);
            setPaginationInfo({
              totalDocs: response.data.totalDocs || 0,
              page: response.data.page || 1,
              //   limit: response.data.limit || 10,
              limit: 20,
              pages: response.data.pages || 1,
              hasNext: response.data.hasNext || false,
              hasPrev: response.data.hasPrev || false,
            });
          } else {
            // Direct array response
            const galleryItems = response.data;
            setGalleryData(Array.isArray(galleryItems) ? galleryItems : []);
            setPaginationInfo(null);
          }
        } else {
          setError(response.message || "Failed to fetch gallery data");
          setGalleryData([]);
          setPaginationInfo(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setGalleryData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [
    selectedCategory,
    isInitialized,
    fetchGalleryFn,
    setLoading,
    setError,
    setGalleryData,
    setPaginationInfo,
  ]);

  // Update URL when category changes
  const handleCategoryChange = (categorySlug: string | null) => {
    setSelectedCategory(categorySlug);

    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    if (categorySlug) {
      params.set("category", categorySlug);
    } else {
      params.delete("category");
    }

    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    router.push(newUrl, { scroll: false });
  };

  return {
    selectedCategory,
    categories,
    galleryData,
    paginationInfo,
    isLoading,
    error,
    handleCategoryChange,
    setCategories,
  };
}

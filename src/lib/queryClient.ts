import { QueryClient } from '@tanstack/react-query';
import { AppCache } from './cache';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
      // Add persistent caching
      initialData: () => {
        // This will be called for each query, but we'll handle specific ones
        return undefined;
      },
      // Optimize network requests
      refetchOnMount: (query) => {
        // Only refetch if data is stale
        return query.state.dataUpdatedAt < Date.now() - (2 * 60 * 1000); // 2 minutes
      },
    },
    mutations: {
      // Optimistic updates for mutations
      onMutate: async () => {
        // Will be overridden by specific mutations
      },
    },
  },
});

// Add image preloading utility
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Cache profile images
export const cacheProfileImage = async (avatarUrl: string | undefined): Promise<void> => {
  if (avatarUrl) {
    try {
      await preloadImage(avatarUrl);
      AppCache.set(`profile_image_${avatarUrl}`, true, 30); // Cache for 30 minutes
    } catch (error) {
      console.warn('Failed to preload profile image:', error);
    }
  }
};
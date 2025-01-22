import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface AdminUser {
  id: number;
  username: string;
}

export function useUser() {
  // Always return null since we don't use authentication anymore
  return {
    user: null,
    isLoading: false,
    error: null,
    login: () => Promise.resolve(), // Add empty functions to maintain the same interface
    logout: () => Promise.resolve(),
  };
}
import React from 'react';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Hook simplificado temporariamente para focar no CSS
export function useApiQuery(
  queryKey: string[],
  fetchFunction: (params?: any) => Promise<any>,
  params?: any
) {
  return useQuery({
    queryKey: [...queryKey, params],
    queryFn: () => fetchFunction(params),
  });
}

export function useApiCreate(
  queryKey: string[],
  createFunction: (data: any) => Promise<any>
) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createFunction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useApiUpdate(
  queryKey: string[],
  updateFunction: (params: { id: string; data: any }) => Promise<any>
) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateFunction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useApiDelete(
  queryKey: string[],
  deleteFunction: (id: string) => Promise<void>
) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteFunction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

// Hook para debounce de pesquisa
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

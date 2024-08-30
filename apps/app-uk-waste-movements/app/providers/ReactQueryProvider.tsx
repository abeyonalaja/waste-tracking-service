'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

export function ReactQueryProvider({
  children,
}: ReactQueryProviderProps): React.ReactNode {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

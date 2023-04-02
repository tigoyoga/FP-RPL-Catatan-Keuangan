import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {
  QueryClient,
  QueryClientProvider,
  QueryOptions,
} from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  const defaultQueryFn = async ({ queryKey }: QueryOptions) => {
    const { data } = await api.get(`${queryKey?.[0]}`);
    return data;
  };
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryFn: defaultQueryFn,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

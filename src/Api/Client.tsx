import { FC, PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      retryOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
});

const Client: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default Client;

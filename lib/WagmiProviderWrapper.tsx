"use client";

import { config } from "@/lib/config";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { WagmiProvider } from "wagmi";
import { ContextProvider } from "./ContextProvider";

const queryClient = new QueryClient();
type Token = {
  allowed: boolean;
  address: string;
  decimal: string;
  name: string;
  tokenBalance?: string | undefined;
  userBalance?: number | string;
};

export function WagmiProviderWrapper({ children }: { children: ReactNode }) {
  const [tokens, setTokens] = useState<any>([
    {
      allowed: true,
      address: "0x2134335543646546",
      decimal: "18",
      name: "ETV",
    },
    {
      allowed: true,
      address: "0x2134335543646546",
      decimal: "18",
      name: "ETV",
    },
    {
      allowed: true,
      address: "0x2134335543646546",
      decimal: "18",
      name: "ETV",
    },
  ]);
  return (
    <ContextProvider.Provider value={{ tokens, setTokens }}>
      <WagmiProvider config={config}>
        <Toaster />
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </ContextProvider.Provider>
  );
}

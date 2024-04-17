"use client";

import { useAccount } from "wagmi";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import WalletOptions from "@/components/wallet-options";

export default function Home() {
  const { setTheme } = useTheme();
  const route = useRouter();
  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);

  function ConnectWallet() {
    const { isConnected } = useAccount();
    if (isConnected) {
      route.push("/connected/dashboard");
    }
    return <WalletOptions />;
  }
  return <ConnectWallet />;
}

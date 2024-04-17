/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import vaultAbi from "@/lib/contractAbi";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { useAccount, useReadContracts } from "wagmi";

interface Contract {
  tokenBalance?: string | undefined;
  address: string;
  userBalance?: number | string;
  name: string;
  allowed: boolean;
  decimal: number;
}

export default function useFetchToken() {
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contractAddress = `0x${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`;
      const contract = new ethers.Contract(contractAddress, vaultAbi, provider);

      contract
        .queryFilter("TokenAllowed", 0, "latest")
        .then((events: any[]) => {
          const list: Contract[] = events.map((event: any) => ({
            name: event.args[3],
            address: event.args[0],
            allowed: event.args[1],
            decimal: Number(event.args[2]),
          }));
          setList(list);
        })
        .catch((error: any) => {
          console.error(error);
        });
    }
  }, []);

  const account = useAccount();

  const vaultStruct = {
    address: `0x${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`,
    abi: vaultAbi,
  };

  const { data, dataUpdatedAt } = useReadContracts<any>({
    contracts: list.flatMap((asset) => [
      {
        ...vaultStruct,
        functionName: "getTotalDeposits",
        args: [asset.address],
      },
      {
        ...vaultStruct,
        functionName: "getDepositInfo",
        args: [account.address, asset.address],
      },
    ]),
  });

  const tokenBucket: Contract[] = [];

  list.forEach((asset, index) => {
    if (dataUpdatedAt) {
      const totalDeposits = data![index * 2]?.result as string | undefined;
      const depositInfo = data![index * 2 + 1]?.result as [number] | undefined;
      const userBalance = depositInfo ? depositInfo[0] : undefined;

      tokenBucket.push({
        name: asset.name,
        address: asset.address,
        allowed: asset.allowed,
        decimal: asset.decimal,
        tokenBalance: formatUnits(
          totalDeposits as unknown as bigint,
          asset.decimal
        ),
        userBalance: formatUnits(
          userBalance as unknown as bigint,
          asset.decimal
        ),
      });
    }
  });
  return {
    tokens: tokenBucket,
  };
}

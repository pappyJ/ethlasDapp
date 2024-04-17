/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import { ContextProvider } from '@/lib/ContextProvider';
import vaultAbi from '@/lib/contractAbi';
import { ethers } from 'ethers';
import { useContext, useEffect } from 'react';
import { formatUnits } from 'viem';
import { useAccount, useChainId, useReadContracts } from 'wagmi';

const list: any[] = [];

// Connect to the Ethereum network
const provider = new ethers.BrowserProvider(window.ethereum);

// Define the contract address and the event signature
const contractAddress =  `0x${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`;

// Create a contract instance
const contract = new ethers.Contract(contractAddress!, vaultAbi, provider);

// Retrieve all TokenAllowed events since contract creation
contract
  .queryFilter('TokenAllowed', 0, 'latest')
  .then((events: any[]) => {
    events.map((event: any) => {
      list.push({
        name: event.args[3],
        address: event.args[0],
        allowed: event.args[1],
        decimal: Number(event.args[2]),
      });
    });
  })
  .catch((error: any) => {
    console.error(error);
  });

interface Contract {
  tokenBalance?: string | undefined;
  address: string;
  userBalance?: number | string;
  name: string;
  allowed: boolean;
  decimal: number;
}

export default function useFetchToken() {
  const { tokens, setTokens } = useContext(ContextProvider);

  const chainId = useChainId();

  const account = useAccount();

  const vaultStruct = {
    address: `0x${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`,
    abi: vaultAbi,
  };

  const { data, dataUpdatedAt, isFetching, isSuccess } = useReadContracts<any>({
    contracts: list.flatMap((asset) => [
      {
        ...vaultStruct,
        functionName: 'getTotalDeposits',
        args: [asset.address],
      },
      {
        ...vaultStruct,
        functionName: 'getDepositInfo',
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
//   useEffect(() => {
//     setTokens(tokenBucket);
    
//   }, []);
  return {
    tokens: tokenBucket,
  };
}

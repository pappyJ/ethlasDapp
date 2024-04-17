/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import WrongNetwork from "@/components/WrongNetwork";
import useFetchToken from "@/hooks/useFetchToken";
import { useChainId } from "wagmi";

interface Contract {
  tokenBalance?: string | undefined;
  address: string;
  userBalance?: number | string;
  name: string;
  allowed: boolean;
  decimal: number;
}

const Page = () => {
  const { tokens } = useFetchToken();
  const chainId = useChainId();

  if (chainId != 11155111) {
    return <WrongNetwork open />;
  }

  return (
    <main className="md:max-w-[600px] mx-auto px-2 border border-white/10 md:p-6 p-3 rounded-lg">
      <div className=" px-2 border border-white/10  py-6 rounded-lg">
        <div className="flex items-center justify-between py-2 px-2">
          <h4>Total</h4>
          <h4>{}</h4>
        </div>
      </div>
      <div className="mt-6  px-2 border border-white/10 p-3 rounded-lg flex flex-col gap-3 divide-y divide-white/5">
        <h5 className="mb-2 px-2 text-purple-500">Coin List</h5>
        {tokens.length > 0 ? (
          <>
            {" "}
            {tokens.map((token: Contract, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr_max-content] items-center justify-between py-2 px-2"
              >
                <div className="flex flex-col gap-1">
                  <p className="text-xl uppercase">{token.name}</p>
                  <span className="text-gray-500 font-light truncate max-w-[200px]">
                    {token.address}
                  </span>
                </div>
                <div className="flex flex-col items-end  gap-1">
                  <h5 className="text-right flex items-center">
                    <span className="text-xs mr-2 text-gray-500">
                      Current Balance:
                    </span>
                    {token.userBalance}
                  </h5>
                  <h5 className="text-right flex items-center">
                    <span className="text-xs mr-2 text-gray-500">
                      Vault Balance:
                    </span>
                    {token.tokenBalance}
                  </h5>
                </div>
              </div>
            ))}
          </>
        ) : (
          <p className="text-center py-6 font-bold">No token found, yet!</p>
        )}
      </div>
    </main>
  );
};

export default Page;

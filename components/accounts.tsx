import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import { config } from '@/lib/config';
import { EllipsisVertical, LoaderCircle } from 'lucide-react';
import {
  useAccount,
  useAccountEffect,
  useBalance,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useSwitchAccount,
} from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { useEffect } from 'react';
import WrongNetwork from './WrongNetwork';
// import { getContractData } from '@/lib/getContractData';

export function Account() {
  const { address, chainId, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connectors, switchAccount } = useSwitchAccount();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });
  const { data, isSuccess, isFetching, isError } = useBalance({
    address: address,
    blockTag: 'latest',
    chainId: mainnet.id,
    config,
    scopeKey: 'foo',
    unit: 'ether',
  });

  useEffect(() => {});

  useAccountEffect({
    onConnect(data) {
      if (data.chainId !== 11155111) {
        toast({
          title: 'Switch to sep',
          description: `Address ${data.address}`,
        });
      }
      console.log(data, 'onConnect');

      toast({
        title: 'Connected',
        description: `Address ${data.address}`,
      });
    },
    onDisconnect() {
      toast({
        title: 'Account is Disconnected',
      });
    },
  });
  if (isError) {
    toast({
      title: 'Error fetching balance',
    });
  }
  console.log(data);

  return (
    <div className=' grid place-content-center p-4 min-h-screen'>
      {true && (
        <div className='border border-zinc-500/30 min-w-[500px]  p-6 rounded-md flex flex-col'>
          <div className='flex items-center justify-between '>
            <p className='text-xs rounded-full text-green-500 bg-green-500/10 border border-green-500 px-4 py-1'>
              connected
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <EllipsisVertical />
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-[300px] '>
                <DropdownMenuLabel className='flex justify-between items-center'>
                  My Account
                  <p className='text-xs rounded-full text-green-500 bg-green-500/10 border border-green-500 px-4 py-1'>
                    connected
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className='bg-slate-500' />
                <DropdownMenuItem>
                  <p className='text-gray-200 text-sm truncate'>
                    Address: {address}
                  </p>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {' '}
                  <p className='text-gray-200 text-sm truncate'>
                    ChainId: {chainId}
                  </p>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => disconnect()}
                  className='bg-red-500/10 flex justify-items-center text-red-500 rounded-md text-center hover:bg-red-700'
                >
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {isFetching ? (
            <LoaderCircle className='animate-spin' />
          ) : (
            <div>
              <h3 className='text-3xl font-extrabold text-center my-8'>
                {data?.formatted} {data?.symbol}
              </h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

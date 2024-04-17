'use client'

import { Button } from '@/components/ui/button';
import * as React from 'react';
import { useConnect } from 'wagmi';

export default function WalletOptions() {
  const { connectors, connect } = useConnect();

  return (
    <div className=' grid place-content-center min-h-screen'>
      <div className='flex flex-col gap-6 max-w-500 bg-zinc-300/5 min-w-[500px] p-6 rounded-3xl'>
        <h2 className='text-3xl font-bold text-center mb-4'>
          Connect wallet
        </h2>
        {connectors.map((connector) => (
          <Button
            type='button'
            key={connector.uid}
            onClick={() => connect({ connector })}
            className='py-3 px-4  bg-gradient-to-r from-purple-600 to-pink-500 dark:text-white rounded-full'
          >
            {connector.name}
          </Button>
        ))}
      </div>
    </div>
  );
}

import { ReactNode } from 'react';
import Navigation from './Navigation';

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <div>
      <h1 className='col-span-full text-4xl font-bold text-center bg-purple-900  py-6 mb-2'>
        Ethlas Vault
      </h1>
      <div className='grid md:grid-cols-[300px_1fr] grid-cols-1 gap-8 md:border-t mt-8 border-white/10 md:max-w-[1300px] mx-auto px-4'>
        <Navigation />
        <div className=' mt-8 md:border-l border-white/10 md:p-8'>
          {children}
        </div>
      </div>
    </div>
  );
}

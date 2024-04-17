import { LoaderCircle } from 'lucide-react';
import React from 'react';

const Spinner = () => {
  return (
    <div className='h-[300px] w-full grid place-content-center'>
      <LoaderCircle className='animate-spin' />
    </div>
  );
};

export default Spinner;

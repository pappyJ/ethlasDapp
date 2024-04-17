import { LoaderCircle } from 'lucide-react';

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className='h-[300px] w-full grid place-content-center'>
      <LoaderCircle className='animate-spin' />
    </div>
  );
}

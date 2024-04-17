import { BaseError } from 'viem';

const ErrorPage = ({ error }: { error: BaseError }) => {
  return (
    <div className='h-[300px] w-full grid place-content-center'>
      <h3>Error occured!!</h3>
      <p>{(error as BaseError).shortMessage || error.message}</p>
    </div>
  );
};

export default ErrorPage;

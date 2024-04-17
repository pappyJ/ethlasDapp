'use client';

import InputField from '@/components/InputField';
import { Button } from '@/components/ui/button';
import { Formik } from 'formik';
import { BaseError, parseEther } from 'viem';
import { useWriteContract } from 'wagmi';
import vaultAbi from '@/lib/contractAbi';
import Notiflix from 'notiflix';

import * as Yup from 'yup';

export default function AddToken() {
  const { writeContractAsync, error, isError } = useWriteContract();

  return (
    <div className='md:max-w-[600px] mx-auto px-2 border border-white/10 md:p-6 p-3 rounded-lg'>
      <h3>Add Token</h3>
      <Formik
        initialValues={{
          address: '',
          symbol: '',
          decimal: '',
        }}
        validationSchema={Yup.object({
          address: Yup.string().required(),
          symbol: Yup.string().required(),
          decimal: Yup.string().required(),
        })}
        onSubmit={(values, { setSubmitting }) => {
          writeContractAsync(
            {
              abi: vaultAbi,
              address: `0x${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`,
              functionName: 'allowToken',
              args: [values.address, true, values.decimal, values.symbol],
            },
            {
              onSuccess: () => {
                Notiflix.Notify.success('Token Added!');
              },
              onSettled: () => {
                setSubmitting(false);
              },
              onError: (error) => {
                Notiflix.Report.failure(
                  'Transaction failed',
                  (error as BaseError).shortMessage || error.message,
                  'Close'
                );
              },
            }
          );
        }}
      >
        {(formik) => (
          <form
            onSubmit={formik.handleSubmit}
            className='flex flex-col gap-4 mt-6'
          >
            <InputField
              label='Address'
              type='text'
              id='address'
              placeholder='address...'
              {...formik.getFieldProps('address')}
            />
            <InputField
              label='Symbol'
              type='text'
              id='symbol'
              placeholder='symbol...'
              {...formik.getFieldProps('symbol')}
            />
            <InputField
              label='Decimal'
              type='text'
              id='decimal'
              placeholder='Decimal...'
              {...formik.getFieldProps('decimal')}
            />
            <Button
              disabled={formik.isSubmitting}
              type='submit'
              className='py-3 px-4  bg-gradient-to-r from-purple-600 to-pink-500 dark:text-white rounded-full'
            >
              {formik.isSubmitting ? 'Confirming...' : 'Add Token'}
            </Button>
          </form>
        )}
      </Formik>

      {isError && (
        <div className='text-base text-red-500'>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </div>
  );
}

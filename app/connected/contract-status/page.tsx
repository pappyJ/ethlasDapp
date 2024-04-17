"use client";

import ErrorPage from "@/components/Error";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import vaultAbi from "@/lib/contractAbi";
import { Formik } from "formik";
import Notiflix from "notiflix";
import { useEffect, useRef } from "react";
import { BaseError } from "viem";
import { useReadContract, useWriteContract } from "wagmi";
import * as Yup from "yup";

export default function AddToken() {
  const formikRef: any = useRef();
  const { writeContractAsync } = useWriteContract();
  const {
    data: paused,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useReadContract({
    abi: vaultAbi,
    address: `0x${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`,
    functionName: "paused",
  });

  console.log(paused);

  useEffect(() => {
    if (isSuccess) {
      const fields = {
        status: paused,
      };
      for (const [key, value] of Object.entries(fields)) {
        formikRef.current.setFieldValue(key, value);
      }
    }
    // console.log(formikRef.current.values, 'formik'
  }, [isSuccess, paused]);

  if (isLoading) {
    return <Spinner />;
  }
  if (isError) {
    return <ErrorPage error={error} />;
  }
  return (
    <div className="md:max-w-[600px] mx-auto px-2 border border-white/10 md:p-6 p-3 rounded-lg">
      <h3>Contract status</h3>
      <Formik
        innerRef={formikRef}
        initialValues={{
          status: true,
        }}
        validationSchema={Yup.object({
          status: Yup.boolean().required(),
        })}
        onSubmit={(values, { setSubmitting }) => {
          if (!values.status) {
            writeContractAsync(
              {
                abi: vaultAbi,
                address: `0x${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`,
                functionName: "unpause",
              },
              {
                onSuccess: () => {
                  // Code to execute when the transaction is successful
                  Notiflix.Notify.success("contract unpaused!");
                },
                onSettled: () => {
                  setSubmitting(false);
                },
                onError: (error) => {
                  Notiflix.Report.failure(
                    "Transaction failed",
                    (error as BaseError).shortMessage || error.message,
                    "Close"
                  );
                },
              }
            );
          } else {
            writeContractAsync(
              {
                abi: vaultAbi,
                address: `0x${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`,
                functionName: "pause",
              },
              {
                onSuccess: () => {
                  // Code to execute when the transaction is successful
                  Notiflix.Notify.success("contract paused!");
                },
                onSettled: () => {
                  setSubmitting(false);
                },
                onError: (error) => {
                  console.log(
                    (error as BaseError).shortMessage || error.message
                  );
                  console.error("Transaction failed:", error);
                  Notiflix.Report.failure(
                    "Transaction failed",
                    (error as BaseError).shortMessage || error.message,
                    "Close"
                  );
                },
              }
            );
          }
        }}
      >
        {(formik) => (
          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col gap-4 mt-6"
          >
            <div className="grid w-full items-center gap-1.5">
              <div className="flex items-center space-x-2 justify-between">
                <Label htmlFor="status">
                  <p>
                    {!formik.values.status
                      ? "Pause Contract"
                      : "Unpause Contract"}
                  </p>
                  <span className="text-gray-500 font-light">
                    This will affect all Transaction if contract is paused
                  </span>
                </Label>
                <Switch
                  id="status"
                  checked={formik.values.status}
                  onCheckedChange={(e) => formik.setFieldValue("status", e)}
                />
              </div>
            </div>

            <Button
              disabled={formik.isSubmitting}
              type="submit"
              className="py-3 px-4  bg-gradient-to-r from-purple-600 to-pink-500 dark:text-white rounded-full"
            >
              {formik.isSubmitting ? "Confirming..." : "Save"}
            </Button>
          </form>
        )}
      </Formik>
    </div>
  );
}

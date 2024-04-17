"use client";

import ErrorPage from "@/components/Error";
import InputField from "@/components/InputField";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetchToken from "@/hooks/useFetchToken";
import vaultAbi from "@/lib/contractAbi";
import tokenAbi from "@/lib/tokenAbi";
import { Formik } from "formik";
import Notiflix from "notiflix";
import { BaseError, parseEther } from "viem";
import { useReadContract, useWriteContract } from "wagmi";
import * as Yup from "yup";

export default function Withdraw() {
  const { tokens } = useFetchToken();

  const { writeContractAsync } = useWriteContract();
  const {
    data: paused,
    isLoading,
    isError,
    error,
  } = useReadContract({
    abi: vaultAbi,
    address: `0x${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`,
    functionName: "paused",
  });

  if (isLoading) {
    return <Spinner />;
  }
  if (isError) {
    return <ErrorPage error={error} />;
  }
  return (
    <div className="md:max-w-[600px] mx-auto px-2 border border-white/10 md:p-6 p-3 rounded-lg">
      <h3>Withdraw</h3>
      <Formik
        initialValues={{
          token: "",
          amount: "",
        }}
        validationSchema={Yup.object({
          token: Yup.string().required(),
          amount: Yup.string().required(),
        })}
        onSubmit={(values, { setSubmitting }) => {
          writeContractAsync({
            abi: vaultAbi,
            address: `0x${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`,
            functionName: "withdraw",
            args: [values.token, parseEther(values.amount)],
          })
            .then(() => {
              setSubmitting(false);

              Notiflix.Notify.success("Token Withdrawal successfull!");
            })
            .catch((error) => {
              Notiflix.Report.failure(
                "Transaction failed",
                (error as BaseError).shortMessage || error.message,
                "Close"
              );
              setSubmitting(false);
            });
        }}
      >
        {(formik) => (
          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col gap-4 mt-6"
          >
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="address">Select token</Label>
              <Select
                onValueChange={formik.handleChange("token")}
                defaultValue={formik.values.token}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Token" />
                </SelectTrigger>
                <SelectContent>
                  {tokens.map((token, index) => (
                    <SelectItem key={index} value={token.address}>
                      {token.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <InputField
              label="Amount"
              type="text"
              id="amount"
              placeholder="amount..."
              {...formik.getFieldProps("amount")}
            />
            <Button
              disabled={formik.isSubmitting}
              type="submit"
              className="py-3 px-4  bg-gradient-to-r from-purple-600 to-pink-500 dark:text-white rounded-full"
            >
              {formik.isSubmitting ? "Confirming..." : "Add Token"}
            </Button>
          </form>
        )}
      </Formik>
    </div>
  );
}

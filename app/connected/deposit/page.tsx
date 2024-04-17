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
import { parseUnits } from "viem";
import * as Yup from "yup";
import { ethers } from "ethers";

export default function AddToken() {
  const { tokens } = useFetchToken();

  return (
    <div className="md:max-w-[600px] mx-auto px-2 border border-white/10 md:p-6 p-3 rounded-lg">
      <h3>Deposit</h3>
      <Formik
        initialValues={{
          token: "",
          amount: "",
        }}
        validationSchema={Yup.object({
          token: Yup.string().required(),
          amount: Yup.string().required(),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          const currentToken = tokens.filter(
            (token) => token.address === values.token
          )[0];

          try {
            // Connect to the Ethereum network
            const provider = new ethers.BrowserProvider(window.ethereum);

            const signer = await provider.getSigner();

            const vaultContract = new ethers.Contract(
              `0x${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`,
              vaultAbi,
              signer
            );

            const tokenContract = new ethers.Contract(
              currentToken.address,
              tokenAbi,
              signer
            );

            const approveTransaction = await tokenContract.approve(
              `0x${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`,
              parseUnits(values.amount, currentToken.decimal)
            );

            await approveTransaction.wait();

            const depositTransaction = await vaultContract.deposit(
              values.token,
              parseUnits(values.amount, currentToken.decimal)
            );

            await depositTransaction.wait();

            setSubmitting(false);

            Notiflix.Notify.success("Token Deposit successfull!");
          } catch (error: unknown) {
            Notiflix.Report.failure(
              "Transaction failed",
              (error as Error).message,
              "Close"
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
              {formik.isSubmitting ? "Confirming..." : "Deposit"}
            </Button>
          </form>
        )}
      </Formik>
    </div>
  );
}

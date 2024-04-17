"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { useSwitchChain } from "wagmi";

export default function WrongNetwork({ open }: { open: boolean }) {
  const { chains, switchChain } = useSwitchChain();

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Wrong network</AlertDialogTitle>
          <AlertDialogDescription>Please switch network</AlertDialogDescription>
        </AlertDialogHeader>
        <Button
          variant={"outline"}
          onClick={() => switchChain({ chainId: 11155111 })}
        >
          Switch to sepolia
        </Button>
      </AlertDialogContent>
    </AlertDialog>
  );
}

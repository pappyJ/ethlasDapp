import { createContext, Dispatch, SetStateAction } from "react";

// Define the shape of the context data using a TypeScript interface
interface ContextData {
  tokens: {
    tokenBalance?: string | undefined;
    address: string;
    userBalance?: number | string;
    name: string;
    allowed: boolean;
    decimal: number;
  }[];
  setTokens: Dispatch<
    SetStateAction<
      {
        tokenBalance?: string | undefined;
        address: string;
        userBalance?: number | string;
        name: string;
        allowed: boolean;
        decimal: number;
      }[]
    >
  >;
}

// Create the context with an initial value and the TypeScript interface
export const ContextProvider = createContext<ContextData>({
  tokens: [],
  setTokens: () => {},
});

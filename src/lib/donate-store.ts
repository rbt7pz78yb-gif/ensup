import { create } from "zustand";

type DonateState = {
  amount: number;
  setAmount: (n: number) => void;
};

export const useDonate = create<DonateState>((set) => ({
  amount: 50,
  setAmount: (amount) => set({ amount }),
}));

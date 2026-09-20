import { create } from "zustand";

type DonateState = {
  selected: number | "custom";
  custom: string;
  setSelected: (value: number | "custom") => void;
  setCustom: (value: string) => void;
};

export const useDonate = create<DonateState>((set) => ({
  selected: 50,
  custom: "",
  setSelected: (selected) => set({ selected }),
  setCustom: (custom) => set({ custom }),
}));

export function amountFromDonate(selected: number | "custom", custom: string): number | undefined {
  if (selected === "custom") {
    const n = Number(custom.replace(/\s/g, "").replace(",", "."));
    return Number.isFinite(n) && n >= 1 ? Math.round(n) : undefined;
  }
  return selected;
}

"use client";
import { createContext, useContext } from "react";
import type { AppUser } from "./store";
import type { Lang } from "./i18n";

export type Ctx = {
  user: AppUser | null;
  lang: Lang;
  openLogin: () => void;
  openPost: (type?: string) => void;
  refresh: () => void;   // bump after posting so lists reload
  version: number;
};
export const AppCtx = createContext<Ctx>({
  user: null, lang: "en", openLogin: () => {}, openPost: () => {}, refresh: () => {}, version: 0,
});
export const useApp = () => useContext(AppCtx);

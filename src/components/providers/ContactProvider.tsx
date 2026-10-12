"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ContactContextValue = {
  open: boolean;
  openContact: () => void;
  closeContact: () => void;
};

const ContactContext = createContext<ContactContextValue | null>(null);

export function ContactProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo<ContactContextValue>(
    () => ({
      open,
      openContact: () => setOpen(true),
      closeContact: () => setOpen(false),
    }),
    [open],
  );

  return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>;
}

export function useContact() {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error("useContact must be used within ContactProvider");
  }
  return context;
}

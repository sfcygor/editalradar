"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AuthModal from "./AuthModal";

interface AuthModalContextType {
  openLogin: () => void;
  openRegister: () => void;
  closeModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<"login" | "register">("login");
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("login") === "true") {
      setTab("login");
      setIsOpen(true);
    }
  }, [searchParams]);

  const openLogin = () => {
    setTab("login");
    setIsOpen(true);
  };

  const openRegister = () => {
    setTab("register");
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return (
    <AuthModalContext.Provider value={{ openLogin, openRegister, closeModal }}>
      {children}
      <AuthModal isOpen={isOpen} onClose={closeModal} initialTab={tab} />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}

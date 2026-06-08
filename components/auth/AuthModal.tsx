"use client";

import { useState, useEffect, useActionState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Mail, Lock, User } from "lucide-react";
import { loginAction, registerAction } from "@/lib/actions/auth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "login" | "register";
}

export default function AuthModal({ isOpen, onClose, initialTab = "login" }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">(initialTab);

  // Login State
  const [loginState, dispatchLogin, isLoginPending] = useActionState(loginAction, undefined);
  // Register State
  const [registerState, dispatchRegister, isRegisterPending] = useActionState(registerAction, undefined);

  // Sync initial tab when opened
  useEffect(() => {
    if (isOpen) setTab(initialTab);
  }, [isOpen, initialTab]);

  // Handle success to close modal automatically
  useEffect(() => {
    if (loginState?.success || registerState?.success) {
      onClose();
    }
  }, [loginState, registerState, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={tab === "login" ? "Acesse sua conta" : "Crie sua conta"}>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, background: "var(--background)", padding: 4, borderRadius: 8 }}>
        <button
          onClick={() => setTab("login")}
          style={{
            flex: 1, padding: "8px 0", borderRadius: 6, border: "none", cursor: "pointer",
            fontWeight: 600, fontSize: "0.875rem",
            background: tab === "login" ? "white" : "transparent",
            color: tab === "login" ? "var(--text)" : "var(--text-muted)",
            boxShadow: tab === "login" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
            transition: "all 0.2s"
          }}
        >
          Entrar
        </button>
        <button
          onClick={() => setTab("register")}
          style={{
            flex: 1, padding: "8px 0", borderRadius: 6, border: "none", cursor: "pointer",
            fontWeight: 600, fontSize: "0.875rem",
            background: tab === "register" ? "white" : "transparent",
            color: tab === "register" ? "var(--text)" : "var(--text-muted)",
            boxShadow: tab === "register" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
            transition: "all 0.2s"
          }}
        >
          Cadastrar
        </button>
      </div>

      {tab === "login" ? (
        <form action={dispatchLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {loginState?.message && (
            <div style={{ padding: "12px", background: "rgba(239, 68, 68, 0.1)", color: "var(--danger)", borderRadius: "8px", fontSize: "0.875rem", textAlign: "center" }}>
              {loginState.message}
            </div>
          )}

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            leftIcon={<Mail size={16} />}
            error={loginState?.errors?.email?.[0]}
            required
          />

          <Input
            label="Senha"
            name="password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock size={16} />}
            error={loginState?.errors?.password?.[0]}
            required
          />

          <Button type="submit" variant="primary" disabled={isLoginPending} style={{ marginTop: "0.5rem" }}>
            {isLoginPending ? "Entrando..." : "Entrar na Plataforma"}
          </Button>
        </form>
      ) : (
        <form action={dispatchRegister} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {registerState?.message && (
            <div style={{ padding: "12px", background: "rgba(239, 68, 68, 0.1)", color: "var(--danger)", borderRadius: "8px", fontSize: "0.875rem", textAlign: "center" }}>
              {registerState.message}
            </div>
          )}

          <Input
            label="Nome Completo"
            name="name"
            placeholder="Seu nome"
            leftIcon={<User size={16} />}
            error={registerState?.errors?.name?.[0]}
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            leftIcon={<Mail size={16} />}
            error={registerState?.errors?.email?.[0]}
            required
          />

          <Input
            label="Senha"
            name="password"
            type="password"
            placeholder="Mínimo 8 caracteres"
            leftIcon={<Lock size={16} />}
            error={registerState?.errors?.password?.[0]}
            required
          />

          <Input
            label="Confirmar Senha"
            name="confirmPassword"
            type="password"
            placeholder="Repita a senha"
            leftIcon={<Lock size={16} />}
            error={registerState?.errors?.confirmPassword?.[0]}
            required
          />

          <Button type="submit" variant="primary" disabled={isRegisterPending} style={{ marginTop: "0.5rem" }}>
            {isRegisterPending ? "Criando Conta..." : "Criar Conta Grátis"}
          </Button>
        </form>
      )}
    </Modal>
  );
}

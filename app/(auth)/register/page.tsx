"use client";

import { useActionState } from "react";
import { registerAction } from "@/lib/actions/auth";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { User, Mail, Lock } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerAction, undefined);

  return (
    <Card style={{ padding: "2rem" }}>
      <form action={action} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {state?.message && (
          <div style={{ padding: "12px", background: "rgba(239, 68, 68, 0.1)", color: "var(--danger)", borderRadius: "8px", fontSize: "0.875rem", textAlign: "center" }}>
            {state.message}
          </div>
        )}

        <Input
          label="Nome Completo"
          name="name"
          type="text"
          placeholder="Seu Nome"
          leftIcon={<User size={16} />}
          error={state?.errors?.name?.[0]}
        />

        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="seu@email.com"
          leftIcon={<Mail size={16} />}
          error={state?.errors?.email?.[0]}
        />

        <Input
          label="Senha"
          name="password"
          type="password"
          placeholder="Mínimo 8 caracteres"
          leftIcon={<Lock size={16} />}
          error={state?.errors?.password?.[0]}
        />

        <Input
          label="Confirme sua Senha"
          name="confirmPassword"
          type="password"
          placeholder="Repita a senha"
          leftIcon={<Lock size={16} />}
          error={state?.errors?.confirmPassword?.[0]}
        />

        <Button type="submit" variant="primary" disabled={pending} style={{ marginTop: "0.5rem" }}>
          {pending ? "Criando conta..." : "Criar Conta"}
        </Button>

        <div style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
          Já tem uma conta?{" "}
          <Link href="/login" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>
            Fazer login
          </Link>
        </div>
      </form>
    </Card>
  );
}

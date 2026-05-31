"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Mail, Lock } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <Card style={{ padding: "2rem" }}>
      <form action={action} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        
        {state?.message && (
          <div style={{ padding: "12px", background: "rgba(239, 68, 68, 0.1)", color: "var(--danger)", borderRadius: "8px", fontSize: "0.875rem", textAlign: "center" }}>
            {state.message}
          </div>
        )}

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
          placeholder="••••••••"
          leftIcon={<Lock size={16} />}
          error={state?.errors?.password?.[0]}
        />

        <Button type="submit" variant="primary" disabled={pending} style={{ marginTop: "0.5rem" }}>
          {pending ? "Entrando..." : "Entrar"}
        </Button>

        <div style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
          Não tem uma conta?{" "}
          <Link href="/register" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>
            Cadastre-se
          </Link>
        </div>
      </form>
    </Card>
  );
}

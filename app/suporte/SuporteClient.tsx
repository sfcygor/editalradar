"use client";

import { useState, useEffect } from "react";
import { submitSupportTicketAction } from "@/lib/actions/support";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface SuporteClientProps {
  initialEmail: string;
  isLoggedIn: boolean;
}

export default function SuporteClient({ initialEmail, isLoggedIn }: SuporteClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [userAgent, setUserAgent] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    // Captura infos do navegador no lado do cliente
    setUserAgent(window.navigator.userAgent);
    // Tenta pegar a URL de origem se veio de outra página via query param ou fallback pra referrer
    const searchParams = new URLSearchParams(window.location.search);
    const from = searchParams.get("from");
    setCurrentUrl(from || document.referrer || window.location.href);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");
    
    const formData = new FormData(e.currentTarget);
    formData.append("userAgent", userAgent);
    formData.append("isLoggedIn", String(isLoggedIn));
    formData.append("currentUrl", currentUrl);

    try {
      const result = await submitSupportTicketAction(formData);
      if (result.success) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
        setErrorMessage(result.error || "Ocorreu um erro desconhecido.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Erro de conexão. Verifique sua internet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "success") {
    return (
      <Card style={{ padding: 40, textAlign: "center", border: "1px solid rgba(39,174,96,0.3)", background: "rgba(39,174,96,0.02)" }}>
        <CheckCircle2 size={48} color="var(--primary)" style={{ margin: "0 auto 16px" }} />
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>Relatório Enviado!</h2>
        <p style={{ color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 24 }}>
          Seu relatório foi enviado com sucesso. Obrigado por ajudar a melhorar o EditalRadar. Nossa equipe analisará sua mensagem em breve.
        </p>
        <Button onClick={() => setStatus("idle")} variant="secondary">Enviar nova mensagem</Button>
      </Card>
    );
  }

  return (
    <Card style={{ padding: 32 }}>
      {status === "error" && (
        <div style={{ padding: 16, background: "rgba(239,68,68,0.1)", borderRadius: 8, marginBottom: 24, display: "flex", alignItems: "center", gap: 12, color: "var(--danger)" }}>
          <AlertCircle size={20} />
          <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        
        <div>
          <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>Tipo da Mensagem *</label>
          <select 
            name="type" 
            required 
            style={{ 
              width: "100%", 
              height: 44, 
              padding: "0 14px", 
              borderRadius: 8, 
              border: "1px solid var(--border)", 
              background: "white",
              fontSize: "0.95rem",
              fontFamily: "inherit",
              outline: "none"
            }}
          >
            <option value="Dúvida">Tenho uma Dúvida</option>
            <option value="Problema/Bug">Reportar um Problema/Bug</option>
            <option value="Sugestão">Sugerir uma Melhoria</option>
            <option value="Feedback">Dar um Feedback</option>
          </select>
        </div>

        <Input 
          label="Seu Email *" 
          name="userEmail" 
          type="email" 
          required 
          defaultValue={initialEmail} 
          readOnly={isLoggedIn && !!initialEmail} 
          style={isLoggedIn && !!initialEmail ? { background: "var(--background)", color: "var(--text-muted)" } : {}}
          hint={isLoggedIn && !!initialEmail ? "Preenchido automaticamente com seu email de cadastro" : undefined}
        />

        <Input 
          label="Assunto *" 
          name="subject" 
          required 
          placeholder="Ex: Erro ao carregar questões de Português"
        />

        <div>
          <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>Descrição detalhada *</label>
          <textarea
            name="description"
            required
            placeholder="Descreva o que aconteceu, o que você esperava que acontecesse ou os detalhes da sua sugestão/dúvida..."
            style={{
              width: "100%",
              minHeight: 150,
              padding: 14,
              borderRadius: 8,
              border: "1px solid var(--border)",
              fontFamily: "inherit",
              fontSize: "0.95rem",
              resize: "vertical",
              outline: "none",
            }}
          />
        </div>

        <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} style={{ width: "100%", marginTop: 8, display: "flex", justifyContent: "center", gap: 8 }}>
          {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Enviando...</> : "Enviar Mensagem"}
        </Button>
      </form>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createQuestionAction } from "@/lib/actions/questions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function NovaQuestaoClient({ subjects }: { subjects: any[] }) {
  const router = useRouter();
  const [type, setType] = useState("multiple_choice");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    const res = await createQuestionAction(undefined, formData);
    setIsPending(false);
    if (res?.success) {
      router.push("/questoes");
    } else if (res?.errors) {
      alert("Erros de validação: " + JSON.stringify(res.errors));
    } else if (res?.message) {
      alert(res.message);
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <Link href="/questoes">
          <Button variant="secondary" size="sm" icon type="button">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <div>
          <h1 className="page-title" style={{ marginBottom: 0 }}>Nova Questão</h1>
          <p className="page-subtitle">Cadastre uma questão inédita no seu banco de dados</p>
        </div>
      </div>

      <Card style={{ padding: 24, maxWidth: 800 }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: "0.875rem" }}>Tipo da Questão</label>
              <select
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                  background: "var(--bg-card)",
                  color: "var(--text)",
                }}
              >
                <option value="multiple_choice">Múltipla Escolha</option>
                <option value="true_false">Certo / Errado</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: "0.875rem" }}>Enunciado da Questão</label>
            <textarea
              name="text"
              required
              rows={4}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                background: "var(--bg-card)",
                color: "var(--text)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.95rem",
                resize: "vertical"
              }}
              placeholder="Digite o texto principal da questão..."
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: 6 }}>Matéria</label>
              <select name="subject" required className="form-input form-select" style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text)" }}>
                <option value="">Selecione...</option>
                {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <Input label="Assunto" name="topic" placeholder="Ex: Direitos Fundamentais" />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: "0.875rem" }}>Dificuldade</label>
              <select
                name="difficulty"
                defaultValue="Médio"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                  background: "var(--bg-card)",
                  color: "var(--text)",
                }}
              >
                <option value="Fácil">Fácil</option>
                <option value="Médio">Médio</option>
                <option value="Difícil">Difícil</option>
              </select>
            </div>
            <div>
              <Input label="Fonte / Banca" name="source" placeholder="Ex: VUNESP 2024" />
            </div>
          </div>

          {type === "multiple_choice" && (
            <div style={{ padding: 20, background: "rgba(0,0,0,0.02)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 16 }}>Alternativas</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ fontWeight: 700, color: "var(--primary)" }}>A</span>
                  <Input name="optionA" required placeholder="Alternativa A" style={{ flex: 1 }} />
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ fontWeight: 700, color: "var(--primary)" }}>B</span>
                  <Input name="optionB" required placeholder="Alternativa B" style={{ flex: 1 }} />
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ fontWeight: 700, color: "var(--primary)" }}>C</span>
                  <Input name="optionC" placeholder="Alternativa C" style={{ flex: 1 }} />
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ fontWeight: 700, color: "var(--primary)" }}>D</span>
                  <Input name="optionD" placeholder="Alternativa D" style={{ flex: 1 }} />
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ fontWeight: 700, color: "var(--primary)" }}>E</span>
                  <Input name="optionE" placeholder="Alternativa E (Opcional)" style={{ flex: 1 }} />
                </div>
              </div>
            </div>
          )}

          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: "0.875rem" }}>Gabarito Correto</label>
            <select
              name="answer"
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                background: "var(--bg-card)",
                color: "var(--text)",
              }}
            >
              {type === "multiple_choice" ? (
                <>
                  <option value="A">Alternativa A</option>
                  <option value="B">Alternativa B</option>
                  <option value="C">Alternativa C</option>
                  <option value="D">Alternativa D</option>
                  <option value="E">Alternativa E</option>
                </>
              ) : (
                <>
                  <option value="C">Certo (C)</option>
                  <option value="E">Errado (E)</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: "0.875rem" }}>Explicação (Opcional)</label>
            <textarea
              name="explanation"
              rows={3}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                background: "var(--bg-card)",
                color: "var(--text)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.95rem",
                resize: "vertical"
              }}
              placeholder="Explique por que esta alternativa é a correta..."
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
            <Button variant="primary" type="submit" disabled={isPending}>
              <Save size={16} />
              {isPending ? "Salvando..." : "Salvar Questão"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

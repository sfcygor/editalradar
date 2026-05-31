import { redirect } from "next/navigation";
import { createFlashcardAction } from "@/lib/actions/flashcards";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { flashcardDecks } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/session";

export default async function NovoFlashcardPage({ params }: { params: Promise<{ deckId: string }> }) {
  const { deckId } = await params;
  const session = await requireAuth();

  const [deck] = await db()
    .select()
    .from(flashcardDecks)
    .where(eq(flashcardDecks.id, deckId))
    .limit(1);

  if (!deck || deck.userId !== session.userId) {
    redirect("/flashcards");
  }

  return (
    <div className="page-container animate-fade-in">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <Link href="/flashcards">
          <Button variant="secondary" size="sm" icon>
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <div>
          <h1 className="page-title" style={{ marginBottom: 0 }}>Novo Card</h1>
          <p className="page-subtitle">Adicionando ao deck: <strong>{deck.name}</strong></p>
        </div>
      </div>

      <Card style={{ padding: 24, maxWidth: 800 }}>
        <form
          action={async (formData) => {
            "use server";
            formData.append("deckId", deckId);
            const res = await createFlashcardAction(formData);
            if (res?.success) {
              redirect("/flashcards");
            }
          }}
          style={{ display: "flex", flexDirection: "column", gap: 24 }}
        >
          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: "0.875rem" }}>Frente (Pergunta)</label>
            <textarea
              name="front"
              required
              rows={4}
              style={{
                width: "100%",
                padding: 16,
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                background: "var(--bg-card)",
                color: "var(--text)",
                fontFamily: "var(--font-sans)",
                fontSize: "1.1rem",
                resize: "vertical"
              }}
              placeholder="Digite a pergunta ou o conceito..."
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: "0.875rem" }}>Verso (Resposta)</label>
            <textarea
              name="back"
              required
              rows={6}
              style={{
                width: "100%",
                padding: 16,
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                background: "var(--bg-card)",
                color: "var(--text)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.95rem",
                resize: "vertical"
              }}
              placeholder="Digite a resposta ou explicação detalhada..."
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
            <Button variant="primary" type="submit">
              <Save size={16} />
              Salvar Flashcard
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

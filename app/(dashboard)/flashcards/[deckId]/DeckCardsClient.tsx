"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ArrowLeft, Plus, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteFlashcardAction, updateFlashcardAction } from "@/lib/actions/flashcards";

export default function DeckCardsClient({ deck, initialCards }: { deck: any; initialCards: any[] }) {
  const [cards, setCards] = useState(initialCards);
  const [editingCard, setEditingCard] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este flashcard?")) return;
    const res = await deleteFlashcardAction(id);
    if (res?.success) {
      setCards(cards.filter(c => c.id !== id));
    }
  };

  const handleEdit = (card: any) => {
    setEditingCard(card);
    setIsEditOpen(true);
  };

  const submitEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fd = new FormData(e.currentTarget);
    fd.append("id", editingCard.id);
    const res = await updateFlashcardAction(fd);
    setIsSubmitting(false);
    if (res?.success) {
      setCards(cards.map(c => c.id === editingCard.id ? { ...c, front: fd.get("front"), back: fd.get("back") } : c));
      setIsEditOpen(false);
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/flashcards">
            <Button variant="secondary" size="sm" icon>
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <div>
            <h1 className="page-title" style={{ marginBottom: 0 }}>{deck.name}</h1>
            <p className="page-subtitle">{cards.length} flashcards</p>
          </div>
        </div>
        <Link href={`/flashcards/${deck.id}/novo`}>
          <Button variant="primary" size="sm">
            <Plus size={16} /> Novo Card
          </Button>
        </Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {cards.map((card) => (
          <Card key={card.id} style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20 }}>
              <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <h4 style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Frente</h4>
                  <p style={{ whiteSpace: "pre-line", lineHeight: 1.5 }}>{card.front}</p>
                </div>
                <div>
                  <h4 style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Verso</h4>
                  <p style={{ whiteSpace: "pre-line", lineHeight: 1.5 }}>{card.back}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Button variant="secondary" size="sm" icon onClick={() => handleEdit(card)}>
                  <Edit2 size={14} />
                </Button>
                <Button variant="secondary" size="sm" icon style={{ color: "var(--danger)" }} onClick={() => handleDelete(card.id)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {cards.length === 0 && (
          <div className="empty-state">
            <p>Nenhum flashcard neste deck.</p>
          </div>
        )}
      </div>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Editar Flashcard">
        {editingCard && (
          <form onSubmit={submitEdit} style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: "0.875rem" }}>Frente (Pergunta)</label>
              <textarea
                name="front"
                required
                defaultValue={editingCard.front}
                rows={3}
                style={{
                  width: "100%", padding: 12, borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text)", fontFamily: "var(--font-sans)", resize: "vertical"
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: "0.875rem" }}>Verso (Resposta)</label>
              <textarea
                name="back"
                required
                defaultValue={editingCard.back}
                rows={4}
                style={{
                  width: "100%", padding: 12, borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text)", fontFamily: "var(--font-sans)", resize: "vertical"
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: "0.875rem" }}>Tags (separadas por vírgula)</label>
              <input
                name="tags"
                defaultValue={editingCard.tags?.join(", ") || ""}
                placeholder="Ex: constitucional, artigo 5"
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text)", fontFamily: "var(--font-sans)"
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8 }}>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Salvando..." : "Salvar"}</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

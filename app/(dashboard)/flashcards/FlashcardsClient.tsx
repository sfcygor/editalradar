"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  RotateCcw,
  Layers,
  MoreVertical,
  Eye,
  Trash2,
  Edit2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import Link from "next/link";

import { createDeckAction, deleteDeckAction, updateDeckAction, getDueFlashcards, reviewFlashcardAction } from "@/lib/actions/flashcards";

type DeckType = {
  id: string;
  name: string;
  subject: string;
  description: string | null;
  cardCount: number;
  dueCount: number;
  masteryPct: number;
  lastStudied: Date | null;
};

// ── Study Mode ────────────────────────────────────────────────

function StudyMode({ deckId, onClose }: { deckId: string; onClose: () => void }) {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Fetch due cards on mount
  useEffect(() => {
    getDueFlashcards(deckId).then((res) => {
      setCards(res.map(r => r.card));
      setLoading(false);
    });
  }, [deckId]);

  if (loading) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(8px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "white" }}>Carregando cards...</div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(8px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 600, background: "white", borderRadius: "var(--radius-2xl)", padding: 32, textAlign: "center" }}>
          <h2 style={{ marginBottom: 16 }}>Parabéns! 🎉</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>Você concluiu todas as revisões pendentes para este deck hoje.</p>
          <Button variant="primary" onClick={onClose}>Fechar</Button>
        </div>
      </div>
    );
  }

  const card = cards[currentIndex];
  const progress = (currentIndex / cards.length) * 100;

  const handleDifficulty = async (quality: 1 | 3 | 4 | 5) => {
    await reviewFlashcardAction(card.id, quality);
    
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((p) => p + 1);
      setFlipped(false);
    } else {
      // Done
      onClose();
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(8px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 600, background: "white", borderRadius: "var(--radius-2xl)", padding: 32, boxShadow: "var(--glass-shadow-lg)" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Card {currentIndex + 1} de {cards.length}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "1.5rem", lineHeight: 1 }}>✕</button>
        </div>

        {/* Progress */}
        <div className="progress-bar" style={{ marginBottom: 24 }}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Flashcard */}
        <div
          className={`flashcard-flip-container`}
          onClick={() => setFlipped(!flipped)}
          style={{ marginBottom: 24, cursor: "pointer" }}
        >
          <div className={`flashcard-inner ${flipped ? "flipped" : ""}`}>
            <div className="flashcard-front">
              <div style={{ fontSize: "0.7rem", color: "var(--text-subtle)", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Pergunta — clique para revelar
              </div>
              <p style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--text)", lineHeight: 1.6 }}>
                {card.front}
              </p>
              <Eye size={20} color="var(--text-subtle)" style={{ marginTop: 20 }} />
            </div>
            <div className="flashcard-back">
              <div style={{ fontSize: "0.7rem", color: "var(--primary)", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Resposta
              </div>
              <p style={{ fontSize: "0.95rem", color: "var(--text)", lineHeight: 1.7, whiteSpace: "pre-line" }}>
                {card.back}
              </p>
            </div>
          </div>
        </div>

        {/* Difficulty Buttons */}
        {flipped && (
          <div style={{ display: "flex", gap: 10 }} className="animate-slide-up">
            <button
              onClick={() => handleDifficulty(5)}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "var(--radius-md)",
                border: "1.5px solid rgba(39,174,96,0.3)",
                background: "rgba(39,174,96,0.06)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "var(--primary-dark)",
                fontFamily: "var(--font-sans)",
              }}
            >
              😊 Fácil
            </button>
            <button
              onClick={() => handleDifficulty(4)}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "var(--radius-md)",
                border: "1.5px solid rgba(244,197,66,0.3)",
                background: "rgba(244,197,66,0.06)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "var(--accent-dark)",
                fontFamily: "var(--font-sans)",
              }}
            >
              🤔 Bom
            </button>
            <button
              onClick={() => handleDifficulty(3)}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "var(--radius-md)",
                border: "1.5px solid rgba(249,115,22,0.3)",
                background: "rgba(249,115,22,0.06)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "var(--warning)",
                fontFamily: "var(--font-sans)",
              }}
            >
              😰 Difícil
            </button>
            <button
              onClick={() => handleDifficulty(1)}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "var(--radius-md)",
                border: "1.5px solid rgba(239,68,68,0.3)",
                background: "rgba(239,68,68,0.06)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "var(--danger)",
                fontFamily: "var(--font-sans)",
              }}
            >
              ❌ Errei
            </button>
          </div>
        )}

        {!flipped && (
          <Button
            variant="primary"
            style={{ width: "100%" }}
            onClick={() => setFlipped(true)}
          >
            <Eye size={16} />
            Revelar Resposta
          </Button>
        )}
      </div>
    </div>
  );
}


// ── Deck Card ─────────────────────────────────────────────────

function DeckCard({ deck, onDelete, onStudy }: { deck: DeckType, onDelete: (id: string) => void, onStudy: (id: string) => void }) {
  const colorMap = ["blue", "green", "red", "yellow", "purple"];
  const color = colorMap[deck.subject.length % colorMap.length];

  return (
    <Card className="deck-card hover-lift">
      <div className={`deck-color-strip deck-${color}`} />
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <Badge variant="blue" style={{ marginBottom: 8 }}>
            {deck.subject}
          </Badge>
          <Link href={`/flashcards/${deck.id}`}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
              {deck.name}
            </h3>
          </Link>
          {deck.description && (
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>{deck.description}</p>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('edit-deck', { detail: deck }))}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
            title="Editar Deck"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={async () => {
              if (confirm("Tem certeza que deseja excluir este deck e todos os seus cards?")) {
                await onDelete(deck.id);
              }
            }}
            style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer" }}
            title="Excluir Deck"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", color: "var(--text)" }}>
            {deck.cardCount}
          </div>
          <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>cards</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", color: deck.dueCount > 0 ? "var(--danger)" : "var(--primary)" }}>
            {deck.dueCount}
          </div>
          <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>para revisar</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", color: "var(--text)" }}>
            {deck.masteryPct}%
          </div>
          <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>dominado</div>
        </div>
      </div>

      {/* Progress */}
      <div className="progress-bar" style={{ marginBottom: 12 }}>
        <div
          className="progress-fill"
          style={{
            width: `${deck.masteryPct}%`,
            background: deck.masteryPct >= 80
              ? "linear-gradient(90deg, var(--primary), var(--primary-light))"
              : deck.masteryPct >= 60
              ? "linear-gradient(90deg, var(--accent-dark), var(--accent))"
              : "linear-gradient(90deg, var(--danger-dark), var(--danger))",
          }}
        />
      </div>

      {/* Last Studied */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.7rem", color: "var(--text-subtle)" }}>
          Estudado {deck.lastStudied ? deck.lastStudied.toLocaleDateString() : "nunca"}
        </span>
      </div>

      {/* Actions */}
      <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
        <Button variant="primary" size="sm" style={{ flex: 1 }} onClick={() => onStudy(deck.id)}>
          <RotateCcw size={14} />
          Estudar Deck
        </Button>
        <Link href={`/flashcards/${deck.id}/novo`}>
          <Button variant="secondary" size="sm" icon>
            <Plus size={14} />
          </Button>
        </Link>
      </div>
    </Card>
  );
}

// ── Main Page ─────────────────────────────────────────────────

export default function FlashcardsClient({ initialDecks, globalSubjects = [] }: { initialDecks: DeckType[], globalSubjects?: { id: string; name: string }[] }) {
  const [activeSubject, setActiveSubject] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingDeck, setIsAddingDeck] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStudyDeck, setActiveStudyDeck] = useState<string | null>(null);
  const [isEditingDeck, setIsEditingDeck] = useState(false);
  const [editingDeck, setEditingDeck] = useState<DeckType | null>(null);

  useEffect(() => {
    const handleEdit = (e: any) => {
      setEditingDeck(e.detail);
      setIsEditingDeck(true);
    };
    window.addEventListener("edit-deck", handleEdit);
    return () => window.removeEventListener("edit-deck", handleEdit);
  }, []);

  const subjects = ["Todos", ...globalSubjects.map(s => s.name)];

  const filteredDecks = initialDecks.filter((d) => {
    const matchesSubject = activeSubject === "Todos" || d.subject === activeSubject;
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const totalDue = initialDecks.reduce((acc, d) => acc + d.dueCount, 0);

  return (
    <div className="page-container animate-fade-in">
      {activeStudyDeck && (
        <StudyMode 
          deckId={activeStudyDeck} 
          onClose={() => {
            setActiveStudyDeck(null);
            // In a real app we might want to refresh initialDecks here, 
            // but since Server Actions trigger revalidatePath, 
            // the page will automatically refresh in the background.
          }} 
        />
      )}

      {/* Top Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            {totalDue > 0 ? (
              <>
                <strong style={{ color: "var(--danger)" }}>{totalDue} cards</strong> para revisar hoje
              </>
            ) : (
              <span style={{ color: "var(--primary)" }}>Todas as revisões em dia! 🎉</span>
            )}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Button variant="secondary" size="sm" icon id="novo-flashcard-btn" onClick={() => setIsAddingDeck(true)}>
            <Plus size={14} /> Novo Deck
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Decks", value: initialDecks.length, color: "var(--info)" },
          { label: "Total de Cards", value: initialDecks.reduce((a, d) => a + d.cardCount, 0), color: "var(--text)" },
          { label: "Para Revisar", value: totalDue, color: "var(--danger)" },
          { label: "Dominados", value: initialDecks.length > 0 ? Math.round(initialDecks.reduce((a, d) => a + d.masteryPct, 0) / initialDecks.length) + "%" : "0%", color: "var(--primary)" },
        ].map((s) => (
          <div key={s.label} className="stat-card" style={{ justifyContent: "center", flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.5rem", color: s.color }}>{s.value}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Add Deck Form */}
      <Modal isOpen={isAddingDeck} onClose={() => setIsAddingDeck(false)} title="Novo Deck">
        <form
          action={async (formData) => {
            setIsSubmitting(true);
            const res = await createDeckAction(formData);
            setIsSubmitting(false);
            if (res?.success) setIsAddingDeck(false);
          }}
          style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}
        >
          <Input name="name" label="Nome do Deck" required placeholder="Ex: Direitos e Garantias Fundamentais" />
          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: "0.875rem" }}>Matéria</label>
            <select name="subject" required className="form-input form-select" style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text)" }}>
              <option value="">Selecione...</option>
              {globalSubjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <Input name="description" label="Descrição (Opcional)" placeholder="Breve descrição deste deck" />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8 }}>
            <Button type="button" variant="secondary" onClick={() => setIsAddingDeck(false)}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Criando..." : "Criar Deck"}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEditingDeck} onClose={() => setIsEditingDeck(false)} title="Editar Deck">
        {editingDeck && (
          <form
            action={async (formData) => {
              setIsSubmitting(true);
              formData.append("id", editingDeck.id);
              const res = await updateDeckAction(formData);
              setIsSubmitting(false);
              if (res?.success) {
                setIsEditingDeck(false);
              } else if (res?.error) {
                alert(res.error);
              }
            }}
            style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}
          >
            <Input name="name" label="Nome do Deck" required defaultValue={editingDeck.name} />
            <div>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: "0.875rem" }}>Matéria</label>
              <select name="subject" required defaultValue={editingDeck.subject} className="form-input form-select" style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text)" }}>
                <option value="">Selecione...</option>
                {globalSubjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <Input name="description" label="Descrição (Opcional)" defaultValue={editingDeck.description || ""} />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8 }}>
              <Button type="button" variant="secondary" onClick={() => setIsEditingDeck(false)}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Salvando..." : "Salvar Deck"}</Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Decks Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {filteredDecks.map((deck) => (
          <DeckCard 
            key={deck.id} 
            deck={deck} 
            onDelete={deleteDeckAction} 
            onStudy={(id) => setActiveStudyDeck(id)} 
          />
        ))}
        {filteredDecks.length === 0 && !isAddingDeck && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
            Nenhum deck encontrado. Crie um novo!
          </div>
        )}
      </div>
    </div>
  );
}

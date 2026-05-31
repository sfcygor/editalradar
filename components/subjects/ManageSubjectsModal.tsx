"use client";

import { useState } from "react";
import { BookOpen, Plus, Edit2, Trash2, ChevronLeft } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Subject } from "@/lib/db/schema";
import { createSubjectAction, updateSubjectAction, deleteSubjectAction } from "@/lib/actions/subjects";

type ViewState = "list" | "create" | "edit" | "delete";

export default function ManageSubjectsModal({
  isOpen,
  onClose,
  globalSubjects,
}: {
  isOpen: boolean;
  onClose: () => void;
  globalSubjects: Subject[];
}) {
  const [view, setView] = useState<ViewState>("list");
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const [name, setName] = useState("");
  const [color, setColor] = useState("gray");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset view when opening
  if (!isOpen && view !== "list") {
    setView("list");
  }

  const openCreate = () => {
    setName("");
    setColor("gray");
    setView("create");
  };

  const openEdit = (sub: Subject) => {
    setEditingSubject(sub);
    setName(sub.name);
    setColor(sub.color);
    setView("edit");
  };

  const openDelete = (sub: Subject) => {
    setEditingSubject(sub);
    setView("delete");
  };

  const goBack = () => setView("list");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fd = new FormData();
    fd.append("name", name);
    fd.append("color", color);
    await createSubjectAction(fd);
    setIsSubmitting(false);
    setView("list");
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject) return;
    setIsSubmitting(true);
    const fd = new FormData();
    fd.append("id", editingSubject.id);
    fd.append("name", name);
    fd.append("color", color);
    await updateSubjectAction(fd);
    setIsSubmitting(false);
    setView("list");
  };

  const handleDelete = async () => {
    if (!editingSubject) return;
    setIsSubmitting(true);
    const fd = new FormData();
    fd.append("id", editingSubject.id);
    await deleteSubjectAction(fd);
    setIsSubmitting(false);
    setView("list");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gerenciar Matérias">
      <div style={{ marginTop: 16, minHeight: 300, display: "flex", flexDirection: "column" }}>
        
        {view === "list" && (
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
              <Button onClick={openCreate} size="sm" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Plus size={14} /> Adicionar
              </Button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, maxHeight: 400, overflowY: "auto" }}>
              {globalSubjects.map((sub) => (
                <div key={sub.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "var(--bg-secondary)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 6, background: `var(--${sub.color}-light, rgba(0,0,0,0.05))`, color: `var(--${sub.color}, #64748b)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <BookOpen size={16} />
                    </div>
                    <span style={{ fontWeight: 500, color: "var(--text)" }}>{sub.name}</span>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button onClick={() => openEdit(sub)} style={{ padding: 8, background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", borderRadius: 4 }} title="Editar">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => openDelete(sub)} style={{ padding: 8, background: "transparent", border: "none", color: "var(--danger)", cursor: "pointer", borderRadius: 4 }} title="Excluir">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {globalSubjects.length === 0 && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, color: "var(--text-muted)", textAlign: "center" }}>
                  <BookOpen size={32} style={{ opacity: 0.3, marginBottom: 12 }} />
                  <p>Nenhuma matéria cadastrada.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {view === "create" && (
          <form onSubmit={handleCreate} className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <button type="button" onClick={goBack} style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "var(--text-muted)", padding: 0 }}>
                <ChevronLeft size={20} />
              </button>
              <h4 style={{ margin: 0, fontWeight: 600, color: "var(--text)", fontSize: "1.1rem" }}>Nova Matéria</h4>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500 }}>Nome da Matéria</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ex: Informática" autoFocus />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
              <Button type="button" variant="outline" onClick={goBack} disabled={isSubmitting}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting}>Criar</Button>
            </div>
          </form>
        )}

        {view === "edit" && (
          <form onSubmit={handleEdit} className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <button type="button" onClick={goBack} style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "var(--text-muted)", padding: 0 }}>
                <ChevronLeft size={20} />
              </button>
              <h4 style={{ margin: 0, fontWeight: 600, color: "var(--text)", fontSize: "1.1rem" }}>Editar Matéria</h4>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--warning)", lineHeight: 1.5 }}>
              Atenção: Renomear a matéria atualizará automaticamente todas as sessões, questões e flashcards vinculados a ela.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500 }}>Nome da Matéria</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
              <Button type="button" variant="outline" onClick={goBack} disabled={isSubmitting}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting}>Salvar Alterações</Button>
            </div>
          </form>
        )}

        {view === "delete" && (
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <button type="button" onClick={goBack} style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "var(--text-muted)", padding: 0 }}>
                <ChevronLeft size={20} />
              </button>
              <h4 style={{ margin: 0, fontWeight: 600, color: "var(--text)", fontSize: "1.1rem" }}>Excluir Matéria</h4>
            </div>
            <p style={{ color: "var(--text)", lineHeight: 1.5 }}>
              Tem certeza que deseja excluir a matéria <strong>{editingSubject?.name}</strong>?
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--danger)" }}>
              Nota: As questões e flashcards associados não serão excluídos, mas ficarão órfãos de matéria.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
              <Button type="button" variant="outline" onClick={goBack} disabled={isSubmitting}>Cancelar</Button>
              <Button type="button" variant="danger" onClick={handleDelete} disabled={isSubmitting}>Excluir Matéria</Button>
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
}

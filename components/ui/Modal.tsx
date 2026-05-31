"use client";

import { useEffect, ReactNode } from "react";
import { X } from "lucide-react";
import { Card, CardHeader, CardTitle } from "./Card";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 500,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        className="animate-slide-up"
      >
        <Card style={{ position: "relative" }}>
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              zIndex: 10,
            }}
          >
            <X size={20} />
          </button>
          
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <div style={{ padding: "0 24px 24px" }}>
            {children}
          </div>
        </Card>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import {
  LayoutDashboard,
  FileQuestion,
  BookOpen,
  RefreshCw,
  ClipboardList,
  TrendingUp,
  AlertCircle,
  Timer,
  Target,
  Calendar,
  PenSquare,
  Search,
  Users,
  Trophy,
  BarChart3,
  User,
  ChevronLeft,
  ChevronRight,
  Crosshair,
  Zap,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/lib/actions/auth";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    label: "Principal",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Estudo",
    items: [
      { href: "/questoes", label: "Questões", icon: FileQuestion },
      { href: "/flashcards", label: "Flashcards", icon: BookOpen },
      { href: "/revisoes", label: "Revisões", icon: RefreshCw },
      { href: "/simulados", label: "Simulados", icon: PenSquare },
    ],
  },
  {
    label: "Organização",
    items: [
      { href: "/edital", label: "Edital Tracker", icon: ClipboardList },
      { href: "/banco-erros", label: "Banco de Erros", icon: AlertCircle },
      { href: "/cronometro", label: "Cronômetro", icon: Timer },
      { href: "/metas", label: "Metas", icon: Target },
    ],
  },
  {
    label: "Análise",
    items: [
      { href: "/desempenho", label: "Desempenho", icon: TrendingUp },
      { href: "/heatmap", label: "Heatmap", icon: Calendar },
      { href: "/estatisticas", label: "Estatísticas", icon: BarChart3 },
    ],
  },
  {
    label: "Social",
    items: [
      { href: "/ranking", label: "Ranking", icon: Trophy },
      { href: "/amigos", label: "Amigos", icon: Users },
    ],
  },
  {
    label: "Conta",
    items: [
      { href: "/busca", label: "Busca Global", icon: Search },
      { href: "/perfil", label: "Perfil", icon: User },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Sidebar */}
      <aside className={cn("sidebar", collapsed && "collapsed")}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div style={{ flexShrink: 0, width: 28, height: 28, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Image src="/logo.png" alt="EditalRadar Logo" width={28} height={28} style={{ objectFit: "contain" }} />
          </div>
          {!collapsed && (
            <span className="sidebar-logo-text" style={{ marginLeft: 8 }}>
              Edital<span>Radar</span>
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navSections.map((section) => (
            <div key={section.label}>
              {!collapsed && (
                <div className="sidebar-section-label">{section.label}</div>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn("nav-item", isActive && "active")}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon size={18} className="nav-item-icon" strokeWidth={1.8} />
                    {!collapsed && (
                      <>
                        <span className="nav-item-label">{item.label}</span>
                        {item.badge && item.badge > 0 && (
                          <span className="nav-badge">{item.badge}</span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer: collapse toggle & logout */}
        <div className="sidebar-footer" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="nav-item"
            style={{ width: "100%", border: "none", background: "none", cursor: "pointer", padding: "12px 16px" }}
            title={collapsed ? "Expandir menu" : "Recolher menu"}
            id="sidebar-collapse-btn"
          >
            {collapsed ? (
              <ChevronRight size={18} strokeWidth={1.8} />
            ) : (
              <>
                <ChevronLeft size={18} strokeWidth={1.8} />
                <span className="nav-item-label">Recolher</span>
              </>
            )}
          </button>
          <button
            onClick={() => logoutAction()}
            className="nav-item"
            style={{ width: "100%", border: "none", background: "none", cursor: "pointer", color: "var(--danger)", padding: "12px 16px" }}
            title="Sair da Conta"
          >
            <LogOut size={18} strokeWidth={1.8} />
            {!collapsed && <span className="nav-item-label">Sair</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

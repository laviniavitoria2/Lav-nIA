import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  FolderOpen,
  Cpu,
  GitBranch,
  FileSearch,
  Scale,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Painel Principal", href: "/", icon: LayoutDashboard },
  { label: "Casos Jurídicos", href: "/cases", icon: FolderOpen },
  { label: "Habilidades", href: "/skills", icon: Cpu },
  { label: "Fluxos de Trabalho", href: "/workflows", icon: GitBranch },
  { label: "Resultados", href: "/results", icon: FileSearch },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-sm bg-sidebar-primary flex items-center justify-center flex-shrink-0">
            <Scale className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
          <div>
            <div className="text-sidebar-foreground font-semibold text-sm tracking-wide">
              LEX INTELLIGENTIA
            </div>
            <div className="text-sidebar-foreground/40 text-xs tracking-widest uppercase">
              Sistema Jurídico
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="text-sidebar-foreground/30 text-xs font-semibold tracking-widest uppercase px-3 mb-3">
            Módulos
          </div>
          <ul className="space-y-0.5">
            {navItems.map(({ label, href, icon: Icon }) => {
              const isActive = href === "/" ? location === "/" : location.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors group",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-foreground"
                        : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4 flex-shrink-0",
                        isActive ? "text-sidebar-primary" : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground/60"
                      )}
                    />
                    <span className="flex-1">{label}</span>
                    {isActive && (
                      <ChevronRight className="w-3 h-3 text-sidebar-primary" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="text-sidebar-foreground/30 text-xs font-semibold tracking-widest uppercase px-3 mt-6 mb-3">
            Fluxos Rápidos
          </div>
          <ul className="space-y-0.5">
            {[
              { label: "Sentença Cível", color: "bg-amber-500" },
              { label: "Saneamento", color: "bg-blue-500" },
              { label: "Despacho", color: "bg-emerald-500" },
              { label: "Conciliação", color: "bg-purple-500" },
            ].map(({ label, color }) => (
              <li key={label}>
                <Link
                  href="/workflows"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-xs text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", color)} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-sidebar-border">
          <div className="text-sidebar-foreground/30 text-xs">
            Versão 1.0 — Sistema IA Jurídico
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-card border-b border-border flex items-center px-4 md:px-6 gap-4 flex-shrink-0">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 rounded text-muted-foreground hover:text-foreground"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Sistema Operacional
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

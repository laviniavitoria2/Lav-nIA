import { Link } from "wouter";
import { FolderOpen, Plus, Search, ChevronRight, Calendar, Hash } from "lucide-react";
import { useListCases } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const STATUS_COLORS: Record<string, string> = {
  "Pendente": "bg-amber-100 text-amber-700 border-amber-200",
  "Em Análise": "bg-blue-100 text-blue-700 border-blue-200",
  "Concluído": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Arquivado": "bg-slate-100 text-slate-600 border-slate-200",
};

export default function CasesList() {
  const { data: cases, isLoading } = useListCases();
  const [search, setSearch] = useState("");

  const filtered = cases?.filter(
    (c) =>
      c.titulo.toLowerCase().includes(search.toLowerCase()) ||
      c.tipo?.toLowerCase().includes(search.toLowerCase()) ||
      c.numero_processo?.toLowerCase().includes(search.toLowerCase()) ||
      c.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Casos Jurídicos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {cases?.length ?? 0} casos registrados no sistema
          </p>
        </div>
        <Link href="/cases/new">
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Caso
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar por título, tipo, número do processo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Cases list */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      ) : filtered && filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((legalCase) => (
            <Link key={legalCase.id} href={`/cases/${legalCase.id}`}>
              <div className="bg-card border border-border rounded-lg px-5 py-4 hover:border-primary/30 hover:bg-card/80 transition-colors cursor-pointer group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <FolderOpen className="w-4 h-4 text-primary flex-shrink-0" />
                      <h3 className="font-semibold text-foreground text-sm truncate">
                        {legalCase.titulo}
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      {legalCase.tipo && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-primary/50" />
                          {legalCase.tipo}
                        </span>
                      )}
                      {legalCase.numero_processo && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          {legalCase.numero_processo}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(legalCase.created_at).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
                      {legalCase.problema}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded border ${
                        STATUS_COLORS[legalCase.status] ?? "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {legalCase.status}
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg py-16 text-center">
          <FolderOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="text-base font-medium text-foreground mb-1">Nenhum caso encontrado</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {search ? "Tente ajustar os termos de pesquisa." : "Crie seu primeiro caso jurídico para começar."}
          </p>
          {!search && (
            <Link href="/cases/new">
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Criar Caso
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

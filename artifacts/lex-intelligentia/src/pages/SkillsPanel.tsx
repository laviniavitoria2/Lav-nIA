import { useState } from "react";
import { Link } from "wouter";
import { Cpu, Search, FolderOpen } from "lucide-react";
import { useListSkills } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const CATEGORY_COLORS: Record<string, string> = {
  "Análise": "bg-blue-100 text-blue-700 border-blue-200",
  "Processual": "bg-purple-100 text-purple-700 border-purple-200",
  "Pesquisa": "bg-amber-100 text-amber-700 border-amber-200",
  "Redação": "bg-teal-100 text-teal-700 border-teal-200",
  "Tutela": "bg-orange-100 text-orange-700 border-orange-200",
  "Especialidade": "bg-indigo-100 text-indigo-700 border-indigo-200",
  "Constitucional": "bg-red-100 text-red-700 border-red-200",
  "Recursal": "bg-pink-100 text-pink-700 border-pink-200",
  "Executivo": "bg-slate-100 text-slate-700 border-slate-200",
  "Resolução": "bg-green-100 text-green-700 border-green-200",
};

export default function SkillsPanel() {
  const { data: skills, isLoading } = useListSkills();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [...new Set(skills?.map((s) => s.category))].sort();

  const filtered = skills?.filter(
    (s) =>
      (!activeCategory || s.category === activeCategory) &&
      (s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase()) ||
        s.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Painel de Habilidades
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {skills?.length ?? 23} habilidades jurídicas disponíveis — acione em qualquer caso
        </p>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar habilidades..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Category filters */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
              activeCategory === null
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/30"
            }`}
          >
            Todas
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:border-primary/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Skills grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered?.map((skill) => (
            <div
              key={skill.id}
              className="bg-card border border-border rounded-lg p-5 hover:border-primary/30 transition-colors group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-primary" />
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded border ${
                    CATEGORY_COLORS[skill.category] ?? "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {skill.category}
                </span>
              </div>
              <h3 className="font-semibold text-sm text-foreground mb-1.5">{skill.name}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                {skill.description}
              </p>
              <Link href="/cases">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 text-xs group-hover:border-primary/30"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  Selecionar Caso
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}

      {filtered?.length === 0 && !isLoading && (
        <div className="py-16 text-center">
          <Cpu className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Nenhuma habilidade encontrada.</p>
        </div>
      )}
    </div>
  );
}

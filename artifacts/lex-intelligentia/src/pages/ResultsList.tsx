import { Link } from "wouter";
import { FileSearch, ChevronRight, Calendar, Cpu, GitBranch } from "lucide-react";
import { useListResults } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function ResultsList() {
  const { data: results, isLoading } = useListResults();

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Resultados</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {results?.length ?? 0} análises e fluxos concluídos
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
        </div>
      ) : results && results.length > 0 ? (
        <div className="space-y-3">
          {results.map((result) => {
            const isWorkflow = !!result.workflow_type;
            return (
              <Link key={result.id} href={`/results/${result.id}`}>
                <div className="bg-card border border-border rounded-lg px-5 py-4 hover:border-primary/30 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {isWorkflow ? (
                          <GitBranch className="w-4 h-4 text-primary" />
                        ) : (
                          <Cpu className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm text-foreground truncate">
                            {result.skill_name ?? result.workflow_type ?? "Análise"}
                          </h3>
                          <Badge
                            variant="outline"
                            className="text-xs flex-shrink-0 text-emerald-600 border-emerald-200 bg-emerald-50"
                          >
                            {result.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            {isWorkflow ? "Fluxo" : "Habilidade"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(result.created_at).toLocaleString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-1">
                          {result.analise.substring(0, 120)}...
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg py-16 text-center">
          <FileSearch className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="text-base font-medium text-foreground mb-1">Nenhum resultado ainda</h3>
          <p className="text-sm text-muted-foreground">
            Execute uma análise ou fluxo em um caso para ver os resultados aqui.
          </p>
        </div>
      )}
    </div>
  );
}

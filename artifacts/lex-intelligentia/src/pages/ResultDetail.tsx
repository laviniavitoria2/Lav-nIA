import { useParams, Link, useLocation } from "wouter";
import {
  ArrowLeft,
  FileText,
  Scale,
  BookOpen,
  Gavel,
  ChevronDown,
  ChevronUp,
  Download,
  Cpu,
  GitBranch,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import {
  useGetResult,
  getGetResultQueryKey,
  useGetCase,
  getGetCaseQueryKey,
  useDeleteResult,
  getListResultsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

function Section({
  icon: Icon,
  title,
  content,
  highlight,
}: {
  icon: React.ElementType;
  title: string;
  content: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-lg border p-5 ${highlight ? "border-primary/30 bg-primary/5" : "border-border bg-card"}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-7 h-7 rounded-md flex items-center justify-center ${highlight ? "bg-primary/10" : "bg-muted"}`}>
          <Icon className={`w-4 h-4 ${highlight ? "text-primary" : "text-muted-foreground"}`} />
        </div>
        <h3 className={`text-xs font-semibold uppercase tracking-widest ${highlight ? "text-primary" : "text-muted-foreground"}`}>
          {title}
        </h3>
      </div>
      <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{content}</div>
    </div>
  );
}

function JurisprudenciaSection({
  nivel,
  content,
}: {
  nivel: string;
  content: string;
}) {
  const [open, setOpen] = useState(false);

  const colors = {
    "Nível 1 — STF": "text-red-600 bg-red-50 border-red-200",
    "Nível 2 — STJ": "text-blue-600 bg-blue-50 border-blue-200",
    "Nível 3 — Tribunais": "text-purple-600 bg-purple-50 border-purple-200",
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button className="w-full flex items-center justify-between px-4 py-3 rounded-md border border-border bg-card hover:bg-muted/30 transition-colors">
          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                colors[nivel as keyof typeof colors] ?? "text-muted-foreground bg-muted border-border"
              }`}
            >
              {nivel}
            </span>
            <span className="text-xs text-muted-foreground">
              {open ? "Ocultar precedentes" : "Ver precedentes"}
            </span>
          </div>
          {open ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-2 px-4 py-4 rounded-md border border-border bg-card">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function ResultDetail() {
  const { id } = useParams<{ id: string }>();
  const resultId = parseInt(id ?? "0", 10);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: result, isLoading } = useGetResult(resultId, {
    query: { enabled: !!resultId, queryKey: getGetResultQueryKey(resultId) },
  });

  const { data: legalCase } = useGetCase(result?.case_id ?? 0, {
    query: {
      enabled: !!result?.case_id,
      queryKey: getGetCaseQueryKey(result?.case_id ?? 0),
    },
  });

  const deleteResult = useDeleteResult();

  const handleDelete = () => {
    deleteResult.mutate(
      { id: resultId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getListResultsQueryKey(),
          });
          toast({ title: "Resultado excluído" });
          navigate("/results");
        },
        onError: () => {
          toast({ title: "Erro ao excluir resultado", variant: "destructive" });
        },
      }
    );
  };

  const handleExport = () => {
    if (!result) return;
    const content = `LEX INTELLIGENTIA — RESULTADO DE ANÁLISE JURÍDICA
====================================================

${result.skill_name ? `HABILIDADE: ${result.skill_name}` : ""}
${result.workflow_type ? `FLUXO: ${result.workflow_type}` : ""}
Data: ${new Date(result.created_at).toLocaleString("pt-BR")}
Caso ID: ${result.case_id}

ANÁLISE
-------
${result.analise}

FUNDAMENTAÇÃO JURÍDICA
-----------------------
${result.fundamentacao_juridica}

JURISPRUDÊNCIA — NÍVEL 1 (STF)
--------------------------------
${result.jurisprudencia_nivel1}

JURISPRUDÊNCIA — NÍVEL 2 (STJ)
--------------------------------
${result.jurisprudencia_nivel2}

JURISPRUDÊNCIA — NÍVEL 3 (TRIBUNAIS)
--------------------------------------
${result.jurisprudencia_nivel3}

DECISÃO / RECOMENDAÇÃO
------------------------
${result.decisao_recomendacao}
`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lex-resultado-${resultId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 space-y-5 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-48" />
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-lg" />)}
      </div>
    );
  }

  if (!result) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-lg font-semibold">Resultado não encontrado</h2>
        <Link href="/results">
          <Button className="mt-4">Voltar para resultados</Button>
        </Link>
      </div>
    );
  }

  const isWorkflow = !!result.workflow_type;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/results")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                {isWorkflow ? (
                  <GitBranch className="w-3.5 h-3.5 text-primary" />
                ) : (
                  <Cpu className="w-3.5 h-3.5 text-primary" />
                )}
              </div>
              <h1 className="text-xl font-bold text-foreground">
                {result.skill_name ?? result.workflow_type ?? "Análise Jurídica"}
              </h1>
              <Badge
                variant="outline"
                className="text-xs text-emerald-600 border-emerald-200 bg-emerald-50"
              >
                {result.status}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground ml-9">
              {legalCase && <span>Caso: {legalCase.titulo}</span>}
              <span>
                {new Date(result.created_at).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir resultado?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Legal document header */}
      <div className="bg-card border border-border rounded-lg px-6 py-5 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Scale className="w-5 h-5 text-primary" />
          <h2 className="text-base font-bold text-foreground uppercase tracking-widest">
            Lex Intelligentia — Sistema Jurídico com IA
          </h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Resultado gerado automaticamente pela IA com base nos dados do caso
        </p>
      </div>

      {/* Analysis */}
      <Section
        icon={FileText}
        title="Análise"
        content={result.analise}
      />

      {/* Legal reasoning */}
      <Section
        icon={BookOpen}
        title="Fundamentação Jurídica"
        content={result.fundamentacao_juridica}
      />

      {/* Jurisprudence - 3 levels */}
      <div className="bg-card border border-border rounded-lg p-5 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Scale className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Classificação Jurisprudencial
          </h3>
        </div>
        <JurisprudenciaSection nivel="Nível 1 — STF" content={result.jurisprudencia_nivel1} />
        <JurisprudenciaSection nivel="Nível 2 — STJ" content={result.jurisprudencia_nivel2} />
        <JurisprudenciaSection nivel="Nível 3 — Tribunais" content={result.jurisprudencia_nivel3} />
      </div>

      {/* Decision */}
      <Section
        icon={Gavel}
        title="Decisão / Recomendação Final"
        content={result.decisao_recomendacao}
        highlight
      />

      {/* Back to case */}
      {legalCase && (
        <Link href={`/cases/${result.case_id}`}>
          <Button variant="outline" className="gap-2 w-full">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Caso: {legalCase.titulo}
          </Button>
        </Link>
      )}
    </div>
  );
}

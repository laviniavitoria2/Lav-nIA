import { useParams, Link, useLocation } from "wouter";
import { useState } from "react";
import {
  ArrowLeft,
  FolderOpen,
  Cpu,
  GitBranch,
  Loader2,
  Hash,
  Calendar,
  FileText,
  ChevronRight,
  Trash2,
} from "lucide-react";
import {
  useGetCase,
  getGetCaseQueryKey,
  useListSkills,
  useAnalyzeCase,
  useRunWorkflow,
  useListResults,
  getListResultsQueryKey,
  useDeleteCase,
  getListCasesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const STATUS_COLORS: Record<string, string> = {
  "Pendente": "bg-amber-100 text-amber-700 border-amber-200",
  "Em Análise": "bg-blue-100 text-blue-700 border-blue-200",
  "Concluído": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Arquivado": "bg-slate-100 text-slate-600 border-slate-200",
};

const WORKFLOWS = [
  { id: "sentenca_civel", label: "Sentença Cível" },
  { id: "saneamento", label: "Saneamento" },
  { id: "despacho", label: "Despacho" },
  { id: "conciliacao", label: "Conciliação" },
];

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const caseId = parseInt(id ?? "0", 10);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("");

  const { data: legalCase, isLoading } = useGetCase(caseId, {
    query: { enabled: !!caseId, queryKey: getGetCaseQueryKey(caseId) },
  });
  const { data: skills } = useListSkills();
  const { data: results } = useListResults({ caseId });
  const analyzeCase = useAnalyzeCase();
  const runWorkflow = useRunWorkflow();
  const deleteCase = useDeleteCase();

  const handleAnalyze = () => {
    if (!selectedSkill) return;
    const skill = skills?.find((s) => s.id === selectedSkill);
    if (!skill) return;

    toast({ title: "Iniciando análise com IA..." });
    analyzeCase.mutate(
      {
        id: caseId,
        data: {
          skill_id: skill.id,
          skill_name: skill.name,
          additional_context: null,
        },
      },
      {
        onSuccess: (result) => {
          queryClient.invalidateQueries({ queryKey: getListResultsQueryKey({ caseId }) });
          queryClient.invalidateQueries({ queryKey: getGetCaseQueryKey(caseId) });
          toast({ title: "Análise concluída com sucesso" });
          navigate(`/results/${result.id}`);
        },
        onError: () => {
          toast({ title: "Erro ao executar análise", variant: "destructive" });
        },
      }
    );
  };

  const handleWorkflow = () => {
    if (!selectedWorkflow) return;

    toast({ title: "Executando fluxo de trabalho..." });
    runWorkflow.mutate(
      {
        id: caseId,
        data: {
          workflow_type: selectedWorkflow,
          additional_context: null,
        },
      },
      {
        onSuccess: (result) => {
          queryClient.invalidateQueries({ queryKey: getListResultsQueryKey({ caseId }) });
          queryClient.invalidateQueries({ queryKey: getGetCaseQueryKey(caseId) });
          toast({ title: "Fluxo concluído com sucesso" });
          navigate(`/results/${result.id}`);
        },
        onError: () => {
          toast({ title: "Erro ao executar fluxo", variant: "destructive" });
        },
      }
    );
  };

  const handleDelete = () => {
    deleteCase.mutate(
      { id: caseId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListCasesQueryKey() });
          toast({ title: "Caso excluído" });
          navigate("/cases");
        },
        onError: () => {
          toast({ title: "Erro ao excluir caso", variant: "destructive" });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 rounded-lg" />
        <Skeleton className="h-48 rounded-lg" />
      </div>
    );
  }

  if (!legalCase) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-lg font-semibold">Caso não encontrado</h2>
        <Link href="/cases">
          <Button className="mt-4">Voltar para casos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/cases")} className="gap-2 mt-0.5">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-foreground">{legalCase.titulo}</h1>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded border ${
                  STATUS_COLORS[legalCase.status] ?? "bg-muted text-muted-foreground border-border"
                }`}
              >
                {legalCase.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              {legalCase.tipo && <span>{legalCase.tipo}</span>}
              {legalCase.numero_processo && (
                <span className="flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  {legalCase.numero_processo}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(legalCase.created_at).toLocaleDateString("pt-BR")}
              </span>
            </div>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir caso?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. O caso e todos os seus resultados serão permanentemente excluídos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Case Details */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border bg-muted/30 flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-primary" />
          <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">Detalhes do Caso</h2>
        </div>
        <div className="divide-y divide-border">
          {[
            { label: "FATOS", value: legalCase.fatos },
            { label: "PARTES", value: legalCase.partes },
            { label: "PROBLEMA", value: legalCase.problema },
            { label: "OBJETIVO", value: legalCase.objetivo },
            ...(legalCase.documentos ? [{ label: "DOCUMENTOS", value: legalCase.documentos }] : []),
          ].map(({ label, value }) => (
            <div key={label} className="px-5 py-4">
              <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">
                {label}
              </div>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Skills */}
        <div className="bg-card border border-border rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Acionar Habilidade</h2>
          </div>
          <Select onValueChange={setSelectedSkill} value={selectedSkill}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar habilidade jurídica..." />
            </SelectTrigger>
            <SelectContent>
              {skills?.map((skill) => (
                <SelectItem key={skill.id} value={skill.id}>
                  {skill.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleAnalyze}
            disabled={!selectedSkill || analyzeCase.isPending}
            className="w-full gap-2"
          >
            {analyzeCase.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Cpu className="w-4 h-4" />
            )}
            {analyzeCase.isPending ? "Analisando com IA..." : "Executar Análise"}
          </Button>
        </div>

        {/* Workflows */}
        <div className="bg-card border border-border rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Executar Fluxo</h2>
          </div>
          <Select onValueChange={setSelectedWorkflow} value={selectedWorkflow}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar fluxo de trabalho..." />
            </SelectTrigger>
            <SelectContent>
              {WORKFLOWS.map((w) => (
                <SelectItem key={w.id} value={w.id}>
                  {w.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleWorkflow}
            disabled={!selectedWorkflow || runWorkflow.isPending}
            className="w-full gap-2"
          >
            {runWorkflow.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <GitBranch className="w-4 h-4" />
            )}
            {runWorkflow.isPending ? "Executando fluxo..." : "Executar Fluxo"}
          </Button>
        </div>
      </div>

      {/* Results for this case */}
      {results && results.length > 0 && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border bg-muted/30 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Análises e Resultados ({results.length})
            </h2>
          </div>
          <div className="divide-y divide-border">
            {results.map((result) => (
              <Link key={result.id} href={`/results/${result.id}`}>
                <div className="px-5 py-3.5 flex items-center justify-between hover:bg-muted/30 cursor-pointer transition-colors group">
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {result.skill_name ?? result.workflow_type ?? "Análise"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {new Date(result.created_at).toLocaleString("pt-BR")}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

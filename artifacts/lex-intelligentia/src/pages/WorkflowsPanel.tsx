import { useState } from "react";
import { useLocation } from "wouter";
import { GitBranch, Loader2, FolderOpen, ArrowRight } from "lucide-react";
import { useListCases, useRunWorkflow, getListResultsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const WORKFLOWS = [
  {
    id: "sentenca_civel",
    label: "Sentença Cível",
    description:
      "Elabora sentença cível completa com relatório, fundamentação e dispositivo, conforme CPC/2015. Ideal para resolução de mérito em ações cíveis.",
    color: "bg-amber-500",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
  },
  {
    id: "saneamento",
    label: "Saneamento",
    description:
      "Gera decisão de saneamento e organização do processo, delimitando questões controvertidas e especificando provas necessárias (art. 357 CPC).",
    color: "bg-blue-500",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    id: "despacho",
    label: "Despacho",
    description:
      "Elabora despacho judicial adequado ao momento processual, determinando providências necessárias e fixando prazos.",
    color: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  {
    id: "conciliacao",
    label: "Conciliação",
    description:
      "Analisa os interesses das partes e elabora proposta de conciliação estruturada, mapeando pontos de convergência para acordo.",
    color: "bg-purple-500",
    badge: "bg-purple-100 text-purple-700 border-purple-200",
  },
];

export default function WorkflowsPanel() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: cases, isLoading: casesLoading } = useListCases();
  const runWorkflow = useRunWorkflow();

  const [selectedCase, setSelectedCase] = useState<string>("");
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("");

  const handleExecute = () => {
    if (!selectedCase || !selectedWorkflow) return;
    const caseId = parseInt(selectedCase, 10);

    toast({ title: "Executando fluxo com IA..." });
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
          queryClient.invalidateQueries({
            queryKey: getListResultsQueryKey({ caseId }),
          });
          toast({ title: "Fluxo executado com sucesso" });
          navigate(`/results/${result.id}`);
        },
        onError: () => {
          toast({ title: "Erro ao executar fluxo", variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Fluxos de Trabalho
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Execute fluxos jurídicos predefinidos com geração de documentos pela IA
        </p>
      </div>

      {/* Workflow selector panel */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <GitBranch className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Executar Fluxo
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Selecionar Caso
            </label>
            {casesLoading ? (
              <Skeleton className="h-10 rounded-md" />
            ) : (
              <Select onValueChange={setSelectedCase} value={selectedCase}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar caso jurídico..." />
                </SelectTrigger>
                <SelectContent>
                  {cases?.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Tipo de Fluxo
            </label>
            <Select onValueChange={setSelectedWorkflow} value={selectedWorkflow}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar fluxo..." />
              </SelectTrigger>
              <SelectContent>
                {WORKFLOWS.map((w) => (
                  <SelectItem key={w.id} value={w.id}>
                    {w.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleExecute}
          disabled={!selectedCase || !selectedWorkflow || runWorkflow.isPending}
          className="gap-2"
        >
          {runWorkflow.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <GitBranch className="w-4 h-4" />
          )}
          {runWorkflow.isPending ? "Executando fluxo com IA..." : "Executar Fluxo Selecionado"}
        </Button>
      </div>

      {/* Workflow cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {WORKFLOWS.map((workflow) => (
          <div
            key={workflow.id}
            className={`bg-card border rounded-lg p-5 cursor-pointer transition-all ${
              selectedWorkflow === workflow.id
                ? "border-primary shadow-sm"
                : "border-border hover:border-primary/30"
            }`}
            onClick={() => setSelectedWorkflow(workflow.id)}
          >
            <div className="flex items-start gap-3 mb-3">
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 ${workflow.color}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-sm text-foreground">{workflow.label}</h3>
                  {selectedWorkflow === workflow.id && (
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded border ${workflow.badge}`}
                    >
                      Selecionado
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {workflow.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick access to cases */}
      <div className="bg-card border border-border rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Casos Disponíveis</h2>
          </div>
          <span className="text-xs text-muted-foreground">{cases?.length ?? 0} casos</span>
        </div>
        {casesLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-8 rounded" />)}
          </div>
        ) : cases && cases.length > 0 ? (
          <div className="divide-y divide-border">
            {cases.slice(0, 5).map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCase(String(c.id))}
                className={`w-full text-left px-0 py-2.5 flex items-center justify-between hover:opacity-80 transition-opacity ${
                  selectedCase === String(c.id) ? "text-primary" : "text-foreground"
                }`}
              >
                <span className="text-sm truncate flex-1">{c.titulo}</span>
                <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 ml-2 text-muted-foreground" />
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Nenhum caso disponível. Crie um caso primeiro.</p>
        )}
      </div>
    </div>
  );
}

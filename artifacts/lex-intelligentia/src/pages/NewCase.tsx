import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, FolderOpen, Save, Loader2 } from "lucide-react";
import { useCreateCase, getListCasesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LEGAL_TYPES = [
  "Direito Civil",
  "Direito do Consumidor",
  "Direito de Família",
  "Direito do Trabalho",
  "Direito Previdenciário",
  "Direito Tributário",
  "Direito Penal",
  "Direito Administrativo",
  "Direito Constitucional",
  "Direito Empresarial",
  "Direito Imobiliário",
  "Direito Ambiental",
  "Outros",
];

const schema = z.object({
  titulo: z.string().min(3, "Título deve ter ao menos 3 caracteres"),
  tipo: z.string().optional(),
  numero_processo: z.string().optional(),
  fatos: z.string().min(20, "Descreva os fatos com mais detalhes"),
  partes: z.string().min(10, "Descreva as partes envolvidas"),
  problema: z.string().min(10, "Descreva o problema jurídico"),
  objetivo: z.string().min(10, "Descreva o objetivo da ação"),
  documentos: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewCase() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createCase = useCreateCase();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    createCase.mutate(
      {
        data: {
          titulo: data.titulo,
          fatos: data.fatos,
          partes: data.partes,
          problema: data.problema,
          objetivo: data.objetivo,
          documentos: data.documentos || null,
          tipo: data.tipo || null,
          numero_processo: data.numero_processo || null,
        },
      },
      {
        onSuccess: (newCase) => {
          queryClient.invalidateQueries({ queryKey: getListCasesQueryKey() });
          toast({ title: "Caso criado com sucesso" });
          navigate(`/cases/${newCase.id}`);
        },
        onError: () => {
          toast({ title: "Erro ao criar caso", variant: "destructive" });
        },
      }
    );
  });

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/cases")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Novo Caso Jurídico</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Preencha os campos com as informações do caso
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Identificação */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <FolderOpen className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Identificação do Caso
            </h2>
          </div>

          <div className="space-y-2">
            <Label htmlFor="titulo" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Título do Caso <span className="text-destructive">*</span>
            </Label>
            <Input
              id="titulo"
              placeholder="Ex: Indenização por Dano Moral - Negativação Indevida"
              {...register("titulo")}
            />
            {errors.titulo && (
              <p className="text-xs text-destructive">{errors.titulo.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Tipo / Área do Direito
              </Label>
              <Select onValueChange={(v) => setValue("tipo", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar área..." />
                </SelectTrigger>
                <SelectContent>
                  {LEGAL_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="numero_processo" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Número do Processo
              </Label>
              <Input
                id="numero_processo"
                placeholder="Ex: 1234567-89.2024.8.26.0100"
                {...register("numero_processo")}
              />
            </div>
          </div>
        </div>

        {/* Campos estruturados */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-5">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-1">
            Estrutura do Caso
          </h2>

          {[
            {
              field: "fatos" as const,
              label: "FATOS",
              placeholder:
                "Descreva os fatos de forma cronológica e objetiva. Inclua datas, eventos, e contexto relevante para a compreensão do caso...",
              required: true,
            },
            {
              field: "partes" as const,
              label: "PARTES",
              placeholder:
                "Identifique todas as partes envolvidas: autor/réu/reclamante/reclamado. Inclua qualificação (nome completo, CPF/CNPJ, endereço, representantes)...",
              required: true,
            },
            {
              field: "problema" as const,
              label: "PROBLEMA",
              placeholder:
                "Qual é o problema jurídico central? Qual a questão de direito material ou processual que deve ser resolvida?...",
              required: true,
            },
            {
              field: "objetivo" as const,
              label: "OBJETIVO",
              placeholder:
                "O que se busca com a ação/análise? Qual o pedido principal e eventuais pedidos subsidiários?...",
              required: true,
            },
            {
              field: "documentos" as const,
              label: "DOCUMENTOS",
              placeholder:
                "Liste os documentos disponíveis ou mencione as provas que fundamentam o caso (contratos, notas fiscais, laudos, certidões, extratos, etc.)...",
              required: false,
            },
          ].map(({ field, label, placeholder, required }) => (
            <div key={field} className="space-y-2">
              <Label
                htmlFor={field}
                className="text-xs font-semibold text-primary uppercase tracking-widest"
              >
                {label} {required && <span className="text-destructive">*</span>}
              </Label>
              <Textarea
                id={field}
                placeholder={placeholder}
                rows={4}
                className="resize-none text-sm"
                {...register(field)}
              />
              {errors[field] && (
                <p className="text-xs text-destructive">{errors[field]?.message}</p>
              )}
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/cases")}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={createCase.isPending}
            className="gap-2"
          >
            {createCase.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Salvar Caso
          </Button>
        </div>
      </form>
    </div>
  );
}

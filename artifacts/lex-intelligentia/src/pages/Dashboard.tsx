import { Link } from "wouter";
import {
  FolderOpen,
  Activity,
  CheckCircle,
  Clock,
  GitBranch,
  Cpu,
  ArrowRight,
  TrendingUp,
  FileText,
} from "lucide-react";
import { useGetDashboardStats } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-lg border border-border p-5 ${accent ? "bg-primary text-primary-foreground" : "bg-card"}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className={`text-xs font-medium tracking-wider uppercase mb-2 ${accent ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
            {label}
          </div>
          <div className={`text-3xl font-bold tabular-nums ${accent ? "text-primary-foreground" : "text-foreground"}`}>
            {value}
          </div>
        </div>
        <div className={`p-2 rounded-md ${accent ? "bg-primary-foreground/10" : "bg-muted"}`}>
          <Icon className={`w-5 h-5 ${accent ? "text-primary-foreground" : "text-muted-foreground"}`} />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: stats, isLoading } = useGetDashboardStats();

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Painel Principal
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Sistema Operacional Jurídico com IA — Visão Geral
          </p>
        </div>
        <Link href="/cases/new">
          <Button size="sm" className="gap-2">
            <FolderOpen className="w-4 h-4" />
            Novo Caso
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total de Casos"
          value={stats?.total_cases ?? 0}
          icon={FolderOpen}
          accent
        />
        <StatCard
          label="Em Análise"
          value={stats?.active_cases ?? 0}
          icon={Activity}
        />
        <StatCard
          label="Análises Concluídas"
          value={stats?.completed_analyses ?? 0}
          icon={CheckCircle}
        />
        <StatCard
          label="Casos Pendentes"
          value={stats?.pending_cases ?? 0}
          icon={Clock}
        />
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Atividade Recente</h2>
            </div>
            <Link href="/results">
              <button className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
                Ver todos
                <ArrowRight className="w-3 h-3" />
              </button>
            </Link>
          </div>
          <div className="divide-y divide-border">
            {stats?.recent_activity && stats.recent_activity.length > 0 ? (
              stats.recent_activity.slice(0, 6).map((item) => (
                <div key={item.id} className="px-5 py-3.5 flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{item.description}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(item.timestamp).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    Análise
                  </Badge>
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-center">
                <FileText className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Nenhuma atividade recente. Execute uma análise para começar.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Workflow stats */}
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <GitBranch className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Fluxos Executados</h2>
            </div>
            <div className="text-3xl font-bold text-foreground tabular-nums mb-1">
              {stats?.workflows_executed ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">Workflows processados pelo sistema</p>
          </div>

          {/* Cases by type */}
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Casos por Tipo</h2>
            </div>
            {stats?.cases_by_type && stats.cases_by_type.length > 0 ? (
              <div className="space-y-2.5">
                {stats.cases_by_type.slice(0, 5).map((item) => (
                  <div key={item.tipo} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground truncate flex-1 mr-2">{item.tipo}</span>
                    <Badge variant="secondary" className="text-xs">
                      {item.count}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Nenhum caso categorizado ainda.</p>
            )}
          </div>

          {/* Quick actions */}
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Ações Rápidas</h2>
            </div>
            <div className="space-y-2">
              <Link href="/cases/new">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs">
                  <FolderOpen className="w-3.5 h-3.5" />
                  Novo Caso Jurídico
                </Button>
              </Link>
              <Link href="/skills">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs">
                  <Cpu className="w-3.5 h-3.5" />
                  Painel de Habilidades
                </Button>
              </Link>
              <Link href="/workflows">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs">
                  <GitBranch className="w-3.5 h-3.5" />
                  Executar Fluxo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/dashboard/Overview";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/useUser";
import { useEmpresa } from "@/hooks/useEmpresa";
import { useTC } from "@/hooks/useTC";
import { useObrigacao } from "@/hooks/useObrigacao";
import { ArrowUpRight, AlertTriangle, CheckCircle2, Building2, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardMetrics {
  declaracoesPendentes: number;
  obrigacoesAtraso: number;
  tcsEmitidos: number;
  empresasAtivas: number;
  variacaoDeclaracoes: number;
  variacaoObrigacoes: number;
  variacaoTCs: number;
  variacaoEmpresas: number;
}

export default function Home() {
  const router = useRouter();
  const { user, isLoading: isLoadingUser } = useUser();
  const { empresa, isLoading: isLoadingEmpresa } = useEmpresa();
  const { tcs, isLoading: isLoadingTCs } = useTC();
  const { obrigacoes, isLoading: isLoadingObrigacoes } = useObrigacao();

  const [metrics, setMetrics] = useState<DashboardMetrics>({
    declaracoesPendentes: 0,
    obrigacoesAtraso: 0,
    tcsEmitidos: 0,
    empresasAtivas: 0,
    variacaoDeclaracoes: 0,
    variacaoObrigacoes: 0,
    variacaoTCs: 0,
    variacaoEmpresas: 0,
  });

  useEffect(() => {
    if (!isLoadingUser && !user) {
      router.push('/login');
    }
  }, [user, isLoadingUser, router]);

  useEffect(() => {
    if (!isLoadingObrigacoes && obrigacoes) {
      setMetrics(prev => ({
        ...prev,
        declaracoesPendentes: obrigacoes.filter(o => o.status === 'pendente').length,
        obrigacoesAtraso: obrigacoes.filter(o => o.status === 'atrasado').length,
        variacaoDeclaracoes: 10, // TODO: Calcular variação real
        variacaoObrigacoes: 5, // TODO: Calcular variação real
      }));
    }
  }, [obrigacoes, isLoadingObrigacoes]);

  useEffect(() => {
    if (!isLoadingTCs && tcs) {
      setMetrics(prev => ({
        ...prev,
        tcsEmitidos: tcs.length,
        variacaoTCs: 15, // TODO: Calcular variação real
      }));
    }
  }, [tcs, isLoadingTCs]);

  useEffect(() => {
    if (!isLoadingEmpresa && empresa) {
      setMetrics(prev => ({
        ...prev,
        empresasAtivas: 1,
        variacaoEmpresas: 0,
      }));
    }
  }, [empresa, isLoadingEmpresa]);

  if (isLoadingUser || isLoadingEmpresa || isLoadingTCs || isLoadingObrigacoes) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <Skeleton className="h-8 w-[250px]" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-[125px]" />
          <Skeleton className="h-[125px]" />
          <Skeleton className="h-[125px]" />
          <Skeleton className="h-[125px]" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="col-span-4 h-[350px]" />
          <Skeleton className="col-span-3 h-[350px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button onClick={() => router.push('/dashboard/titulos/novo')}>
            Novo Título
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Declarações Pendentes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.declaracoesPendentes}</div>
            <p className="text-xs text-muted-foreground">
              <span className={cn(
                metrics.variacaoDeclaracoes > 0 ? "text-green-500" : "text-red-500"
              )}>
                {metrics.variacaoDeclaracoes > 0 ? "+" : ""}{metrics.variacaoDeclaracoes}%
              </span>{" "}
              em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Obrigações em Atraso</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.obrigacoesAtraso}</div>
            <p className="text-xs text-muted-foreground">
              <span className={cn(
                metrics.variacaoObrigacoes > 0 ? "text-red-500" : "text-green-500"
              )}>
                {metrics.variacaoObrigacoes > 0 ? "+" : ""}{metrics.variacaoObrigacoes}%
              </span>{" "}
              em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Títulos Emitidos</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.tcsEmitidos}</div>
            <p className="text-xs text-muted-foreground">
              <span className={cn(
                metrics.variacaoTCs > 0 ? "text-green-500" : "text-red-500"
              )}>
                {metrics.variacaoTCs > 0 ? "+" : ""}{metrics.variacaoTCs}%
              </span>{" "}
              em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas Ativas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.empresasAtivas}</div>
            <p className="text-xs text-muted-foreground">
              <span className={cn(
                metrics.variacaoEmpresas > 0 ? "text-green-500" : "text-red-500"
              )}>
                {metrics.variacaoEmpresas > 0 ? "+" : ""}{metrics.variacaoEmpresas}%
              </span>{" "}
              em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Últimas ações realizadas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

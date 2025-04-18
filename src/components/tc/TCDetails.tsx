"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TC, TCStatus } from "@/types/tc";
import { formatCurrency } from "@/lib/utils";
import { Download, FileText, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { tcService } from "@/services/tc.service";

interface TCDetailsProps {
  tc: TC | null;
}

export function TCDetails({ tc }: TCDetailsProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status: TCStatus) => {
    switch (status) {
      case "APROVADO":
        return "bg-green-100 text-green-800";
      case "PENDENTE":
        return "bg-yellow-100 text-yellow-800";
      case "COMPENSADO":
        return "bg-blue-100 text-blue-800";
      case "REJEITADO":
        return "bg-red-100 text-red-800";
      case "VENCIDO":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: TCStatus) => {
    switch (status) {
      case "APROVADO":
        return <CheckCircle2 className="w-4 h-4" />;
      case "PENDENTE":
        return <Clock className="w-4 h-4" />;
      case "REJEITADO":
      case "VENCIDO":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleExport = async () => {
    if (!tc) return;
    
    try {
      setLoading(true);
      await tcService.gerarPDF(tc.id);
      toast({
        title: "Sucesso",
        description: "PDF do TC gerado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao exportar TC. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!tc) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center">
            <h3 className="text-lg font-medium">Selecione um título de crédito</h3>
            <p className="text-muted-foreground">
              Para visualizar os detalhes, selecione um TC na lista
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            TC {tc.numero}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleExport} disabled={loading}>
              <Download className="h-4 w-4" />
            </Button>
            <Badge className={getStatusColor(tc.status)}>
              <div className="flex items-center gap-1">
                {getStatusIcon(tc.status)}
                <span>{tc.status}</span>
              </div>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Tipo</h3>
                <p className="mt-1">{tc.tipo}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Emissor</h3>
                <p className="mt-1">{tc.emissor.nome} ({tc.emissor.documento})</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Origem do Crédito</h3>
                <p className="mt-1">{tc.origemCredito}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Tipo de Tributo</h3>
                <p className="mt-1">{tc.tipoTributo}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Valor Total</h3>
                <p className="mt-1">{formatCurrency(tc.valorTotal)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Valor Disponível</h3>
                <p className="mt-1">{formatCurrency(tc.valorDisponivel)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Data de Emissão</h3>
                <p className="mt-1">{new Date(tc.dataEmissao).toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Data de Validade</h3>
                <p className="mt-1">{new Date(tc.dataValidade).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {tc.processoAdministrativo && (
        <Card>
          <CardHeader>
            <CardTitle>Processo Administrativo</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{tc.processoAdministrativo}</p>
          </CardContent>
        </Card>
      )}

      {tc.processoJudicial && (
        <Card>
          <CardHeader>
            <CardTitle>Processo Judicial</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{tc.processoJudicial}</p>
          </CardContent>
        </Card>
      )}

      {tc.documentos && tc.documentos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Documentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tc.documentos.map((doc) => (
                <div key={doc.id} className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {doc.nome}
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 
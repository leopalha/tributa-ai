"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  ArrowUpDown,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { TituloDeCredito } from "@/types/tc";

const ITEMS_PER_PAGE = 10;

interface TCListProps {
  tcs: TituloDeCredito[];
  onSelect: (tc: TituloDeCredito) => void;
}

export function TCList({ tcs, onSelect }: TCListProps) {
  const { toast } = useToast();
  const [sortField, setSortField] = useState<keyof TituloDeCredito>("dataEmissão");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const getStatusColor = (status: TituloDeCredito["statusTitulo"]) => {
    switch (status.toLowerCase()) {
      case "pendente":
        return "bg-yellow-100 text-yellow-800";
      case "validado":
        return "bg-green-100 text-green-800";
      case "em_negociação":
        return "bg-blue-100 text-blue-800";
      case "vendido":
        return "bg-purple-100 text-purple-800";
      case "compensado":
        return "bg-gray-100 text-gray-800";
      case "cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSort = (field: keyof TituloDeCredito) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedTCs = [...tcs].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedTCs.length / ITEMS_PER_PAGE);
  const paginatedTCs = sortedTCs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Card>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("numeroTitulo")}
                >
                  Número do Título
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("tipoTitulo")}
                >
                  Tipo do Título
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("valorOriginal")}
                >
                  Valor Original
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("valorDisponivel")}
                >
                  Valor Disponível
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("dataEmissão")}
                >
                  Data de Emissão
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("dataVencimento")}
                >
                  Data de Vencimento
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("statusTitulo")}
                >
                  Status
                </TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTCs.map((tc) => (
                <TableRow key={tc.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onSelect(tc)}>
                  <TableCell>{tc.numeroTitulo}</TableCell>
                  <TableCell>{tc.tipoTitulo}</TableCell>
                  <TableCell>{formatCurrency(tc.valorOriginal)}</TableCell>
                  <TableCell>{formatCurrency(tc.valorDisponivel)}</TableCell>
                  <TableCell>{formatDate(tc.dataEmissão)}</TableCell>
                  <TableCell>{formatDate(tc.dataVencimento)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(tc.statusTitulo)}>
                      {tc.statusTitulo}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={(e) => {
                      e.stopPropagation();
                      // Handle export
                      toast({
                        title: "Exportando título",
                        description: "O título está sendo exportado para PDF.",
                      });
                    }}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Próxima
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
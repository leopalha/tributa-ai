"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Obrigacao {
  id: string
  nome: string
  empresa: string
  prazo: string
  status: "pendente" | "atrasada" | "concluida"
  tipo: "federal" | "estadual" | "municipal"
}

const obrigacoes: Obrigacao[] = [
  {
    id: "1",
    nome: "DCTF",
    empresa: "Empresa ABC Ltda",
    prazo: "2024-03-25",
    status: "pendente",
    tipo: "federal",
  },
  {
    id: "2",
    nome: "GIA",
    empresa: "XYZ Comércio",
    prazo: "2024-03-20",
    status: "atrasada",
    tipo: "estadual",
  },
  {
    id: "3",
    nome: "ISS",
    empresa: "Tech Solutions",
    prazo: "2024-03-30",
    status: "pendente",
    tipo: "municipal",
  },
  {
    id: "4",
    nome: "EFD-Contribuições",
    empresa: "Empresa ABC Ltda",
    prazo: "2024-03-28",
    status: "pendente",
    tipo: "federal",
  },
]

function getStatusColor(status: Obrigacao["status"]) {
  switch (status) {
    case "pendente":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "atrasada":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    case "concluida":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
  }
}

function getTipoColor(tipo: Obrigacao["tipo"]) {
  switch (tipo) {
    case "federal":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "estadual":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    case "municipal":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
  }
}

export function ObrigacoesTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Obrigações Pendentes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Obrigação</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Prazo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tipo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {obrigacoes.map((obrigacao) => (
              <TableRow key={obrigacao.id}>
                <TableCell className="font-medium">{obrigacao.nome}</TableCell>
                <TableCell>{obrigacao.empresa}</TableCell>
                <TableCell>
                  {new Date(obrigacao.prazo).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "font-semibold",
                      getStatusColor(obrigacao.status)
                    )}
                  >
                    {obrigacao.status.charAt(0).toUpperCase() +
                      obrigacao.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn("font-semibold", getTipoColor(obrigacao.tipo))}
                  >
                    {obrigacao.tipo.charAt(0).toUpperCase() +
                      obrigacao.tipo.slice(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 
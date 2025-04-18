"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const data = [
  {
    name: "Jan",
    Federais: 2400,
    Estaduais: 1398,
    Municipais: 9800,
  },
  {
    name: "Fev",
    Federais: 1398,
    Estaduais: 2800,
    Municipais: 3908,
  },
  {
    name: "Mar",
    Federais: 9800,
    Estaduais: 3908,
    Municipais: 4800,
  },
  {
    name: "Abr",
    Federais: 3908,
    Estaduais: 4800,
    Municipais: 3800,
  },
  {
    name: "Mai",
    Federais: 4800,
    Estaduais: 3800,
    Municipais: 2400,
  },
  {
    name: "Jun",
    Federais: 3800,
    Estaduais: 4300,
    Municipais: 2400,
  },
]

export function AnalyticsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise de Obrigações</CardTitle>
        <CardDescription>
          Distribuição de obrigações por esfera ao longo do ano
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `${value}`}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="Federais"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="Estaduais"
              stroke="#82ca9d"
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="Municipais"
              stroke="#ffc658"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
} 
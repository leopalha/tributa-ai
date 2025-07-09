import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface LineChartComponentProps {
  data: any[];
  lines: { dataKey: string; stroke: string; name?: string }[]; // Configuração das linhas
  xAxisDataKey: string;
  title?: string;
  yAxisFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number, name: string, entry: any) => React.ReactNode;
}

export function LineChartComponent({
  data,
  lines,
  xAxisDataKey,
  title,
  yAxisFormatter,
  tooltipFormatter,
}: LineChartComponentProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground p-4">
        Sem dados para exibir o gráfico {title ? `\"${title}\"` : ''}.
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      {title && (
        <h3 className="text-center font-medium mb-2 text-sm text-muted-foreground">{title}</h3>
      )}
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisDataKey} fontSize={12} tickLine={false} axisLine={false} />
          <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={yAxisFormatter} />
          <Tooltip formatter={tooltipFormatter} />
          <Legend />
          {lines.map(line => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.stroke}
              name={line.name || line.dataKey}
              strokeWidth={2}
              dot={false} // Remover pontos individuais
              activeDot={{ r: 6 }} // Ponto ativo ao passar o mouse
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

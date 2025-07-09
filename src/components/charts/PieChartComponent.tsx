import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Cores padrão (podem ser customizadas)
const COLORS = [
  '#0ea5e9',
  '#84cc16',
  '#f97316',
  '#a855f7',
  '#ef4444',
  '#facc15',
  '#22c55e',
  '#6366f1',
];

interface PieChartDataPoint {
  name: string;
  value: number;
}

interface PieChartComponentProps {
  data: PieChartDataPoint[];
  title?: string;
  dataKey?: string; // Chave do valor no objeto de dados
  nameKey?: string; // Chave do nome/label no objeto de dados
}

export function PieChartComponent({
  data,
  title,
  dataKey = 'value', // Valor padrão
  nameKey = 'name', // Valor padrão
}: PieChartComponentProps) {
  // Garantir que os dados estejam no formato correto para o gráfico
  const chartData = data.map(item => ({
    name: item[nameKey as keyof PieChartDataPoint] as string,
    value: item[dataKey as keyof PieChartDataPoint] as number,
  }));

  if (!chartData || chartData.length === 0) {
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
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            // label={renderCustomizedLabel} // Label customizado se necessário
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => new Intl.NumberFormat('pt-BR').format(value)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// Exemplo de label customizado (opcional)
/*
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
*/

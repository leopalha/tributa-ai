import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface BarChartComponentProps {
  data: any[]; // Dados para o gráfico
  barDataKey: string; // Chave para os valores das barras
  xAxisDataKey: string; // Chave para os labels do eixo X
  title?: string;
  layout?: 'horizontal' | 'vertical'; // Orientação do gráfico
  // Adicionar mais props para customização (cores, labels, etc.)
}

export function BarChartComponent({
  data,
  barDataKey,
  xAxisDataKey,
  title,
  layout = 'vertical', // Padrão vertical
}: BarChartComponentProps) {
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
        <BarChart data={data} layout={layout} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          {layout === 'vertical' ? (
            <>
              <XAxis dataKey={xAxisDataKey} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={value => `$${value}`}
              />
            </>
          ) : (
            <>
              <XAxis
                type="number"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={value => `$${value}`}
              />
              <YAxis
                type="category"
                dataKey={xAxisDataKey}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
            </>
          )}
          <Tooltip
            formatter={(value: number) => new Intl.NumberFormat('pt-BR').format(value)}
            cursor={{ fill: 'transparent' }}
          />
          <Legend />
          <Bar dataKey={barDataKey} fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          {/* Adicionar mais barras se necessário */}
          {/* <Bar dataKey="outraChave" fill="#84cc16" radius={[4, 4, 0, 0]} /> */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

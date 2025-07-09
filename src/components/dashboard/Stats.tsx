import { Card } from './Card';
import { FileText, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export function Stats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card
        title="Total de Declarações"
        value="1,234"
        icon={FileText}
        description="Declarações enviadas este mês"
      />
      <Card
        title="Pendentes"
        value="45"
        icon={Clock}
        variant="warning"
        description="Declarações aguardando envio"
      />
      <Card
        title="Com Erro"
        value="12"
        icon={AlertTriangle}
        variant="destructive"
        description="Declarações com erro de validação"
      />
      <Card
        title="Processadas"
        value="1,177"
        icon={CheckCircle2}
        variant="success"
        description="Declarações processadas com sucesso"
      />
    </div>
  );
}

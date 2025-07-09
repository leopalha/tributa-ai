import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useMarketplace } from '@/hooks/use-marketplace';
import { CreditCategory, CreditStatus } from '@prisma/client';

export function MarketplaceFilters() {
  const { filters, setFilters } = useMarketplace();

  return (
    <Card className="p-4">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Categoria</Label>
          <Select
            value={filters.category}
            onValueChange={value => setFilters({ ...filters, category: value as CreditCategory })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TRIBUTARIO">Tributário</SelectItem>
              <SelectItem value="COMERCIAL">Comercial</SelectItem>
              <SelectItem value="FINANCEIRO">Financeiro</SelectItem>
              <SelectItem value="JUDICIAL">Judicial</SelectItem>
              <SelectItem value="RURAL">Rural</SelectItem>
              <SelectItem value="IMOBILIARIO">Imobiliário</SelectItem>
              <SelectItem value="AMBIENTAL">Ambiental</SelectItem>
              <SelectItem value="ESPECIAL">Especial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Faixa de Valor</Label>
          <Slider
            defaultValue={[filters.minValue || 0, filters.maxValue || 1000000]}
            max={1000000}
            step={1000}
            className="w-full"
            onValueChange={([min, max]) => setFilters({ ...filters, minValue: min, maxValue: max })}
          />
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={filters.status}
            onValueChange={value => setFilters({ ...filters, status: value as CreditStatus })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VALIDATED">Validado</SelectItem>
              <SelectItem value="TOKENIZED">Tokenizado</SelectItem>
              <SelectItem value="LISTED_FOR_SALE">Listado</SelectItem>
              <SelectItem value="IN_NEGOTIATION">Em Negociação</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="verified"
            checked={filters.verified}
            onCheckedChange={checked => setFilters({ ...filters, verified: checked })}
          />
          <Label htmlFor="verified">Apenas Verificados</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="blockchain"
            checked={filters.tokenized}
            onCheckedChange={checked => setFilters({ ...filters, tokenized: checked })}
          />
          <Label htmlFor="blockchain">Tokenizados</Label>
        </div>
      </div>
    </Card>
  );
}

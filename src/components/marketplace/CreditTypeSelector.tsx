import React, { useState } from 'react';
import { CreditCard, BarChart, FileText, Building, Leaf, Home, Briefcase, Tag } from 'lucide-react';
import {
  CreditCategory,
  TCTributarioFederal,
  TCTributarioEstadual,
  TCTributarioMunicipal,
  TCComercial,
  TCFinanceiro,
  TCJudicial,
  TCRural,
  TCImobiliario,
  TCAmbiental,
  TCEspecial,
} from '@/types/credit-types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Define credit types and subtypes
const creditTypes = [
  {
    category: 'TRIBUTARIO',
    label: 'Tributário',
    color: 'blue',
    icon: '📋',
    description: 'Créditos tributários validados',
    subtypes: [
      {
        id: 'ICMS',
        label: 'ICMS',
        description: 'Imposto sobre Circulação de Mercadorias e Serviços',
      },
      { id: 'IPI', label: 'IPI', description: 'Imposto sobre Produtos Industrializados' },
      {
        id: 'PIS_COFINS',
        label: 'PIS/COFINS',
        description:
          'Programa de Integração Social e Contribuição para o Financiamento da Seguridade Social',
      },
      { id: 'IRPJ', label: 'IRPJ', description: 'Imposto de Renda Pessoa Jurídica' },
      { id: 'CSLL', label: 'CSLL', description: 'Contribuição Social sobre o Lucro Líquido' },
      { id: 'OUTROS_TRIBUTARIOS', label: 'Outros', description: 'Outros créditos tributários' },
    ],
  },
  {
    category: 'JUDICIAL',
    label: 'Judicial',
    color: 'purple',
    icon: '⚖️',
    description: 'Créditos oriundos de processos judiciais',
    subtypes: [
      {
        id: 'PRECATORIO_FEDERAL',
        label: 'Precatório Federal',
        description: 'Créditos contra a União Federal',
      },
      {
        id: 'PRECATORIO_ESTADUAL',
        label: 'Precatório Estadual',
        description: 'Créditos contra Estados',
      },
      {
        id: 'PRECATORIO_MUNICIPAL',
        label: 'Precatório Municipal',
        description: 'Créditos contra Municípios',
      },
      {
        id: 'ACAO_JUDICIAL',
        label: 'Ação Judicial',
        description: 'Créditos de ações judiciais em andamento',
      },
    ],
  },
  {
    category: 'COMERCIAL',
    label: 'Comercial',
    color: 'green',
    icon: '🏢',
    description: 'Créditos comerciais entre empresas',
    subtypes: [
      { id: 'DUPLICATA', label: 'Duplicata', description: 'Duplicatas mercantis' },
      { id: 'CHEQUE', label: 'Cheque', description: 'Créditos de cheques' },
      {
        id: 'CONTRATO',
        label: 'Contrato',
        description: 'Créditos oriundos de contratos comerciais',
      },
    ],
  },
  {
    category: 'FINANCEIRO',
    label: 'Financeiro',
    color: 'amber',
    icon: '💰',
    description: 'Créditos do mercado financeiro',
    subtypes: [
      { id: 'DEBENTURE', label: 'Debênture', description: 'Debêntures' },
      { id: 'CRI', label: 'CRI', description: 'Certificado de Recebíveis Imobiliários' },
      { id: 'CRA', label: 'CRA', description: 'Certificado de Recebíveis do Agronegócio' },
      { id: 'LCI', label: 'LCI/LCA', description: 'Letras de Crédito Imobiliário/Agronegócio' },
    ],
  },
  {
    category: 'AMBIENTAL',
    label: 'Ambiental',
    color: 'emerald',
    icon: '🌿',
    description: 'Créditos ambientais e sustentáveis',
    subtypes: [
      {
        id: 'CARBONO',
        label: 'Crédito de Carbono',
        description: 'Certificados de redução de emissão de carbono',
      },
      {
        id: 'RENOVAVEL',
        label: 'Energia Renovável',
        description: 'Créditos de geração de energia renovável',
      },
      {
        id: 'RECICLAGEM',
        label: 'Reciclagem',
        description: 'Créditos de logística reversa e reciclagem',
      },
    ],
  },
  {
    category: 'ESPECIAL',
    label: 'Especial',
    color: 'indigo',
    icon: '🔶',
    description: 'Outros tipos de créditos',
    subtypes: [
      { id: 'OUTROS', label: 'Outros', description: 'Outros tipos de créditos especiais' },
    ],
  },
];

interface CreditTypeSelectorProps {
  onCategorySelect: (category: CreditCategory) => void;
  onSubTypeSelect: (subType: string) => void;
  selectedCategory?: CreditCategory;
  selectedSubType?: string;
  className?: string;
}

const categoryIcons = {
  [CreditCategory.TRIBUTARIO]: <BarChart className="h-5 w-5" />,
  [CreditCategory.COMERCIAL]: <CreditCard className="h-5 w-5" />,
  [CreditCategory.FINANCEIRO]: <Tag className="h-5 w-5" />,
  [CreditCategory.JUDICIAL]: <FileText className="h-5 w-5" />,
  [CreditCategory.RURAL]: <Leaf className="h-5 w-5" />,
  [CreditCategory.IMOBILIARIO]: <Home className="h-5 w-5" />,
  [CreditCategory.AMBIENTAL]: <Leaf className="h-5 w-5" />,
  [CreditCategory.ESPECIAL]: <Briefcase className="h-5 w-5" />,
};

const categoryLabels = {
  [CreditCategory.TRIBUTARIO]: 'Tributário',
  [CreditCategory.COMERCIAL]: 'Comercial',
  [CreditCategory.FINANCEIRO]: 'Financeiro',
  [CreditCategory.JUDICIAL]: 'Judicial',
  [CreditCategory.RURAL]: 'Rural',
  [CreditCategory.IMOBILIARIO]: 'Imobiliário',
  [CreditCategory.AMBIENTAL]: 'Ambiental',
  [CreditCategory.ESPECIAL]: 'Especial',
};

export function CreditTypeSelector({
  onCategorySelect,
  onSubTypeSelect,
  selectedCategory,
  selectedSubType,
  className,
}: CreditTypeSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<CreditCategory>(
    selectedCategory || CreditCategory.TRIBUTARIO
  );

  const handleCategoryChange = (category: CreditCategory) => {
    setActiveCategory(category);
    onCategorySelect(category);
  };

  const handleSubTypeSelect = (subType: string) => {
    onSubTypeSelect(subType);
  };

  // Get the selected category info
  const selectedCategoryInfo = creditTypes.find(c => c.category === selectedCategory);

  // Helper para renderizar os subtipos específicos de cada categoria
  const renderSubTypeSelector = () => {
    switch (activeCategory) {
      case CreditCategory.TRIBUTARIO:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Card className="border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Créditos Federais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.values(TCTributarioFederal).map(subType => (
                    <Button
                      key={subType}
                      variant={selectedSubType === subType ? 'default' : 'outline'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleSubTypeSelect(subType)}
                    >
                      {subType.replace(/_/g, ' ')}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card className="border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Créditos Estaduais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.values(TCTributarioEstadual).map(subType => (
                    <Button
                      key={subType}
                      variant={selectedSubType === subType ? 'default' : 'outline'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleSubTypeSelect(subType)}
                    >
                      {subType.replace(/_/g, ' ')}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card className="border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Créditos Municipais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.values(TCTributarioMunicipal).map(subType => (
                    <Button
                      key={subType}
                      variant={selectedSubType === subType ? 'default' : 'outline'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleSubTypeSelect(subType)}
                    >
                      {subType.replace(/_/g, ' ')}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case CreditCategory.COMERCIAL:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.values(TCComercial).map(subType => (
                <Button
                  key={subType}
                  variant={selectedSubType === subType ? 'default' : 'outline'}
                  className="h-auto py-3 justify-start"
                  onClick={() => handleSubTypeSelect(subType)}
                >
                  <div className="text-left">
                    <div className="font-medium">{subType.replace(/_/g, ' ')}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        );

      case CreditCategory.FINANCEIRO:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.values(TCFinanceiro).map(subType => (
                <Button
                  key={subType}
                  variant={selectedSubType === subType ? 'default' : 'outline'}
                  className="h-auto py-3 justify-start"
                  onClick={() => handleSubTypeSelect(subType)}
                >
                  <div className="text-left">
                    <div className="font-medium">{subType.replace(/_/g, ' ')}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        );

      case CreditCategory.JUDICIAL:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.values(TCJudicial).map(subType => (
                <Button
                  key={subType}
                  variant={selectedSubType === subType ? 'default' : 'outline'}
                  className="h-auto py-3 justify-start"
                  onClick={() => handleSubTypeSelect(subType)}
                >
                  <div className="text-left">
                    <div className="font-medium">{subType.replace(/_/g, ' ')}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        );

      case CreditCategory.RURAL:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.values(TCRural).map(subType => (
                <Button
                  key={subType}
                  variant={selectedSubType === subType ? 'default' : 'outline'}
                  className="h-auto py-3 justify-start"
                  onClick={() => handleSubTypeSelect(subType)}
                >
                  <div className="text-left">
                    <div className="font-medium">{subType.replace(/_/g, ' ')}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        );

      case CreditCategory.IMOBILIARIO:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.values(TCImobiliario).map(subType => (
                <Button
                  key={subType}
                  variant={selectedSubType === subType ? 'default' : 'outline'}
                  className="h-auto py-3 justify-start"
                  onClick={() => handleSubTypeSelect(subType)}
                >
                  <div className="text-left">
                    <div className="font-medium">{subType.replace(/_/g, ' ')}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        );

      case CreditCategory.AMBIENTAL:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.values(TCAmbiental).map(subType => (
                <Button
                  key={subType}
                  variant={selectedSubType === subType ? 'default' : 'outline'}
                  className="h-auto py-3 justify-start"
                  onClick={() => handleSubTypeSelect(subType)}
                >
                  <div className="text-left">
                    <div className="font-medium">{subType.replace(/_/g, ' ')}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        );

      case CreditCategory.ESPECIAL:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.values(TCEspecial).map(subType => (
                <Button
                  key={subType}
                  variant={selectedSubType === subType ? 'default' : 'outline'}
                  className="h-auto py-3 justify-start"
                  onClick={() => handleSubTypeSelect(subType)}
                >
                  <div className="text-left">
                    <div className="font-medium">{subType.replace(/_/g, ' ')}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={className}>
      <Tabs
        defaultValue={activeCategory}
        value={activeCategory}
        onValueChange={value => handleCategoryChange(value as CreditCategory)}
      >
        <TabsList className="grid grid-cols-4 md:grid-cols-8 mb-6">
          {Object.values(CreditCategory).map(category => (
            <TabsTrigger
              key={category}
              value={category}
              className="flex flex-col items-center gap-1 px-1 py-2 h-auto"
            >
              <div>{categoryIcons[category]}</div>
              <div className="text-xs">{categoryLabels[category]}</div>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {categoryIcons[activeCategory]}
                <span className="ml-2">Créditos {categoryLabels[activeCategory]}</span>
              </CardTitle>
              <CardDescription>
                Selecione o tipo específico de crédito{' '}
                {categoryLabels[activeCategory].toLowerCase()} que deseja utilizar.
              </CardDescription>
            </CardHeader>
            <CardContent>{renderSubTypeSelector()}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedCategory && selectedSubType && (
        <div className="mt-4">
          <Badge variant="outline" className="text-sm py-1.5 px-3">
            {categoryLabels[selectedCategory]}: {selectedSubType.replace(/_/g, ' ')}
          </Badge>
        </div>
      )}
    </div>
  );
}

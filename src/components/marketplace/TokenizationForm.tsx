import React, { useState } from 'react';
import {
  Upload,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Calendar,
  FileText,
  Settings,
  Info,
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Serviços
import { tokenizationService, TCType, AuctionType } from '@/services/tokenization-service';

interface TokenizationFormProps {
  onSuccess?: (tokenizedTC: any) => void;
  onCancel?: () => void;
}

interface FormData {
  // Básico
  type: TCType;
  title: string;
  description: string;
  originalValue: number;
  maturityDate: string;

  // Tokenização
  tokenSupply: number;
  minimumInvestment: number;
  auctionType: AuctionType;
  startingPrice?: number;
  reservePrice?: number;
  auctionDuration?: number;

  // Emissor
  customIssuer?: {
    name: string;
    document: string;
    type: 'PF' | 'PJ';
  };

  // Documentos
  documents: Array<{
    type: string;
    file: File | null;
    description: string;
  }>;
}

const TokenizationForm: React.FC<TokenizationFormProps> = ({ onSuccess, onCancel }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    type: TCType.TRIBUTARIO_FEDERAL,
    title: '',
    description: '',
    originalValue: 0,
    maturityDate: '',
    tokenSupply: 1000,
    minimumInvestment: 1000,
    auctionType: AuctionType.FIXED_PRICE,
    documents: [
      { type: 'comprovante_pagamento', file: null, description: 'Comprovante de pagamento' },
      { type: 'notificacao_debito', file: null, description: 'Notificação de débito' },
    ],
  });

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDocumentUpload = (index: number, file: File) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.map((doc, i) => (i === index ? { ...doc, file } : doc)),
    }));
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!formData.title.trim()) errors.push('Título é obrigatório');
    if (!formData.description.trim()) errors.push('Descrição é obrigatória');
    if (formData.originalValue <= 0) errors.push('Valor original deve ser maior que zero');
    if (!formData.maturityDate) errors.push('Data de vencimento é obrigatória');
    if (formData.tokenSupply <= 0) errors.push('Quantidade de tokens deve ser maior que zero');
    if (formData.minimumInvestment <= 0) errors.push('Investimento mínimo deve ser maior que zero');

    // Validações específicas para leilões
    if (formData.auctionType !== AuctionType.FIXED_PRICE) {
      if (!formData.startingPrice || formData.startingPrice <= 0) {
        errors.push('Preço inicial é obrigatório para leilões');
      }
      if (!formData.auctionDuration || formData.auctionDuration <= 0) {
        errors.push('Duração do leilão é obrigatória');
      }
    }

    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      alert(`Erros no formulário:\n${errors.join('\n')}`);
      return;
    }

    try {
      setLoading(true);

      const request = {
        type: formData.type,
        title: formData.title,
        description: formData.description,
        originalValue: formData.originalValue,
        maturityDate: new Date(formData.maturityDate),
        tokenSupply: formData.tokenSupply,
        minimumInvestment: formData.minimumInvestment,
        auctionType: formData.auctionType,
        startingPrice: formData.startingPrice,
        reservePrice: formData.reservePrice,
        auctionDuration: formData.auctionDuration,
        customIssuer: formData.customIssuer,
        documents: formData.documents
          .filter(doc => doc.file)
          .map(doc => ({
            type: doc.type,
            file: doc.file!,
            description: doc.description,
          })),
      };

      const result = await tokenizationService.createTokenizationRequest(request);

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error('Erro ao tokenizar:', error);
      alert('Erro ao criar solicitação de tokenização. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getTypeLabel = (type: TCType): string => {
    const labels = {
      [TCType.TRIBUTARIO_FEDERAL]: 'Tributário Federal',
      [TCType.TRIBUTARIO_ESTADUAL]: 'Tributário Estadual',
      [TCType.TRIBUTARIO_MUNICIPAL]: 'Tributário Municipal',
      [TCType.DUPLICATA_MERCANTIL]: 'Duplicata Mercantil',
      [TCType.DUPLICATA_SERVICO]: 'Duplicata de Serviço',
      [TCType.NOTA_PROMISSORIA]: 'Nota Promissória',
      [TCType.PRECATORIO]: 'Precatório',
      [TCType.HONORARIO_ADVOCATICIO]: 'Honorário Advocatício',
      [TCType.CCR]: 'Cédula de Crédito Rural',
      [TCType.CPR]: 'Cédula de Produto Rural',
      [TCType.CREDITO_CARBONO]: 'Crédito de Carbono',
    };
    return labels[type] || type;
  };

  const getAuctionTypeLabel = (type: AuctionType): string => {
    const labels = {
      [AuctionType.FIXED_PRICE]: 'Preço Fixo',
      [AuctionType.TRADITIONAL]: 'Leilão Tradicional',
      [AuctionType.REVERSE]: 'Leilão Reverso',
      [AuctionType.DUTCH]: 'Leilão Holandês',
    };
    return labels[type] || type;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-blue-600" />
            Tokenizar Título de Crédito
          </CardTitle>
          <CardDescription>
            Transforme seu título de crédito em tokens negociáveis no marketplace
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
              <TabsTrigger value="tokenization">Tokenização</TabsTrigger>
              <TabsTrigger value="documents">Documentos</TabsTrigger>
              <TabsTrigger value="review">Revisão</TabsTrigger>
            </TabsList>

            {/* Dados Básicos */}
            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tipo de Título de Crédito
                  </label>
                  <select
                    value={formData.type}
                    onChange={e => handleInputChange('type', e.target.value as TCType)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Object.values(TCType).map(type => (
                      <option key={type} value={type}>
                        {getTypeLabel(type)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Valor Original *</label>
                  <Input
                    type="number"
                    value={formData.originalValue}
                    onChange={e => handleInputChange('originalValue', Number(e.target.value))}
                    placeholder="0.00"
                    className="text-lg"
                  />
                  {formData.originalValue > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      {formatCurrency(formData.originalValue)}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Título do Crédito *</label>
                  <Input
                    value={formData.title}
                    onChange={e => handleInputChange('title', e.target.value)}
                    placeholder="Ex: Crédito PIS/COFINS - Energia Elétrica"
                    className="text-lg"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Descrição *</label>
                  <textarea
                    value={formData.description}
                    onChange={e => handleInputChange('description', e.target.value)}
                    placeholder="Descreva o título de crédito, origem, garantias, etc."
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Data de Vencimento *</label>
                  <Input
                    type="date"
                    value={formData.maturityDate}
                    onChange={e => handleInputChange('maturityDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Tokenização */}
            <TabsContent value="tokenization" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Quantidade de Tokens *</label>
                  <Input
                    type="number"
                    value={formData.tokenSupply}
                    onChange={e => handleInputChange('tokenSupply', Number(e.target.value))}
                    placeholder="1000"
                  />
                  <p className="text-sm text-gray-600 mt-1">Total de tokens que serão criados</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Investimento Mínimo *</label>
                  <Input
                    type="number"
                    value={formData.minimumInvestment}
                    onChange={e => handleInputChange('minimumInvestment', Number(e.target.value))}
                    placeholder="1000"
                  />
                  {formData.minimumInvestment > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      {formatCurrency(formData.minimumInvestment)}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Modalidade de Negociação</label>
                  <select
                    value={formData.auctionType}
                    onChange={e => handleInputChange('auctionType', e.target.value as AuctionType)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Object.values(AuctionType).map(type => (
                      <option key={type} value={type}>
                        {getAuctionTypeLabel(type)}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.auctionType !== AuctionType.FIXED_PRICE && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Preço Inicial *</label>
                      <Input
                        type="number"
                        value={formData.startingPrice || ''}
                        onChange={e => handleInputChange('startingPrice', Number(e.target.value))}
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Preço de Reserva</label>
                      <Input
                        type="number"
                        value={formData.reservePrice || ''}
                        onChange={e => handleInputChange('reservePrice', Number(e.target.value))}
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Duração do Leilão (horas) *
                      </label>
                      <Input
                        type="number"
                        value={formData.auctionDuration || ''}
                        onChange={e => handleInputChange('auctionDuration', Number(e.target.value))}
                        placeholder="24"
                      />
                    </div>
                  </>
                )}
              </div>

              {formData.originalValue > 0 && formData.tokenSupply > 0 && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Resumo da Tokenização</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700">Valor por Token:</span>
                        <span className="ml-2 font-medium">
                          {formatCurrency(formData.originalValue / formData.tokenSupply)}
                        </span>
                      </div>
                      <div>
                        <span className="text-blue-700">Tokens Mínimos:</span>
                        <span className="ml-2 font-medium">
                          {Math.ceil(
                            formData.minimumInvestment /
                              (formData.originalValue / formData.tokenSupply)
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Documentos */}
            <TabsContent value="documents" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
                  <Info className="w-5 h-5" />
                  <p className="text-sm">
                    Faça upload dos documentos comprobatórios para validação do título de crédito
                  </p>
                </div>

                {formData.documents.map((doc, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{doc.description}</h4>
                        <Badge variant="outline">{doc.type}</Badge>
                      </div>

                      <div className="space-y-3">
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) handleDocumentUpload(index, file);
                          }}
                          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />

                        {doc.file && (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm">{doc.file.name}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Revisão */}
            <TabsContent value="review" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revisão Final</CardTitle>
                  <CardDescription>
                    Confirme todos os dados antes de enviar para tokenização
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Tipo</h4>
                      <p className="text-gray-600">{getTypeLabel(formData.type)}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Valor Original</h4>
                      <p className="text-gray-600">{formatCurrency(formData.originalValue)}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Tokens</h4>
                      <p className="text-gray-600">{formData.tokenSupply.toLocaleString()}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Modalidade</h4>
                      <p className="text-gray-600">{getAuctionTypeLabel(formData.auctionType)}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900">Título</h4>
                    <p className="text-gray-600">{formData.title}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900">Documentos</h4>
                    <div className="space-y-1">
                      {formData.documents
                        .filter(doc => doc.file)
                        .map((doc, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm text-gray-600"
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            {doc.description} - {doc.file?.name}
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Ações */}
          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>

            <div className="flex gap-2">
              {activeTab !== 'basic' && (
                <Button
                  variant="outline"
                  onClick={() => {
                    const tabs = ['basic', 'tokenization', 'documents', 'review'];
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex > 0) {
                      setActiveTab(tabs[currentIndex - 1]);
                    }
                  }}
                >
                  Anterior
                </Button>
              )}

              {activeTab !== 'review' ? (
                <Button
                  onClick={() => {
                    const tabs = ['basic', 'tokenization', 'documents', 'review'];
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex < tabs.length - 1) {
                      setActiveTab(tabs[currentIndex + 1]);
                    }
                  }}
                >
                  Próximo
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Tokenizando...
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-4 h-4 mr-2" />
                      Tokenizar Crédito
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenizationForm;

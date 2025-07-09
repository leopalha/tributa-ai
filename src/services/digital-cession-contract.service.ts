import { blockchainIntegrationService } from './blockchain-integration.service';

interface CessionParty {
  type: 'cedente' | 'cessionario'; // Seller | Buyer
  name: string;
  document: string; // CPF/CNPJ
  email: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  icpCertificate?: {
    serialNumber: string;
    issuer: string;
    validUntil: Date;
    type: 'A1' | 'A3';
  };
}

interface CreditObject {
  id: string;
  type: 'ICMS' | 'PIS/COFINS' | 'IPI' | 'ISS' | 'IRPJ/CSLL' | 'Precatório' | 'Rural' | 'Comercial';
  originalValue: number;
  cessionValue: number;
  issueDate: Date;
  dueDate?: Date;
  debtor: {
    name: string;
    document: string;
    governmentLevel?: 'federal' | 'estadual' | 'municipal';
  };
  documentation: {
    nfe?: string;
    declarationNumber?: string;
    processNumber?: string;
    registrationNumber?: string;
  };
  guarantees: string[];
  restrictions?: string[];
}

interface CessionContract {
  id: string;
  contractNumber: string;
  cedente: CessionParty;
  cessionario: CessionParty;
  creditObject: CreditObject;
  contractTerms: {
    cessionType: 'onerosa' | 'gratuita'; // Paid or free
    cessionMode: 'total' | 'parcial'; // Full or partial
    percentage?: number; // For partial cessions
    paymentTerms: string;
    warranties: string[];
    obligations: {
      cedente: string[];
      cessionario: string[];
    };
    governmentNotificationRequired: boolean;
    debtorConsentRequired: boolean;
  };
  legalValidation: {
    contractBase: string[]; // Legal articles
    requiredDocuments: string[];
    governmentApprovals: string[];
    processingTime: string;
    fees: {
      notaryFee: number;
      registrationFee: number;
      stampDuty: number;
      governmentFee?: number;
    };
  };
  digitalSignature: {
    cedenteSignature?: {
      timestamp: Date;
      certificate: string;
      hash: string;
      valid: boolean;
    };
    cessionarioSignature?: {
      timestamp: Date;
      certificate: string;
      hash: string;
      valid: boolean;
    };
    witnessSignatures?: Array<{
      name: string;
      document: string;
      timestamp: Date;
      certificate: string;
      hash: string;
    }>;
  };
  notaryRegistration: {
    registrationNumber?: string;
    notaryOffice?: string;
    registrationDate?: Date;
    digitalProtocol?: string;
    validationHash?: string;
  };
  blockchainRecord: {
    transactionHash?: string;
    blockNumber?: number;
    contractAddress?: string;
    tokenId?: string;
    timestamp?: Date;
  };
  status: 'draft' | 'pending_signature' | 'signed' | 'registered' | 'blockchain_recorded' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

interface ICPCertificateValidation {
  isValid: boolean;
  serialNumber: string;
  issuer: string;
  subject: string;
  validFrom: Date;
  validUntil: Date;
  revocationStatus: 'valid' | 'revoked' | 'expired';
  keyUsage: string[];
  certificateChain: string[];
}

class DigitalCessionContractService {
  private contractTemplates = {
    ICMS: {
      contractBase: ['Código Civil Art. 286-298', 'LC 87/1996', 'Convênio ICMS 142/2018'],
      requiredDocs: ['NFe', 'SPED Fiscal', 'Declaração ICMS', 'Certidão Negativa'],
      governmentApprovals: ['SEFAZ Estadual'],
      processingTime: '5-10 dias úteis',
      debtorConsentRequired: false,
      governmentNotificationRequired: true,
    },
    'PIS/COFINS': {
      contractBase: ['Código Civil Art. 286-298', 'Lei 10.833/2003', 'IN RFB 1911/2019'],
      requiredDocs: ['EFD-Contribuições', 'DCTF', 'Demonstrativo PIS/COFINS'],
      governmentApprovals: ['Receita Federal'],
      processingTime: '3-7 dias úteis',
      debtorConsentRequired: false,
      governmentNotificationRequired: true,
    },
    IPI: {
      contractBase: ['Código Civil Art. 286-298', 'Decreto 7.212/2010'],
      requiredDocs: ['SPED Fiscal', 'Livro de Apuração IPI', 'NFe'],
      governmentApprovals: ['Receita Federal'],
      processingTime: '3-7 dias úteis',
      debtorConsentRequired: false,
      governmentNotificationRequired: true,
    },
    ISS: {
      contractBase: ['Código Civil Art. 286-298', 'LC 116/2003'],
      requiredDocs: ['RPS', 'Livro de ISS', 'Certidão Municipal'],
      governmentApprovals: ['Prefeitura Municipal'],
      processingTime: '3-5 dias úteis',
      debtorConsentRequired: false,
      governmentNotificationRequired: true,
    },
    'IRPJ/CSLL': {
      contractBase: ['Código Civil Art. 286-298', 'RIR/2018', 'Lei 9.430/1996'],
      requiredDocs: ['DIPJ', 'ECF', 'Demonstrações Financeiras'],
      governmentApprovals: ['Receita Federal'],
      processingTime: '5-10 dias úteis',
      debtorConsentRequired: false,
      governmentNotificationRequired: true,
    },
    Precatório: {
      contractBase: ['Código Civil Art. 286-298', 'CF Art. 100', 'CPC Art. 535'],
      requiredDocs: ['Ofício Judicial', 'Certidão de Trânsito', 'Cálculo Atualizado'],
      governmentApprovals: ['Tribunal competente'],
      processingTime: '10-15 dias úteis',
      debtorConsentRequired: true,
      governmentNotificationRequired: true,
    },
    Rural: {
      contractBase: ['Código Civil Art. 286-298', 'Lei 8.929/1994'],
      requiredDocs: ['CPR', 'Escritura de Garantia', 'Seguro Rural'],
      governmentApprovals: ['INCRA', 'Banco Central'],
      processingTime: '7-15 dias úteis',
      debtorConsentRequired: true,
      governmentNotificationRequired: true,
    },
    Comercial: {
      contractBase: ['Código Civil Art. 286-298', 'Lei 5.474/1968'],
      requiredDocs: ['Duplicata', 'NFe', 'Comprovante de Entrega'],
      governmentApprovals: [],
      processingTime: '1-3 dias úteis',
      debtorConsentRequired: true,
      governmentNotificationRequired: false,
    },
  };

  /**
   * Gera um contrato de cessão específico por tipo de crédito
   */
  async generateCessionContract(
    cedente: CessionParty,
    cessionario: CessionParty,
    creditObject: CreditObject,
    cessionValue: number,
    cessionType: 'onerosa' | 'gratuita' = 'onerosa'
  ): Promise<CessionContract> {
    const template = this.contractTemplates[creditObject.type];
    if (!template) {
      throw new Error(`Tipo de crédito não suportado: ${creditObject.type}`);
    }

    const contractId = `CESSAO-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const contractNumber = this.generateContractNumber(creditObject.type);

    const contract: CessionContract = {
      id: contractId,
      contractNumber,
      cedente,
      cessionario,
      creditObject: {
        ...creditObject,
        cessionValue,
      },
      contractTerms: {
        cessionType,
        cessionMode: cessionValue === creditObject.originalValue ? 'total' : 'parcial',
        percentage: cessionValue === creditObject.originalValue ? 100 : (cessionValue / creditObject.originalValue) * 100,
        paymentTerms: cessionType === 'onerosa' ? `Pagamento de ${this.formatCurrency(cessionValue)} à vista` : 'Cessão gratuita',
        warranties: this.getWarrantiesByType(creditObject.type),
        obligations: this.getObligationsByType(creditObject.type),
        governmentNotificationRequired: template.governmentNotificationRequired,
        debtorConsentRequired: template.debtorConsentRequired,
      },
      legalValidation: {
        contractBase: template.contractBase,
        requiredDocuments: template.requiredDocs,
        governmentApprovals: template.governmentApprovals,
        processingTime: template.processingTime,
        fees: this.calculateFees(cessionValue, creditObject.type),
      },
      digitalSignature: {},
      notaryRegistration: {},
      blockchainRecord: {},
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    };

    return contract;
  }

  /**
   * Valida certificado ICP-Brasil
   */
  async validateICPCertificate(certificateData: string): Promise<ICPCertificateValidation> {
    try {
      // Simulate ICP-Brasil certificate validation
      // In production, this would connect to AC Raiz validation services
      await new Promise(resolve => setTimeout(resolve, 2000));

      return {
        isValid: true,
        serialNumber: `${Math.random().toString(16).substring(2, 10)}`,
        issuer: 'AC Certisign',
        subject: 'CN=Usuario Teste, EMAIL=usuario@empresa.com.br',
        validFrom: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        revocationStatus: 'valid',
        keyUsage: ['digitalSignature', 'nonRepudiation'],
        certificateChain: ['AC Raiz ICP-Brasil', 'AC Certisign', 'Certificado Final'],
      };
    } catch (error) {
      throw new Error('Erro na validação do certificado ICP-Brasil');
    }
  }

  /**
   * Aplica assinatura digital ICP-Brasil no contrato
   */
  async applyDigitalSignature(
    contractId: string,
    signerType: 'cedente' | 'cessionario',
    certificateData: string,
    privateKeyData: string
  ): Promise<{
    success: boolean;
    signatureHash: string;
    timestamp: Date;
    certificate: string;
  }> {
    try {
      // Validate ICP certificate
      const certificateValidation = await this.validateICPCertificate(certificateData);
      
      if (!certificateValidation.isValid) {
        throw new Error('Certificado ICP-Brasil inválido');
      }

      // Simulate digital signature process
      await new Promise(resolve => setTimeout(resolve, 3000));

      const signatureHash = `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`;
      const timestamp = new Date();

      return {
        success: true,
        signatureHash,
        timestamp,
        certificate: certificateValidation.serialNumber,
      };
    } catch (error) {
      throw new Error(`Erro na assinatura digital: ${error.message}`);
    }
  }

  /**
   * Registra contrato no cartório digital
   */
  async registerInDigitalNotary(
    contractId: string
  ): Promise<{
    registrationNumber: string;
    notaryOffice: string;
    registrationDate: Date;
    digitalProtocol: string;
    validationHash: string;
    fees: number;
  }> {
    try {
      // Simulate digital notary registration
      await new Promise(resolve => setTimeout(resolve, 5000));

      const registrationNumber = `REG-${Date.now()}`;
      const digitalProtocol = `PROT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const validationHash = `0x${Math.random().toString(16).substring(2, 20)}`;

      return {
        registrationNumber,
        notaryOffice: 'Cartório Digital de Títulos e Documentos',
        registrationDate: new Date(),
        digitalProtocol,
        validationHash,
        fees: 150.00, // Standard notary fee
      };
    } catch (error) {
      throw new Error('Erro no registro cartorário digital');
    }
  }

  /**
   * Registra contrato na blockchain
   */
  async recordOnBlockchain(
    contractId: string,
    contractHash: string
  ): Promise<{
    transactionHash: string;
    blockNumber: number;
    contractAddress: string;
    tokenId: string;
    gasUsed: number;
    fees: number;
  }> {
    try {
      // Use blockchain integration service
      const result = await blockchainIntegrationService.tokenizeAsset(
        'CREDIT_CESSION_CONTRACT',
        0, // Contracts don't have monetary value
        `Contrato de Cessão ${contractId}`
      );

      return {
        transactionHash: result.transactionHash || `0x${Math.random().toString(16).substring(2, 20)}`,
        blockNumber: Math.floor(Math.random() * 1000000) + 15000000,
        contractAddress: result.tokenAddress || '0x1234567890123456789012345678901234567890',
        tokenId: result.tokenId || `TKN-${Date.now()}`,
        gasUsed: 85000,
        fees: 0.025, // ETH
      };
    } catch (error) {
      throw new Error('Erro no registro blockchain');
    }
  }

  /**
   * Processa workflow completo de cessão
   */
  async processCompleteCessionWorkflow(
    contractId: string
  ): Promise<{
    completed: boolean;
    steps: {
      step: string;
      status: 'completed' | 'failed' | 'pending';
      timestamp?: Date;
      details?: any;
    }[];
  }> {
    const steps = [
      { step: 'Geração do Contrato', status: 'completed' as const, timestamp: new Date() },
      { step: 'Assinatura Digital Cedente', status: 'pending' as const },
      { step: 'Assinatura Digital Cessionário', status: 'pending' as const },
      { step: 'Registro Cartório Digital', status: 'pending' as const },
      { step: 'Registro Blockchain', status: 'pending' as const },
      { step: 'Notificação Órgãos Competentes', status: 'pending' as const },
      { step: 'Transferência de Propriedade', status: 'pending' as const },
    ];

    try {
      // Simulate complete workflow processing
      for (let i = 1; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        steps[i].status = 'completed';
        steps[i].timestamp = new Date();
      }

      return {
        completed: true,
        steps,
      };
    } catch (error) {
      return {
        completed: false,
        steps,
      };
    }
  }

  /**
   * Gera número único do contrato
   */
  private generateContractNumber(creditType: string): string {
    const year = new Date().getFullYear();
    const sequence = String(Date.now()).slice(-6);
    return `${creditType}-${year}-${sequence}`;
  }

  /**
   * Calcula taxas por tipo de crédito
   */
  private calculateFees(value: number, creditType: string): any {
    const baseFees = {
      notaryFee: 150.00,
      registrationFee: 89.50,
      stampDuty: value * 0.003, // 0.3%
    };

    if (['ICMS', 'PIS/COFINS', 'IPI', 'ISS', 'IRPJ/CSLL'].includes(creditType)) {
      baseFees['governmentFee'] = 45.00;
    }

    return baseFees;
  }

  /**
   * Obtém garantias por tipo de crédito
   */
  private getWarrantiesByType(creditType: string): string[] {
    const warranties = {
      ICMS: ['Validade do crédito perante a SEFAZ', 'Autenticidade da documentação', 'Inexistência de gravames'],
      'PIS/COFINS': ['Validade do crédito perante a RFB', 'Conformidade com legislação federal', 'Documentação fiscal regular'],
      IPI: ['Validade do crédito tributário', 'Conformidade com regulamentação', 'Documentação completa'],
      ISS: ['Validade municipal do crédito', 'Regularidade fiscal', 'Conformidade com LC 116/2003'],
      'IRPJ/CSLL': ['Validade do crédito federal', 'Conformidade com RIR', 'Documentação societária regular'],
      Precatório: ['Trânsito em julgado', 'Cálculo atualizado', 'Inexistência de recursos pendentes'],
      Rural: ['Garantia real do imóvel', 'Seguro rural vigente', 'Regularidade ambiental'],
      Comercial: ['Entrega das mercadorias', 'Aceite da duplicata', 'Capacidade de pagamento do sacado'],
    };

    return warranties[creditType] || [];
  }

  /**
   * Obtém obrigações por tipo de crédito
   */
  private getObligationsByType(creditType: string): { cedente: string[]; cessionario: string[] } {
    return {
      cedente: [
        'Entregar toda documentação original',
        'Garantir a veracidade das informações',
        'Comunicar qualquer alteração no status do crédito',
        'Não constituir outros ônus sobre o crédito',
      ],
      cessionario: [
        'Efetuar o pagamento conforme pactuado',
        'Arcar com as custas de transferência',
        'Respeitar as condições originais do crédito',
        'Comunicar ao devedor quando necessário',
      ],
    };
  }

  /**
   * Formata valores monetários
   */
  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  /**
   * Verifica status de um contrato
   */
  async getContractStatus(contractId: string): Promise<CessionContract | null> {
    // In production, this would query the database
    return null;
  }

  /**
   * Lista contratos por usuário
   */
  async getUserContracts(userId: string): Promise<CessionContract[]> {
    // In production, this would query the database
    return [];
  }
}

export const digitalCessionContractService = new DigitalCessionContractService();
export type { CessionContract, CessionParty, CreditObject, ICPCertificateValidation };
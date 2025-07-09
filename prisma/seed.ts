import { PrismaClient, UserRole, CreditCategory, CreditStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Dados realistas baseados no mercado brasileiro
const EMPRESAS_FICTICIAS = [
  {
    razaoSocial: 'Indústria Metalúrgica São Paulo S.A.',
    nomeFantasia: 'MetalSP',
    cnpj: '12345678000190',
    inscEstadual: '123456789012',
    endereco: 'Av. Industrial, 1000 - São Paulo/SP',
    telefone: '(11) 3456-7890',
    email: 'contato@metalsp.com.br',
    status: 'ACTIVE'
  },
  {
    razaoSocial: 'Comércio Varejista Rio Ltda',
    nomeFantasia: 'VarejoRio',
    cnpj: '98765432000121',
    inscEstadual: '987654321098',
    endereco: 'Rua do Comércio, 500 - Rio de Janeiro/RJ',
    telefone: '(21) 2345-6789',
    email: 'contato@varejorio.com.br',
    status: 'ACTIVE'
  },
  {
    razaoSocial: 'Agrícola Centro-Oeste EIRELI',
    nomeFantasia: 'AgroCentro',
    cnpj: '11222333000145',
    inscEstadual: '112223334445',
    endereco: 'Rod. BR-163, KM 450 - Sorriso/MT',
    telefone: '(65) 3544-1234',
    email: 'contato@agrocentro.com.br',
    status: 'ACTIVE'
  },
  {
    razaoSocial: 'Construtora Nordeste S.A.',
    nomeFantasia: 'ConstruNE',
    cnpj: '44555666000178',
    inscEstadual: '445556667778',
    endereco: 'Av. Beira Mar, 2000 - Salvador/BA',
    telefone: '(71) 3322-1100',
    email: 'contato@construne.com.br',
    status: 'ACTIVE'
  },
  {
    razaoSocial: 'Tecnologia e Inovação Sul Ltda',
    nomeFantasia: 'TechSul',
    cnpj: '77888999000112',
    inscEstadual: '778889991112',
    endereco: 'Parque Tecnológico, 300 - Porto Alegre/RS',
    telefone: '(51) 3333-4444',
    email: 'contato@techsul.com.br',
    status: 'ACTIVE'
  }
];

// Função para gerar valores realistas de créditos
function gerarValorCredito(categoria: string): number {
  const ranges = {
    TRIBUTARIO: { min: 50000, max: 5000000 },
    JUDICIAL: { min: 100000, max: 10000000 },
    COMERCIAL: { min: 10000, max: 500000 },
    FINANCEIRO: { min: 100000, max: 2000000 },
    RURAL: { min: 50000, max: 1000000 },
    IMOBILIARIO: { min: 200000, max: 5000000 },
    AMBIENTAL: { min: 30000, max: 300000 },
    ESPECIAL: { min: 20000, max: 1000000 }
  };
  
  const range = ranges[categoria as keyof typeof ranges] || { min: 10000, max: 100000 };
  return Math.floor(Math.random() * (range.max - range.min) + range.min);
}

// Função para gerar datas realistas
function gerarDataVencimento(): Date {
  const mesesFuturos = Math.floor(Math.random() * 24) + 1; // 1 a 24 meses
  const data = new Date();
  data.setMonth(data.getMonth() + mesesFuturos);
  return data;
}

// Função para gerar datas passadas
function gerarDataEmissao(): Date {
  const mesesPassados = Math.floor(Math.random() * 12) + 1; // 1 a 12 meses atrás
  const data = new Date();
  data.setMonth(data.getMonth() - mesesPassados);
  return data;
}

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  console.log('🧹 Limpando dados existentes...');
  await prisma.$transaction([
    prisma.transaction.deleteMany(),
    prisma.bid.deleteMany(),
    prisma.offer.deleteMany(),
    prisma.document.deleteMany(),
    prisma.creditTitle.deleteMany(),
    prisma.empresa.deleteMany(),
    prisma.account.deleteMany(),
    prisma.session.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // Criar usuários
  console.log('👤 Criando usuários...');
  const senhaHash = await bcrypt.hash('123456', 10);
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@tributa.ai',
      name: 'Administrador',
      password: senhaHash,
      role: 'ADMIN',
      emailVerified: new Date()
    }
  });

  const usuario1 = await prisma.user.create({
    data: {
      email: 'empresa1@teste.com',
      name: 'João Silva',
      password: senhaHash,
      role: 'EMPRESA',
      emailVerified: new Date()
    }
  });

  const usuario2 = await prisma.user.create({
    data: {
      email: 'empresa2@teste.com',
      name: 'Maria Santos',
      password: senhaHash,
      role: 'EMPRESA',
      emailVerified: new Date()
    }
  });

  // Criar empresas
  console.log('🏢 Criando empresas...');
  const empresa1 = await prisma.empresa.create({
    data: {
      razaoSocial: 'Indústria Metalúrgica São Paulo S.A.',
      nomeFantasia: 'MetalSP',
      cnpj: '12345678000190',
      inscEstadual: '123456789012',
      endereco: 'Av. Industrial, 1000 - São Paulo/SP',
      telefone: '(11) 3456-7890',
      email: 'contato@metalsp.com.br',
      status: 'ACTIVE',
      representantePrincipalId: usuario1.id
    }
  });

  const empresa2 = await prisma.empresa.create({
    data: {
      razaoSocial: 'Comércio Varejista Rio Ltda',
      nomeFantasia: 'VarejoRio',
      cnpj: '98765432000121',
      inscEstadual: '987654321098',
      endereco: 'Rua do Comércio, 500 - Rio de Janeiro/RJ',
      telefone: '(21) 2345-6789',
      email: 'contato@varejorio.com.br',
      status: 'ACTIVE',
      representantePrincipalId: usuario2.id
    }
  });

  // Criar créditos tributários com dados realistas
  console.log('💰 Criando créditos tributários...');
  
  // Array para armazenar créditos criados
  const creditosCriados = [];
  
  // ICMS - São Paulo
  const credito1 = await prisma.creditTitle.create({
    data: {
      category: 'TRIBUTARIO',
      valueNominal: 1250000,
      valueCurrent: 1187500, // 95% do valor nominal
      issueDate: new Date('2023-01-15'),
      expiryDate: new Date('2024-12-31'),
      issuerId: usuario1.id,
      ownerId: usuario1.id,
      status: 'TOKENIZED',
      isListed: true,
      listingPrice: 1062500, // 85% do valor nominal (15% desconto)
      tokenId: 'TOKEN-ICMS-SP-001',
      tokenStandard: 'ERC-1155',
      blockchainTxHash: '0x1234567890abcdef1234567890abcdef12345678'
    }
  });
  creditosCriados.push(credito1);

  // Precatório Federal
  const credito2 = await prisma.creditTitle.create({
    data: {
      category: 'JUDICIAL',
      valueNominal: 4500000,
      valueCurrent: 4050000, // 90% do valor nominal
      issueDate: new Date('2022-06-20'),
      expiryDate: new Date('2025-06-30'),
      issuerId: usuario2.id,
      ownerId: usuario2.id,
      status: 'VALIDATED',
      isListed: true,
      listingPrice: 3825000 // 85% do valor nominal
    }
  });
  creditosCriados.push(credito2);

  // PIS/COFINS
  const credito3 = await prisma.creditTitle.create({
    data: {
      category: 'TRIBUTARIO',
      valueNominal: 750000,
      valueCurrent: 712500,
      issueDate: new Date('2023-03-10'),
      expiryDate: new Date('2024-09-30'),
      issuerId: usuario1.id,
      ownerId: usuario1.id,
      status: 'LISTED_FOR_SALE',
      isListed: true,
      listingPrice: 675000 // 90% do valor nominal
    }
  });
  creditosCriados.push(credito3);

  // Duplicata Comercial
  const credito4 = await prisma.creditTitle.create({
    data: {
      category: 'COMERCIAL',
      valueNominal: 185000,
      valueCurrent: 175750,
      issueDate: new Date('2023-11-05'),
      expiryDate: new Date('2024-05-05'),
      issuerId: usuario2.id,
      ownerId: usuario2.id,
      status: 'TOKENIZED',
      isListed: true,
      listingPrice: 166500,
      tokenId: 'TOKEN-DUPL-001',
      tokenStandard: 'ERC-1155',
      blockchainTxHash: '0xabcdef1234567890abcdef1234567890abcdef12'
    }
  });
  creditosCriados.push(credito4);

  // Crédito de Carbono
  const credito5 = await prisma.creditTitle.create({
    data: {
      category: 'AMBIENTAL',
      valueNominal: 180000,
      valueCurrent: 171000,
      issueDate: new Date('2023-08-15'),
      expiryDate: new Date('2025-08-15'),
      issuerId: usuario1.id,
      ownerId: usuario1.id,
      status: 'TOKENIZED',
      isListed: false,
      tokenId: 'TOKEN-CARBON-001',
      tokenStandard: 'ERC-1155',
      blockchainTxHash: '0xdef1234567890abcdef1234567890abcdef123456'
    }
  });
  creditosCriados.push(credito5);

  // Criar ofertas
  console.log('🛒 Criando ofertas no marketplace...');
  const ofertasCriadas = [];
  
  // Oferta para ICMS
  const oferta1 = await prisma.offer.create({
    data: {
      creditTitleId: credito1.id,
      sellerId: usuario1.id,
      price: 1062500,
      expiryDate: new Date('2024-04-30'),
      terms: 'Pagamento à vista via PIX. Transferência imediata após confirmação do pagamento.',
      quantityAvailable: 1,
      offerType: 'DIRECT',
      status: 'ACTIVE'
    }
  });
  ofertasCriadas.push(oferta1);

  // Oferta para Precatório
  const oferta2 = await prisma.offer.create({
    data: {
      creditTitleId: credito2.id,
      sellerId: usuario2.id,
      price: 3825000,
      expiryDate: new Date('2024-05-15'),
      terms: 'Aceito propostas. Negociação flexível para pagamento parcelado.',
      quantityAvailable: 1,
      offerType: 'NEGOTIABLE',
      status: 'ACTIVE'
    }
  });
  ofertasCriadas.push(oferta2);

  // Oferta para PIS/COFINS
  const oferta3 = await prisma.offer.create({
    data: {
      creditTitleId: credito3.id,
      sellerId: usuario1.id,
      price: 675000,
      expiryDate: new Date('2024-03-31'),
      terms: 'Venda direta com desconto especial. Documentação completa disponível.',
      quantityAvailable: 1,
      offerType: 'DIRECT',
      minBidIncrement: 5000,
      status: 'ACTIVE'
    }
  });
  ofertasCriadas.push(oferta3);

  // Oferta para Duplicata
  const oferta4 = await prisma.offer.create({
    data: {
      creditTitleId: credito4.id,
      sellerId: usuario2.id,
      price: 166500,
      expiryDate: new Date('2024-04-15'),
      terms: 'Duplicata com garantia. Sacado de primeira linha.',
      quantityAvailable: 1,
      offerType: 'AUCTION',
      minBidIncrement: 1000,
      reservePrice: 160000,
      status: 'ACTIVE'
    }
  });
  ofertasCriadas.push(oferta4);

  // Criar algumas propostas (bids)
  console.log('💬 Criando propostas de negociação...');
  
  // Criar um investidor
  const investidor = await prisma.user.create({
    data: {
      email: 'investidor@tributa.ai',
      name: 'Paulo Investidor',
      password: senhaHash,
      role: 'INVESTIDOR_QUALIFICADO',
      emailVerified: new Date()
    }
  });

  // Proposta para o Precatório
  await prisma.bid.create({
    data: {
      offerId: oferta2.id,
      bidderId: investidor.id,
      amount: 3600000, // ~94% do valor da oferta
      status: 'PENDING'
    }
  });

  // Proposta para PIS/COFINS
  await prisma.bid.create({
    data: {
      offerId: oferta3.id,
      bidderId: investidor.id,
      amount: 650000, // ~96% do valor da oferta
      status: 'PENDING'
    }
  });

  // Criar documentos anexados
  console.log('📄 Criando documentos...');
  
  // Documentos para ICMS
  await prisma.document.create({
    data: {
      name: 'Certidao_Regularidade_ICMS_SP.pdf',
      type: 'LEGAL',
      description: 'Certidão de regularidade fiscal emitida pela SEFAZ-SP',
      isPublic: false,
      mimeType: 'application/pdf',
      size: 245789,
      storageLocation: '/storage/documents/icms/certidao.pdf',
      hash: 'a1b2c3d4e5f6789012345678901234567890abcd',
      creditTitleId: credito1.id,
      uploadedById: usuario1.id
    }
  });

  // Documentos para Precatório
  await prisma.document.create({
    data: {
      name: 'Sentenca_Transitada_Julgado.pdf',
      type: 'LEGAL',
      description: 'Sentença judicial transitada em julgado',
      isPublic: true,
      mimeType: 'application/pdf',
      size: 1567890,
      storageLocation: '/storage/documents/precatorio/sentenca.pdf',
      hash: 'b2c3d4e5f67890123456789012345678901abcde',
      creditTitleId: credito2.id,
      uploadedById: usuario2.id
    }
  });

  // Criar transações de exemplo
  console.log('💸 Criando transações...');
  
  // Transação de venda
  await prisma.transaction.create({
    data: {
      creditTitleId: credito4.id,
      sellerId: usuario2.id,
      buyerId: investidor.id,
      price: 165000,
      quantity: 1,
      type: 'MARKETPLACE',
      status: 'COMPLETED',
      notes: 'Venda realizada através do marketplace com sucesso',
      blockchainData: JSON.stringify({
        txHash: credito4.blockchainTxHash,
        blockNumber: 123456,
        timestamp: new Date('2023-12-15').toISOString()
      })
    }
  });

  console.log('✅ Seed concluído com sucesso!');
  console.log(`📊 Resumo:`);
  console.log(`   - ${4} usuários criados`);
  console.log(`   - ${2} empresas criadas`);
  console.log(`   - ${creditosCriados.length} créditos criados`);
  console.log(`   - ${ofertasCriadas.length} ofertas ativas`);
  console.log(`   - 2 propostas criadas`);
  console.log(`   - 2 documentos anexados`);
  console.log(`   - 1 transação registrada`);
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
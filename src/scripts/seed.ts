import { db } from '@/lib/db';
import { hash } from 'bcrypt';
import { UserRole, CreditCategory, CreditStatus, TipoNegociacao } from '@/types/prisma';

async function main() {
  // ---> INÍCIO DA VERIFICAÇÃO
  console.log('Verificando DATABASE_URL no ambiente do script:');
  console.log(`DATABASE_URL = ${process.env.DATABASE_URL}`);
  if (!process.env.DATABASE_URL) {
    console.error('❌ ERRO FATAL: DATABASE_URL não está definida no ambiente do script!');
    process.exit(1);
  }
  // ---> FIM DA VERIFICAÇÃO

  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes (opcional, use com cuidado)
  // await db.transacao.deleteMany();
  // await db.proposta.deleteMany();
  // await db.anuncio.deleteMany();
  // await db.creditTitle.deleteMany();
  // await db.empresa.deleteMany();
  // await db.user.deleteMany();

  console.log('👤 Criando usuários...');

  // Criar usuários de teste
  const adminPassword = await hash('admin123', 10);
  const userPassword = await hash('user123', 10);
  const empresaPassword = await hash('empresa123', 10);
  const investidorPassword = await hash('investidor123', 10);

  const admin = await db.user.upsert({
    where: { email: 'admin@tributa.ai' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@tributa.ai',
      password: adminPassword,
      role: UserRole.ADMIN,
      emailVerified: new Date(),
    },
  });

  const user = await db.user.upsert({
    where: { email: 'usuario@tributa.ai' },
    update: {},
    create: {
      name: 'Usuário Comum',
      email: 'usuario@tributa.ai',
      password: userPassword,
      role: UserRole.USER,
      emailVerified: new Date(),
    },
  });

  const empresaUser = await db.user.upsert({
    where: { email: 'empresa@tributa.ai' },
    update: {},
    create: {
      name: 'Representante Empresa',
      email: 'empresa@tributa.ai',
      password: empresaPassword,
      role: UserRole.EMPRESA,
      emailVerified: new Date(),
    },
  });

  const investidor = await db.user.upsert({
    where: { email: 'investidor@tributa.ai' },
    update: {},
    create: {
      name: 'Investidor Qualificado',
      email: 'investidor@tributa.ai',
      password: investidorPassword,
      role: UserRole.INVESTIDOR_QUALIFICADO,
      emailVerified: new Date(),
    },
  });

  console.log(`✅ Criados ${4} usuários`);

  console.log('🏢 Criando empresa...');

  // Criar empresa para o usuário empresa
  const empresa = await db.empresa.upsert({
    where: { cnpj: '12345678901234' },
    update: {},
    create: {
      razaoSocial: 'Empresa Exemplo Ltda',
      nomeFantasia: 'Exemplo Corp',
      cnpj: '12345678901234',
      inscEstadual: '123456789',
      endereco: {
        logradouro: 'Rua Exemplo',
        numero: '123',
        complemento: 'Sala 456',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01001-000',
      },
      telefone: '11987654321',
      email: 'contato@exemplo.com',
      representantePrincipal: {
        connect: { id: empresaUser.id },
      },
    },
  });

  console.log(`✅ Criada empresa ${empresa.razaoSocial}`);

  console.log('💰 Criando títulos de crédito...');

  // Criar títulos de crédito
  const creditTitle1 = await db.creditTitle.create({
    data: {
      title: 'Precatório Federal 2023',
      description: 'Precatório federal relacionado a processo tributário',
      category: CreditCategory.TRIBUTARIO,
      subtype: 'PRECATORIO',
      status: CreditStatus.VALIDATED,
      value: 250000.0,
      dueDate: new Date('2024-12-31'),
      issueDate: new Date('2023-03-15'),
      issuerName: 'União Federal',
      debtorName: 'Receita Federal',
      registrationNumber: 'PREC123456789',
      underlyingDocuments: [
        { type: 'sentenca', url: 'https://exemplo.com/doc1.pdf' },
        { type: 'certidao', url: 'https://exemplo.com/doc2.pdf' },
      ],
      validationHistory: [{ date: new Date('2023-04-01'), status: 'VALIDADO', by: 'Sistema' }],
      owner: {
        connect: { id: empresaUser.id },
      },
      ownerCompany: {
        connect: { id: empresa.id },
      },
    },
  });

  const creditTitle2 = await db.creditTitle.create({
    data: {
      title: 'Crédito de ICMS',
      description: 'Crédito tributário de ICMS acumulado',
      category: CreditCategory.TRIBUTARIO,
      subtype: 'ICMS',
      status: CreditStatus.VALIDATED,
      value: 120000.0,
      issueDate: new Date('2023-06-10'),
      issuerName: 'Estado de São Paulo',
      debtorName: 'Secretaria da Fazenda SP',
      registrationNumber: 'ICMS9876543210',
      underlyingDocuments: [{ type: 'processo', url: 'https://exemplo.com/icms1.pdf' }],
      validationHistory: [{ date: new Date('2023-07-01'), status: 'VALIDADO', by: 'Sistema' }],
      owner: {
        connect: { id: user.id },
      },
    },
  });

  const creditTitle3 = await db.creditTitle.create({
    data: {
      title: 'Precatório Municipal',
      description: 'Precatório municipal da cidade de São Paulo',
      category: CreditCategory.JUDICIAL,
      subtype: 'PRECATORIO',
      status: CreditStatus.VALIDATED,
      value: 350000.0,
      dueDate: new Date('2025-06-30'),
      issueDate: new Date('2022-11-10'),
      issuerName: 'Município de São Paulo',
      debtorName: 'Prefeitura de São Paulo',
      registrationNumber: 'PRECMUNI7890123',
      underlyingDocuments: [{ type: 'sentenca', url: 'https://exemplo.com/muni1.pdf' }],
      validationHistory: [{ date: new Date('2023-01-15'), status: 'VALIDADO', by: 'Sistema' }],
      owner: {
        connect: { id: investidor.id },
      },
    },
  });

  console.log(`✅ Criados ${3} títulos de crédito`);

  console.log('📢 Criando anúncios...');

  // Criar anúncios
  const anuncio1 = await db.anuncio.create({
    data: {
      description: 'Venda de precatório federal com excelente desconto',
      askingPrice: 225000.0, // 10% de desconto sobre o valor original
      minimumBid: 200000.0,
      buyNowPrice: 230000.0,
      type: TipoNegociacao.NEGOCIACAO_DIRETA,
      status: 'ACTIVE',
      publishedAt: new Date(),
      expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      viewCount: 0,
      creditTitle: {
        connect: { id: creditTitle1.id },
      },
      seller: {
        connect: { id: empresaUser.id },
      },
    },
  });

  const anuncio2 = await db.anuncio.create({
    data: {
      description: 'Crédito de ICMS com documentação completa',
      askingPrice: 100000.0, // Desconto maior para liquidez
      minimumBid: 90000.0,
      buyNowPrice: 110000.0,
      type: TipoNegociacao.VENDA_DIRETA,
      status: 'ACTIVE',
      publishedAt: new Date(),
      expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 2)),
      viewCount: 0,
      creditTitle: {
        connect: { id: creditTitle2.id },
      },
      seller: {
        connect: { id: user.id },
      },
    },
  });

  const anuncio3 = await db.anuncio.create({
    data: {
      description: 'Precatório municipal para investidores qualificados',
      askingPrice: 290000.0,
      minimumBid: 250000.0,
      buyNowPrice: 300000.0,
      type: TipoNegociacao.LEILAO,
      status: 'ACTIVE',
      publishedAt: new Date(),
      expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      viewCount: 0,
      creditTitle: {
        connect: { id: creditTitle3.id },
      },
      seller: {
        connect: { id: investidor.id },
      },
    },
  });

  console.log(`✅ Criados ${3} anúncios`);

  console.log('💼 Criando propostas...');

  // Criar propostas
  const proposta1 = await db.proposta.create({
    data: {
      offerValue: 210000.0,
      message: 'Oferta para aquisição do precatório federal',
      status: 'PENDING',
      expiresAt: new Date(new Date().setDate(new Date().getDate() + 7)),
      anuncio: {
        connect: { id: anuncio1.id },
      },
      buyer: {
        connect: { id: investidor.id },
      },
    },
  });

  const proposta2 = await db.proposta.create({
    data: {
      offerValue: 95000.0,
      message: 'Proposta para o crédito de ICMS com pagamento imediato',
      status: 'PENDING',
      expiresAt: new Date(new Date().setDate(new Date().getDate() + 5)),
      anuncio: {
        connect: { id: anuncio2.id },
      },
      buyer: {
        connect: { id: empresaUser.id },
      },
    },
  });

  console.log(`✅ Criadas ${2} propostas`);

  console.log('✅ Seed concluído com sucesso!');
}

main()
  .catch(e => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Configuração do Prisma com logs em desenvolvimento
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url:
          process.env.DATABASE_URL ||
          'postgresql://postgres:postgres@localhost:5432/tributa_ai?schema=public',
      },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Função para testar a conexão
export async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('[Prisma] Database connected successfully');
    return true;
  } catch (error) {
    console.error('[Prisma] Failed to connect to database:', error);
    return false;
  }
}

// Desconectar quando o processo terminar
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

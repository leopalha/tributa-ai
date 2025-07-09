import { PrismaClient } from '@prisma/client';

// Inicializa o cliente Prisma (singleton)
const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Define o tipo global para o PrismaClient
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// Define o escopo global para o cliente
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// Exporta o cliente Prisma (cria ou reutiliza instância existente)
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// Em ambiente de desenvolvimento, não precisamos de múltiplas conexões
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
} 
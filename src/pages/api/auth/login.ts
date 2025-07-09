import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'tributa-ai-secret-key-change-in-production';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email e senha são obrigatórios',
      });
    }

    // Buscar usuário no banco
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        empresasRepresentadas: {
          select: {
            id: true,
            razaoSocial: true,
            nomeFantasia: true,
            cnpj: true,
            status: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
      });
    }

    // Verificar senha (em produção, usar hash real)
    // Para demo, aceitar senhas simples
    const isValidPassword =
      password === 'demo123' ||
      password === 'admin123' ||
      (user.password && (await bcrypt.compare(password, user.password)));

    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
      });
    }

    // Gerar JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Dados do usuário para retorno
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      empresas: user.empresasRepresentadas,
    };

    // Set cookie
    res.setHeader(
      'Set-Cookie',
      `tributa-ai-token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax`
    );

    return res.status(200).json({
      success: true,
      data: {
        user: userData,
        token,
        message: 'Login realizado com sucesso',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
    });
  }
}

// Função auxiliar para middleware de autenticação
export function authenticateToken(req: NextApiRequest, res: NextApiResponse, next: Function) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }

    (req as any).user = user;
    next();
  });
}

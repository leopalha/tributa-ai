import nodemailer from 'nodemailer';

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

// Configuração do transporter (usando variáveis de ambiente)
// Substitua pelos seus dados reais de SMTP ou provedor (SendGrid, Mailgun, etc.)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587', 10),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  secure: process.env.EMAIL_SERVER_SECURE === 'true', // true para porta 465, false para outras
});

// Função base para enviar emails
async function sendEmail({ to, subject, html }: MailOptions) {
  const mailOptions = {
    from: process.env.EMAIL_FROM, // Ex: 'Tribut.AI <noreply@tribut.ai>'
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    // Lançar o erro para ser tratado por quem chamou a função
    throw new Error('Failed to send email.');
  }
}

// Função específica para enviar email de verificação
export async function sendVerificationEmail(to: string, token: string) {
  const verificationLink = `${import.meta.env.VITE_BASE_URL}/verificar-email?token=${token}`;

  // Verificar se a URL base está definida
  if (!import.meta.env.VITE_BASE_URL) {
    console.error('NEXT_PUBLIC_BASE_URL não está definida no ambiente.');
    throw new Error('Configuration error: Base URL not set.');
  }

  const subject = 'Verifique seu endereço de e-mail - Tribut.AI';
  const html = `
    <div style="font-family: sans-serif; line-height: 1.6;">
      <h2>Bem-vindo à Tribut.AI!</h2>
      <p>Obrigado por se registrar. Por favor, clique no link abaixo para verificar seu endereço de e-mail e ativar sua conta:</p>
      <p>
        <a 
          href="${verificationLink}" 
          target="_blank" 
          style="display: inline-block; padding: 10px 20px; background-color: #0284c7; color: white; text-decoration: none; border-radius: 5px;"
        >
          Verificar E-mail
        </a>
      </p>
      <p>Se você não se registrou na Tribut.AI, por favor ignore este e-mail.</p>
      <p>Este link expirará em 24 horas.</p>
      <br>
      <p>Atenciosamente,</p>
      <p>Equipe Tribut.AI</p>
    </div>
  `;

  await sendEmail({ to, subject, html });
}

// Função específica para enviar email de redefinição de senha
export async function sendPasswordResetEmail(to: string, token: string) {
  const resetLink = `${import.meta.env.VITE_BASE_URL}/resetar-senha?token=${token}`;

  if (!import.meta.env.VITE_BASE_URL) {
    console.error('NEXT_PUBLIC_BASE_URL não está definida no ambiente.');
    throw new Error('Configuration error: Base URL not set.');
  }

  const subject = 'Redefinição de Senha - Tribut.AI';
  const html = `
    <div style="font-family: sans-serif; line-height: 1.6;">
      <h2>Redefinição de Senha</h2>
      <p>Você solicitou a redefinição da sua senha na Tribut.AI. Clique no link abaixo para criar uma nova senha:</p>
      <p>
        <a 
          href="${resetLink}" 
          target="_blank" 
          style="display: inline-block; padding: 10px 20px; background-color: #0284c7; color: white; text-decoration: none; border-radius: 5px;"
        >
          Redefinir Senha
        </a>
      </p>
      <p>Se você não solicitou esta redefinição, por favor ignore este e-mail.</p>
      <p>Este link expirará em 1 hora.</p>
      <br>
      <p>Atenciosamente,</p>
      <p>Equipe Tribut.AI</p>
    </div>
  `;

  await sendEmail({ to, subject, html });
}

// TODO: Adicionar outras funções de envio de email conforme necessário (ex: redefinição de senha)

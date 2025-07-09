import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CPF, CNPJ } from '@julioakira/cpf-cnpj-utils';

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format currency value to BRL
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Format percentage value
 */
export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

/**
 * Format date to Brazilian format
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR');
}

/**
 * Format CNPJ
 */
export function formatCNPJ(cnpj: string): string {
  if (!cnpj) return '';

  // Remove non-numeric characters
  const numericCNPJ = cnpj.replace(/\D/g, '');

  // Format as XX.XXX.XXX/XXXX-XX
  return numericCNPJ.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

/**
 * Format CPF
 */
export function formatCPF(cpf: string): string {
  if (!cpf) return '';

  // Remove non-numeric characters
  const numericCPF = cpf.replace(/\D/g, '');

  // Format as XXX.XXX.XXX-XX
  return numericCPF.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}

/**
 * Format phone number
 */
export function formatPhone(phone: string): string {
  if (!phone) return '';

  // Remove non-numeric characters
  const numericPhone = phone.replace(/\D/g, '');

  // Format cell phone (XX) XXXXX-XXXX or landline (XX) XXXX-XXXX
  if (numericPhone.length === 11) {
    return numericPhone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  }

  return numericPhone.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
}

export function formatDateTime(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'dd/MM/yyyy HH:mm', { locale: ptBR });
}

export function formatRelativeDate(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: ptBR });
}

export function formatCEP(cep: string) {
  return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

export function truncate(text: string, length: number) {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

export function getInitials(name: string): string {
  if (!name) return '';
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function validateCPF(value: string): boolean {
  if (!value) return false;
  return CPF.Validate(value);
}

export function validateCNPJ(value: string): boolean {
  if (!value) return false;
  return CNPJ.Validate(value);
}

export function validateEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone: string) {
  const re = /^\(\d{2}\) \d{4,5}-\d{4}$/;
  return re.test(phone);
}

export function validateCEP(cep: string) {
  const re = /^\d{5}-\d{3}$/;
  return re.test(cep);
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

export function handleApiError(error: any, fallbackData: any = null): { error: string; data: any } {
  console.error('API Error:', error);
  const errorMessage =
    error instanceof Error ? error.message : 'Erro interno ao processar a requisição';

  return {
    error: errorMessage,
    data: fallbackData,
  };
}

export function safeParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return fallback;
  }
}

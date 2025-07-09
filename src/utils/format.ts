/**
 * Utilitários de formatação para o sistema Tributa.AI
 */

/**
 * Formata um valor numérico para moeda brasileira (BRL)
 * @param value Valor a ser formatado
 * @param currency Moeda (padrão: BRL)
 * @returns String formatada como moeda
 */
export function formatCurrency(value: number, currency: string = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formata um número com separadores de milhares
 * @param value Valor a ser formatado
 * @returns String formatada com separadores de milhares
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

/**
 * Formata uma data para o formato brasileiro (DD/MM/YYYY)
 * @param date Data a ser formatada
 * @returns String formatada como data
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR');
}

/**
 * Formata uma data e hora para o formato brasileiro (DD/MM/YYYY HH:MM)
 * @param date Data a ser formatada
 * @returns String formatada como data e hora
 */
export function formatDateTime(date: Date): string {
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formata um valor percentual
 * @param value Valor a ser formatado (ex: 0.25 para 25%)
 * @param decimals Número de casas decimais
 * @returns String formatada como percentual
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Calcula e formata o valor com a taxa aplicada
 * @param value Valor base
 * @param taxRate Taxa em percentual (ex: 2.5 para 2.5%)
 * @returns String formatada como moeda
 */
export function calculateAndFormatTax(value: number, taxRate: number): string {
  const taxValue = value * (taxRate / 100);
  return formatCurrency(taxValue);
}

/**
 * Calcula o valor com desconto
 * @param value Valor original
 * @param discountPercent Percentual de desconto
 * @returns Valor com desconto aplicado
 */
export function calculateDiscountedValue(value: number, discountPercent: number): number {
  return value * (1 - discountPercent / 100);
}

/**
 * Formata um CNPJ (XX.XXX.XXX/XXXX-XX)
 * @param cnpj CNPJ a ser formatado
 * @returns String formatada como CNPJ
 */
export function formatCNPJ(cnpj: string): string {
  // Remove caracteres não numéricos
  const numbers = cnpj.replace(/\D/g, '');
  
  // Aplica a máscara
  return numbers.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
}

/**
 * Formata um CPF (XXX.XXX.XXX-XX)
 * @param cpf CPF a ser formatado
 * @returns String formatada como CPF
 */
export function formatCPF(cpf: string): string {
  // Remove caracteres não numéricos
  const numbers = cpf.replace(/\D/g, '');
  
  // Aplica a máscara
  return numbers.replace(
    /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
    '$1.$2.$3-$4'
  );
}

/**
 * Trunca um texto longo e adiciona reticências
 * @param text Texto a ser truncado
 * @param maxLength Tamanho máximo
 * @returns Texto truncado
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Formata um hash de blockchain para exibição
 * @param hash Hash completo
 * @param startChars Caracteres iniciais a manter
 * @param endChars Caracteres finais a manter
 * @returns Hash formatado
 */
export function formatBlockchainHash(hash: string, startChars: number = 8, endChars: number = 8): string {
  if (!hash || hash.length <= startChars + endChars + 3) return hash;
  return `${hash.substring(0, startChars)}...${hash.substring(hash.length - endChars)}`;
}

/**
 * Calcula e formata a taxa padrão de 2.5% do sistema
 * @param value Valor base
 * @returns String formatada como moeda
 */
export function calculateStandardFee(value: number): string {
  return calculateAndFormatTax(value, 2.5);
} 
/**
 * Format a number as currency (BRL)
 * @param value The value to format
 * @returns Formatted currency string
 */
export function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined) {
    return 'R$ 0,00';
  }

  const numberValue = typeof value === 'string' ? parseFloat(value) : value;

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numberValue);
}

/**
 * Format a date string to localized format
 * @param dateString The date string to format
 * @param includeTime Whether to include time in the formatted date
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string | Date | null | undefined,
  includeTime = false
): string {
  if (!dateString) {
    return '-';
  }

  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

  if (isNaN(date.getTime())) {
    return 'Data inválida';
  }

  const dateOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };

  if (includeTime) {
    return date.toLocaleDateString('pt-BR', { ...dateOptions, ...timeOptions });
  }

  return date.toLocaleDateString('pt-BR', dateOptions);
}

/**
 * Format a number with thousands separator
 * @param value The value to format
 * @param decimals Number of decimal places
 * @returns Formatted number string
 */
export function formatNumber(value: number | string | null | undefined, decimals = 2): string {
  if (value === null || value === undefined) {
    return '0';
  }

  const numberValue = typeof value === 'string' ? parseFloat(value) : value;

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numberValue);
}

/**
 * Format a percentage value
 * @param value The value to format (e.g., 0.15 for 15%)
 * @param decimals Number of decimal places
 * @returns Formatted percentage string
 */
export function formatPercent(value: number | string | null | undefined, decimals = 2): string {
  if (value === null || value === undefined) {
    return '0%';
  }

  const numberValue = typeof value === 'string' ? parseFloat(value) : value;

  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numberValue);
}

/**
 * Format a document number (CPF/CNPJ)
 * @param value Document number
 * @param type 'cpf' or 'cnpj'
 * @returns Formatted document number
 */
export function formatDocument(
  value: string | null | undefined,
  type: 'cpf' | 'cnpj' = 'cpf'
): string {
  if (!value) {
    return '';
  }

  // Remove all non-numeric characters
  const digits = value.replace(/\D/g, '');

  if (type === 'cpf' || digits.length <= 11) {
    // Format as CPF: 123.456.789-01
    if (digits.length !== 11) {
      return digits;
    }

    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else {
    // Format as CNPJ: 12.345.678/0001-90
    if (digits.length !== 14) {
      return digits;
    }

    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
}

/**
 * Trunca um texto para um tamanho específico e adiciona reticências
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

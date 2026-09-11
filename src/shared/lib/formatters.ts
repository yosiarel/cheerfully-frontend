/**
 * Format currency to IDR format (Rp XX.XXX)
 */
export const formatCurrency = (amount: number | string): string => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numericAmount)) return 'Rp 0';

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(numericAmount);
};

/**
 * Format date string
 */
export const formatDate = (dateString: string, locale: string = 'id'): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
};

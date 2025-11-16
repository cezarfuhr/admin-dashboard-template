import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('formats number as BRL currency', () => {
      expect(formatCurrency(1000)).toBe('R$\xa01.000,00');
      expect(formatCurrency(1234.56)).toBe('R$\xa01.234,56');
    });
  });

  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/15\/01\/2024/);
    });
  });

  describe('formatDateTime', () => {
    it('formats datetime correctly', () => {
      const date = new Date('2024-01-15T14:30:00');
      const formatted = formatDateTime(date);
      expect(formatted).toContain('15/01/2024');
    });
  });
});

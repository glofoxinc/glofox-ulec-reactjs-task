import { describe, expect, it } from 'vitest';
import { formatCurrencyFromCents, formatNumber, formatPercent } from './format';

describe('format helpers', () => {
  it('formats cents as whole-currency amounts', () => {
    expect(formatCurrencyFromCents(123400, 'USD')).toMatch(/1,234|1234/);
  });

  it('formats plain numbers', () => {
    expect(formatNumber(1200)).toMatch(/1,200|1200/);
  });

  it('formats ratios as percents', () => {
    expect(formatPercent(0.42)).toMatch(/42/);
  });
});

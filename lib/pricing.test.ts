import { calcTotals } from './pricing';

describe('calcTotals', () => {
  it('calculates totals with service and tax', () => {
    const totals = calcTotals(
      [
        { qty: 2, price: 1000 },
        { qty: 1, price: 500 }
      ],
      { serviceRate: 0.1, taxRate: 0.12 }
    );
    expect(totals).toEqual({ subtotal: 2500, service: 250, tax: 330, grand: 3080 });
  });
});

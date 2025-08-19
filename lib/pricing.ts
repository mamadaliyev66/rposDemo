export const calcTotals = (
  items: { qty: number; price: number }[],
  { serviceRate, taxRate }: { serviceRate: number; taxRate: number }
) => {
  const subtotal = items.reduce((s, it) => s + it.qty * it.price, 0);
  const service = Math.round(subtotal * serviceRate);
  const tax = Math.round((subtotal + service) * taxRate);
  const grand = subtotal + service + tax;
  return { subtotal, service, tax, grand };
};

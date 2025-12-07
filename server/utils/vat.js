const roundPrice = (value) => {
  const numeric = Number(value) || 0;
  return Number((Math.round(numeric * 100) / 100).toFixed(2));
};

export const computeVat = ({ gross, rate = 0.19 }) => {
  const grossValue = Number(gross) || 0;
  const net = roundPrice(grossValue / (1 + rate));
  const vat = roundPrice(grossValue - net);

  return {
    gross: roundPrice(grossValue),
    net,
    vat,
    rate,
  };
};

export { roundPrice };

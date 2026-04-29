// MANEJO DE MÚLTIPLES MONEDAS
export function convertirMoneda(monto, monedaOrigen, monedaDestino, tiposCambio) {
  if (monedaOrigen === monedaDestino) return monto;
  let montoHNL = monto;
  if (monedaOrigen !== 'HNL') montoHNL = monto * (tiposCambio[monedaOrigen] || 1);
  if (monedaDestino === 'HNL') return Math.round(montoHNL * 100) / 100;
  return Math.round((montoHNL / (tiposCambio[monedaDestino] || 1)) * 100) / 100;
}

export function obtenerSimboloMoneda(moneda) {
  const s = { HNL: 'L', USD: '$', EUR: '€' };
  return s[moneda] || moneda;
}

export function formatearMoneda(monto, moneda = 'HNL') {
  return `${obtenerSimboloMoneda(moneda)} ${monto.toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

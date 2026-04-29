// RETROACTIVO - Cálculo de pagos retroactivos
export function calcularRetroactivo(salarioAnterior, salarioNuevo, mesesPendientes, config) {
  const diferencia = salarioNuevo - salarioAnterior;
  if (diferencia <= 0) return { diferenciaMensual: 0, mesesPendientes: 0, totalRetroactivo: 0, deduccionesAdicionales: 0, netoRetroactivo: 0 };
  const totalRetro = diferencia * mesesPendientes;
  // Recalcular deducciones sobre la diferencia
  const ihssDiff = Math.min(diferencia, config.techoIHSS) * ((config.porcentajeIHSS_IVM + config.porcentajeIHSS_EM) / 100) * mesesPendientes;
  const rapDiff = diferencia * (config.porcentajeRAP / 100) * mesesPendientes;
  const deduccionesAdicionales = Math.round((ihssDiff + rapDiff) * 100) / 100;
  return { diferenciaMensual: diferencia, mesesPendientes, totalRetroactivo: Math.round(totalRetro*100)/100, deduccionesAdicionales, netoRetroactivo: Math.round((totalRetro - deduccionesAdicionales)*100)/100 };
}

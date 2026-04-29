// PRORRATEO - Cálculo de pagos parciales
export function calcularProrrateo(salarioMensual, fechaIngreso, mesAnio) {
  const [anio, mes] = mesAnio.split('-').map(Number);
  const diasMes = new Date(anio, mes, 0).getDate();
  const inicio = new Date(fechaIngreso);
  const inicioMes = new Date(anio, mes - 1, 1);
  const finMes = new Date(anio, mes, 0);
  if (inicio > finMes) return { diasTrabajados: 0, salarioProporcional: 0, factor: 0 };
  const diaInicio = inicio > inicioMes ? inicio.getDate() : 1;
  const diasTrabajados = diasMes - diaInicio + 1;
  const factor = diasTrabajados / diasMes;
  return { diasTrabajados, salarioProporcional: Math.round(salarioMensual * factor * 100) / 100, factor: Math.round(factor * 10000) / 10000 };
}

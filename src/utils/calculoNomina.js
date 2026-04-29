// MOTOR DE CÁLCULO DE NÓMINA - HONDURAS

export function calcularIHSS(salarioMensual, config) {
  const techo = config.techoIHSS;
  const base = Math.min(salarioMensual, techo);
  const ivm = base * (config.porcentajeIHSS_IVM / 100);
  const em = base * (config.porcentajeIHSS_EM / 100);
  return { ivm: Math.round(ivm * 100) / 100, em: Math.round(em * 100) / 100, total: Math.round((ivm + em) * 100) / 100 };
}

export function calcularISR(salarioMensualBruto, config) {
  const ihss = calcularIHSS(salarioMensualBruto, config);
  const rap = calcularRAP(salarioMensualBruto, config);
  const salarioNetoAnual = (salarioMensualBruto - ihss.total - rap) * 12;
  let impuestoAnual = 0;
  const t = config.tablaISR;
  if (salarioNetoAnual <= t[0].hasta) impuestoAnual = 0;
  else if (salarioNetoAnual <= t[1].hasta) impuestoAnual = (salarioNetoAnual - t[0].hasta) * (t[1].tasa / 100);
  else if (salarioNetoAnual <= t[2].hasta) {
    impuestoAnual = (t[1].hasta - t[0].hasta) * (t[1].tasa / 100) + (salarioNetoAnual - t[1].hasta) * (t[2].tasa / 100);
  } else {
    impuestoAnual = (t[1].hasta - t[0].hasta) * (t[1].tasa / 100) + (t[2].hasta - t[1].hasta) * (t[2].tasa / 100) + (salarioNetoAnual - t[2].hasta) * (t[3].tasa / 100);
  }
  return Math.round((impuestoAnual / 12) * 100) / 100;
}

export function calcularRAP(salarioMensual, config) {
  return Math.round(salarioMensual * (config.porcentajeRAP / 100) * 100) / 100;
}

export function calcularHoraOrdinaria(salarioMensual, horasJornada) {
  return salarioMensual / 30 / horasJornada;
}

export function calcularHorasExtras(salarioMensual, horasJornada, hDiurnas = 0, hNocturnas = 0, hNoctProl = 0, config) {
  const ho = calcularHoraOrdinaria(salarioMensual, horasJornada);
  const d = ho * (1 + config.horasExtra.diurna / 100) * hDiurnas;
  const n = ho * (1 + config.horasExtra.nocturna / 100) * hNocturnas;
  const np = ho * (1 + config.horasExtra.nocturna_prolongada / 100) * hNoctProl;
  return { diurnas: Math.round(d*100)/100, nocturnas: Math.round(n*100)/100, nocturnaProlongada: Math.round(np*100)/100, total: Math.round((d+n+np)*100)/100 };
}

export function calcularFeriadosTrabajados(salarioMensual, dias) {
  return Math.round((salarioMensual / 30) * 2 * dias * 100) / 100;
}

export function calcularRecargoNocturno(salarioMensual, dias) {
  return Math.round((salarioMensual / 30) * 0.25 * dias * 100) / 100;
}

export function calcularDeduccionPrestamos(prestamos) {
  return prestamos.filter(p => p.saldoPendiente > 0).reduce((s, p) => s + p.cuotaMensual, 0);
}

export function calcularEmbargos(salarioBruto, embargos) {
  return embargos.reduce((s, e) => s + (e.montoFijo > 0 ? e.montoFijo : salarioBruto * e.porcentaje / 100), 0);
}

export function calcularNominaEmpleado(empleado, extras = {}, config) {
  const { horasExtraDiurnas=0, horasExtraNocturnas=0, horasExtraNoctProlongadas=0, diasFeriadosTrabajados=0, diasNocturnos=0, comisiones=0, bonos=0, otrosIngresos=0, otrasDeduccciones=0 } = extras;
  const sb = empleado.salarioBase;
  const hx = calcularHorasExtras(sb, empleado.horasJornada, horasExtraDiurnas, horasExtraNocturnas, horasExtraNoctProlongadas, config);
  const fp = calcularFeriadosTrabajados(sb, diasFeriadosTrabajados);
  const rn = calcularRecargoNocturno(sb, diasNocturnos);
  const totalIng = sb + hx.total + fp + rn + comisiones + bonos + otrosIngresos;
  const ihss = calcularIHSS(sb, config);
  const isr = calcularISR(sb, config);
  const rap = calcularRAP(sb, config);
  const pr = calcularDeduccionPrestamos(empleado.deducciones?.prestamos || []);
  const emb = calcularEmbargos(sb, empleado.deducciones?.embargos || []);
  const fp2 = empleado.deducciones?.fondoPension || 0;
  const totalDed = ihss.total + isr + rap + pr + emb + fp2 + otrasDeduccciones;
  return {
    empleadoId: empleado.id, empleadoNombre: empleado.nombre, cargo: empleado.cargo, departamento: empleado.departamento,
    periodo: new Date().toISOString(),
    ingresos: { salarioBase: sb, horasExtras: hx, feriadosTrabajados: fp, recargoNocturno: rn, comisiones, bonos, otrosIngresos, totalIngresos: Math.round(totalIng*100)/100 },
    deducciones: { ihss, isr, rap, prestamos: pr, embargos: emb, fondoPension: fp2, otrasDeduccciones, totalDeducciones: Math.round(totalDed*100)/100 },
    salarioNeto: Math.round((totalIng - totalDed)*100)/100
  };
}

export function formatoMoneda(monto, moneda = 'HNL') {
  const s = { HNL: 'L', USD: '$', EUR: '€' };
  return `${s[moneda]||moneda} ${monto.toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// CÁLCULO DE LIQUIDACIONES / FINIQUITOS - HONDURAS

export function calcularAntiguedad(fechaIngreso, fechaTerminacion) {
  const inicio = new Date(fechaIngreso);
  const fin = new Date(fechaTerminacion);
  const diffMs = fin - inicio;
  const dias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const anios = Math.floor(dias / 365);
  const meses = Math.floor((dias % 365) / 30);
  const diasResto = dias % 30;
  return { anios, meses, dias: diasResto, totalDias: dias };
}

export function calcularDiasVacaciones(aniosAntiguedad) {
  if (aniosAntiguedad >= 4) return 20;
  if (aniosAntiguedad >= 3) return 15;
  if (aniosAntiguedad >= 2) return 12;
  if (aniosAntiguedad >= 1) return 10;
  return 0;
}

export function calcularVacacionesProporcionales(salarioMensual, fechaIngreso, fechaTerminacion) {
  const ant = calcularAntiguedad(fechaIngreso, fechaTerminacion);
  const diasVac = calcularDiasVacaciones(ant.anios);
  const salarioDiario = salarioMensual / 30;
  const inicio = new Date(fechaIngreso);
  const fin = new Date(fechaTerminacion);
  const ultimoAniversario = new Date(inicio);
  ultimoAniversario.setFullYear(fin.getFullYear());
  if (ultimoAniversario > fin) ultimoAniversario.setFullYear(ultimoAniversario.getFullYear() - 1);
  const diasDesdeAniversario = Math.floor((fin - ultimoAniversario) / (1000*60*60*24));
  const vacProporcionales = (diasVac / 365) * diasDesdeAniversario;
  return Math.round(salarioDiario * vacProporcionales * 100) / 100;
}

export function calcularDecimoProporcional(salarioMensual, fechaInicioPeriodo, fechaTerminacion) {
  const inicio = new Date(fechaInicioPeriodo);
  const fin = new Date(fechaTerminacion);
  const mesesTrabajados = (fin.getFullYear()-inicio.getFullYear())*12 + fin.getMonth()-inicio.getMonth() + (fin.getDate()>=inicio.getDate()?0:-1);
  const mesesEfectivos = Math.min(Math.max(mesesTrabajados, 0), 12);
  return Math.round((salarioMensual / 12) * mesesEfectivos * 100) / 100;
}

export function calcularPreaviso(salarioMensual, aniosAntiguedad) {
  if (aniosAntiguedad < 1) return Math.round(salarioMensual / 4 * 100) / 100; // 1 semana
  if (aniosAntiguedad < 2) return salarioMensual; // 1 mes
  return salarioMensual * 2; // 2 meses
}

export function calcularCesantia(salarioMensual, aniosAntiguedad) {
  const meses = Math.min(aniosAntiguedad, 25);
  return Math.round(salarioMensual * meses * 100) / 100;
}

export function calcularLiquidacion(empleado, fechaTerminacion, tipoDespido) {
  const ant = calcularAntiguedad(empleado.fechaIngreso, fechaTerminacion);
  const anioActual = new Date(fechaTerminacion).getFullYear();
  const vacaciones = calcularVacacionesProporcionales(empleado.salarioBase, empleado.fechaIngreso, fechaTerminacion);
  const inicio13 = `${anioActual}-01-01`;
  const inicio14M = new Date(fechaTerminacion).getMonth() >= 6 ? `${anioActual}-07-01` : `${anioActual-1}-07-01`;
  const decimoTercer = calcularDecimoProporcional(empleado.salarioBase, inicio13, fechaTerminacion);
  const decimoCuarto = calcularDecimoProporcional(empleado.salarioBase, inicio14M, fechaTerminacion);
  let preaviso = 0, cesantia = 0;
  if (tipoDespido === 'injustificado') {
    preaviso = calcularPreaviso(empleado.salarioBase, ant.anios);
    cesantia = calcularCesantia(empleado.salarioBase, ant.anios);
  }
  if (tipoDespido === 'renuncia' && ant.anios >= 15) {
    cesantia = Math.round(calcularCesantia(empleado.salarioBase, ant.anios) * 0.35 * 100) / 100;
  }
  const total = vacaciones + decimoTercer + decimoCuarto + preaviso + cesantia;
  return {
    empleado: empleado.nombre, fechaIngreso: empleado.fechaIngreso, fechaTerminacion, tipoDespido,
    antiguedad: ant, vacaciones, decimoTercer, decimoCuarto, preaviso, cesantia,
    total: Math.round(total * 100) / 100
  };
}

import jsPDF from 'jspdf';
import { formatoMoneda } from './calculoNomina';

export function generarReciboPDF(nomina, empresa) {
  const doc = new jsPDF();
  const w = doc.internal.pageSize.getWidth();
  // Header
  doc.setFillColor(108, 92, 231);
  doc.rect(0, 0, w, 35, 'F');
  doc.setTextColor(255,255,255);
  doc.setFontSize(18);
  doc.setFont('helvetica','bold');
  doc.text(empresa.nombre || 'Empresa Elsa', 14, 16);
  doc.setFontSize(9);
  doc.setFont('helvetica','normal');
  doc.text(empresa.direccion || '', 14, 23);
  doc.text(`RTN: ${empresa.rtn || ''}  |  Tel: ${empresa.telefono || ''}`, 14, 29);
  doc.setFontSize(12);
  doc.text('RECIBO DE PAGO', w - 14, 20, { align: 'right' });

  // Employee info
  doc.setTextColor(50,50,50);
  let y = 45;
  doc.setFontSize(10);
  doc.setFont('helvetica','bold');
  doc.text('Empleado:', 14, y);
  doc.setFont('helvetica','normal');
  doc.text(nomina.empleadoNombre, 50, y);
  y += 7;
  doc.setFont('helvetica','bold');
  doc.text('Cargo:', 14, y);
  doc.setFont('helvetica','normal');
  doc.text(nomina.cargo, 50, y);
  doc.setFont('helvetica','bold');
  doc.text('Depto:', 110, y);
  doc.setFont('helvetica','normal');
  doc.text(nomina.departamento, 135, y);
  y += 7;
  doc.setFont('helvetica','bold');
  doc.text('Período:', 14, y);
  doc.setFont('helvetica','normal');
  doc.text(new Date(nomina.periodo).toLocaleDateString('es-HN', { year:'numeric', month:'long' }), 50, y);
  y += 12;

  // Ingresos table
  doc.setFillColor(240,240,255);
  doc.rect(14, y, w-28, 8, 'F');
  doc.setFont('helvetica','bold');
  doc.setTextColor(108,92,231);
  doc.text('INGRESOS', 16, y+6);
  y += 12;
  doc.setTextColor(50,50,50);
  doc.setFont('helvetica','normal');
  const ing = nomina.ingresos;
  const ingresos = [
    ['Salario Base', ing.salarioBase],
    ['Horas Extras', ing.horasExtras?.total || 0],
    ['Feriados Trabajados', ing.feriadosTrabajados],
    ['Recargo Nocturno', ing.recargoNocturno],
    ['Comisiones', ing.comisiones],
    ['Bonos', ing.bonos],
    ['Otros Ingresos', ing.otrosIngresos],
  ];
  ingresos.forEach(([label, val]) => {
    if (val > 0) {
      doc.text(label, 20, y);
      doc.text(formatoMoneda(val), w-20, y, { align:'right' });
      y += 6;
    }
  });
  doc.setFont('helvetica','bold');
  doc.line(14, y, w-14, y);
  y += 6;
  doc.text('Total Ingresos', 20, y);
  doc.text(formatoMoneda(ing.totalIngresos), w-20, y, { align:'right' });
  y += 12;

  // Deducciones
  doc.setFillColor(255,240,240);
  doc.rect(14, y, w-28, 8, 'F');
  doc.setFont('helvetica','bold');
  doc.setTextColor(225,112,85);
  doc.text('DEDUCCIONES', 16, y+6);
  y += 12;
  doc.setTextColor(50,50,50);
  doc.setFont('helvetica','normal');
  const ded = nomina.deducciones;
  const deducciones = [
    ['IHSS (IVM + EM)', ded.ihss.total],
    ['ISR', ded.isr],
    ['RAP', ded.rap],
    ['Préstamos', ded.prestamos],
    ['Embargos', ded.embargos],
    ['Fondo Pensión', ded.fondoPension],
  ];
  deducciones.forEach(([label, val]) => {
    if (val > 0) {
      doc.text(label, 20, y);
      doc.text(formatoMoneda(val), w-20, y, { align:'right' });
      y += 6;
    }
  });
  doc.setFont('helvetica','bold');
  doc.line(14, y, w-14, y);
  y += 6;
  doc.text('Total Deducciones', 20, y);
  doc.setTextColor(225,112,85);
  doc.text(formatoMoneda(ded.totalDeducciones), w-20, y, { align:'right' });
  y += 14;

  // Neto
  doc.setFillColor(108, 92, 231);
  doc.roundedRect(14, y, w-28, 14, 3, 3, 'F');
  doc.setTextColor(255,255,255);
  doc.setFontSize(12);
  doc.text('SALARIO NETO A PAGAR', 20, y+10);
  doc.text(formatoMoneda(nomina.salarioNeto), w-20, y+10, { align:'right' });
  y += 25;

  // Firmas
  doc.setTextColor(100,100,100);
  doc.setFontSize(8);
  doc.line(14, y+15, 80, y+15);
  doc.text('Firma del Empleado', 30, y+20);
  doc.line(w-80, y+15, w-14, y+15);
  doc.text('Firma Autorizada', w-60, y+20);

  doc.save(`Recibo_${nomina.empleadoNombre.replace(/\s/g,'_')}.pdf`);
}

export function generarLiquidacionPDF(liquidacion, empresa) {
  const doc = new jsPDF();
  const w = doc.internal.pageSize.getWidth();
  doc.setFillColor(108, 92, 231);
  doc.rect(0, 0, w, 35, 'F');
  doc.setTextColor(255,255,255);
  doc.setFontSize(18);
  doc.setFont('helvetica','bold');
  doc.text(empresa.nombre || 'Empresa Elsa', 14, 16);
  doc.setFontSize(12);
  doc.text('LIQUIDACIÓN LABORAL', w-14, 20, { align:'right' });
  doc.setFontSize(9);
  doc.setFont('helvetica','normal');
  doc.text(empresa.direccion || '', 14, 27);

  let y = 45;
  doc.setTextColor(50,50,50);
  doc.setFontSize(10);
  const tipo = liquidacion.tipoDespido === 'injustificado' ? 'Despido Injustificado' : 'Renuncia Voluntaria';
  const info = [
    ['Empleado:', liquidacion.empleado],
    ['Fecha Ingreso:', new Date(liquidacion.fechaIngreso).toLocaleDateString('es-HN')],
    ['Fecha Terminación:', new Date(liquidacion.fechaTerminacion).toLocaleDateString('es-HN')],
    ['Tipo:', tipo],
    ['Antigüedad:', `${liquidacion.antiguedad.anios} años, ${liquidacion.antiguedad.meses} meses`],
  ];
  info.forEach(([l,v]) => {
    doc.setFont('helvetica','bold'); doc.text(l, 14, y);
    doc.setFont('helvetica','normal'); doc.text(v, 65, y);
    y += 7;
  });
  y += 8;

  doc.setFillColor(240,240,255);
  doc.rect(14, y, w-28, 8, 'F');
  doc.setFont('helvetica','bold');
  doc.setTextColor(108,92,231);
  doc.text('DESGLOSE DE PRESTACIONES', 16, y+6);
  y += 14;
  doc.setTextColor(50,50,50);
  doc.setFont('helvetica','normal');
  const items = [
    ['Vacaciones Proporcionales', liquidacion.vacaciones],
    ['Décimo Tercer Mes Proporcional', liquidacion.decimoTercer],
    ['Décimo Cuarto Mes Proporcional', liquidacion.decimoCuarto],
    ['Preaviso', liquidacion.preaviso],
    ['Auxilio de Cesantía', liquidacion.cesantia],
  ];
  items.forEach(([l,v]) => {
    doc.text(l, 20, y);
    doc.text(formatoMoneda(v), w-20, y, { align:'right' });
    y += 7;
  });
  y += 4;
  doc.setFillColor(108,92,231);
  doc.roundedRect(14, y, w-28, 14, 3, 3, 'F');
  doc.setTextColor(255,255,255);
  doc.setFontSize(12);
  doc.setFont('helvetica','bold');
  doc.text('TOTAL LIQUIDACIÓN', 20, y+10);
  doc.text(formatoMoneda(liquidacion.total), w-20, y+10, { align:'right' });
  y += 30;
  doc.setTextColor(100,100,100);
  doc.setFontSize(8);
  doc.line(14, y+15, 80, y+15);
  doc.text('Firma del Empleado', 30, y+20);
  doc.line(w-80, y+15, w-14, y+15);
  doc.text('Firma Autorizada', w-60, y+20);

  doc.save(`Liquidacion_${liquidacion.empleado.replace(/\s/g,'_')}.pdf`);
}

import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


@Injectable({
  providedIn: 'root',
})
export class PdfGeneratorService {
   generarPlanilla(planilla: any) {
    const { trabajador, ingresos, aportes, porcentajes, nivelRiesgo } = planilla;
/*     const doc = new jsPDF('p', 'mm', 'a4'); */
    const doc = new jsPDF({ filters: ["ASCIIHexEncode"] });
    // ====== ENCABEZADO ======
    doc.setFillColor(71, 196, 140); // Color menta
    doc.rect(0, 0, 210, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('PLANILLA INTEGRADA DE LIQUIDACIÓN DE APORTES (PILA)', 105, 15, { align: 'center' });
    doc.setFontSize(11);
    doc.text('Trabajador Independiente - Colombia', 105, 22, { align: 'center' });

    // ====== INFORMACIÓN GENERAL ======
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Fecha de generación: ${planilla.fechaGeneracion}`, 10, 35);

    // ====== DATOS DEL TRABAJADOR ======
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('1️ DATOS DEL APORTANTE', 10, 45);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    autoTable(doc, {
      startY: 48,
      theme: 'grid',
      styles: { fontSize: 9, halign: 'left', cellPadding: 2 },
      headStyles: { fillColor: [162, 140, 222], textColor: 255 },
      body: [
        ['Nombre completo', trabajador.nombre],
        ['Tipo y número de documento', `${trabajador.tipoDocumento} ${trabajador.documento}`],
        ['Correo electrónico', trabajador.email],
        ['Teléfono de contacto', trabajador.telefono],
      ],
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 } },
    });

    // ====== DATOS LABORALES ======
    const afterWorkerTableY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('2️. DATOS LABORALES Y BASE DE COTIZACIÓN', 10, afterWorkerTableY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    autoTable(doc, {
      startY: afterWorkerTableY + 3,
      theme: 'grid',
      styles: { fontSize: 9, halign: 'left', cellPadding: 2 },
      headStyles: { fillColor: [162, 140, 222], textColor: 255 },
      body: [
        ['Ingreso mensual', `$${ingresos.ingresoMensual.toLocaleString()}`],
        ['Porcentaje IBC aplicado', `${(ingresos.porcentajeIBC * 100).toFixed(0)}%`],
        ['IBC utilizado', `$${ingresos.IBC_usado.toLocaleString()}`],
        ['Nivel de riesgo ARL', nivelRiesgo],
      ],
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 70 } },
    });

    // ====== DESGLOSE DE APORTES ======
    const afterIBC = (doc as any).lastAutoTable.finalY + 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('3️. DESGLOSE DE APORTES', 10, afterIBC);

    autoTable(doc, {
      startY: afterIBC + 3,
      theme: 'grid',
      head: [['Concepto', 'Porcentaje', 'Valor (COP)']],
      body: [
        ['Pensión', `${(porcentajes.pension * 100).toFixed(2)}%`, `$${aportes.pension.toLocaleString()}`],
        ['EPS', `${(porcentajes.eps * 100).toFixed(2)}%`, `$${aportes.eps.toLocaleString()}`],
        ['ARL', `${(porcentajes.arl * 100).toFixed(2)}%`, `$${aportes.arl.toLocaleString()}`],
      ],
      styles: { fontSize: 9, halign: 'center', cellPadding: 3 },
      headStyles: { fillColor: [71, 196, 140], textColor: 255 },
    });

    // ====== TOTAL ======
    const afterAportes = (doc as any).lastAutoTable.finalY + 5;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(50, 50, 50);
    doc.text(` TOTAL APORTES: $${aportes.total.toLocaleString()}`, 10, afterAportes);

    // ====== NOTAS ======
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Nota: Los valores están calculados según las tarifas vigentes para trabajadores independientes en Colombia.', 10, afterAportes + 8);

    // ====== FIRMA ======
    const firmaY = afterAportes + 25;
    doc.setDrawColor(0);
    doc.line(10, firmaY, 90, firmaY);
    doc.text('Firma del aportante', 10, firmaY + 5);

    // ====== PIE DE PÁGINA ======
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Generado automáticamente por el simulador de aportes © 2025', 105, 290, { align: 'center' });

    // Guardar el PDF
    doc.save(`Planilla_PILA_${trabajador.nombre}.pdf`);
  }
}
import { Component } from '@angular/core';
import { riksType } from '../../core/riskType';
import { SimulatorService } from '../../../services/simulator';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { PdfGeneratorService } from '../../../services/pdf-generator.service';

@Component({
  selector: 'app-payment-form',
  imports: [CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatRadioModule,
    CurrencyPipe],
  templateUrl: './payment-form.html',
  styleUrl: './payment-form.scss',
})
export class PaymentForm {

  // Datos personales
  nombre = '';
  tipoDocumento = '';
  documento = '';
  correo = '';
  telefono = '';

  // Datos laborales
  ingresoMensual = 2000000;
  porcentajeIBC = 0.4;
  nivelARL = 1;
  aplicarTopes = true;

  nivelesARL = riksType.nivelesARL;

  resultado?: any;

  constructor(
    private simService: SimulatorService,
    private pdfService: PdfGeneratorService
  ) {}

  generarPlanilla() {

    // Construimos el objeto trabajador
    const trabajador = {
      nombre: this.nombre,
      tipoDocumento: this.tipoDocumento,
      documento: this.documento,
      email: this.correo,
      telefono: this.telefono
    };

    // Calculamos valores base
    const base = this.simService.simulate({
      ingresoMensual: this.ingresoMensual,
      porcentajeIBC: this.porcentajeIBC,
      aplicarTopes: this.aplicarTopes
    });

    const riesgo = this.nivelesARL.find(n => n.nivel === this.nivelARL);
    const porcEPS = 0.125;
    const porcPension = 0.16;
    const porcARL = riesgo ? riesgo.porcentaje : 0;

    const aportePension = base.IBC_usado * porcPension;
    const aporteEps = base.IBC_usado * porcEPS;
    const aporteArl = base.IBC_usado * porcARL;
    const total = aportePension + aporteEps + aporteArl;

    // 🔹 Creamos el objeto planilla completo
    const planilla = {
      fechaGeneracion: new Date().toLocaleString(),
      trabajador,
      ingresos: {
        ingresoMensual: this.ingresoMensual,
        porcentajeIBC: this.porcentajeIBC,
        IBC_usado: base.IBC_usado,
        aplicarTopes: this.aplicarTopes,
      },
      aportes: {
        pension: aportePension,
        eps: aporteEps,
        arl: aporteArl,
        total,
      },
      porcentajes: {
        pension: porcPension,
        eps: porcEPS,
        arl: porcARL,
      },
      nivelRiesgo: riesgo ? riesgo.nombre : 'No especificado',
    };

    this.resultado = planilla;

    // Generamos el PDF con todos los datos
    this.pdfService.generarPlanilla(planilla);
  }
}
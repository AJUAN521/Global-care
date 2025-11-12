import { Injectable } from '@angular/core';
import { riksType } from '../app/core/riskType';
import { PdfGeneratorService } from './pdf-generator.service';

export interface SimuladorInput {
  ingresoMensual: number;
  porcentajeIBC?: number;
  salarioMinimo?: number;
  aplicarTopes?: boolean;
  nivelRiesgo?: number; // <-- nuevo
}

export interface SimuladorOutput {
  ingresoMensual: number;
  porcentajeIBC: number;
  IBC: number;
  IBC_usado: number;
  aportePension: number;
  aporteEPS: number;
  aporteARL: number;
  aportePensionPorcentaje: number;
  aporteEPSPorcentaje: number;
  aporteARLPorcentaje: number;
  totalAportes: number;
  notas?: string[];
  desglose?: {
    IBC_publico?: number;
    IBC_excedente?: number;
    aporte_publico?: number;
    aporte_excedente?: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class SimulatorService {
  private readonly PORC_PENSION = 0.16;
  private readonly PORC_EPS = 0.125;

  constructor(private pdfService: PdfGeneratorService) {}

  simulate(input: SimuladorInput): SimuladorOutput {
    const salarioMinimo = input.salarioMinimo ?? 1423500;
    const porcentajeIBC = input.porcentajeIBC ?? 0.4;
    const aplicarTopes = !!input.aplicarTopes;
    const nivelRiesgo = input.nivelRiesgo ?? 1;

    const IBC = input.ingresoMensual * porcentajeIBC;
    const IBC_min = salarioMinimo;
    const IBC_max_publico = 2.3 * salarioMinimo;

    let IBC_usado = IBC;
    const notas: string[] = [];

    if (IBC_usado < IBC_min) {
      notas.push(
        `IBC calculado (${this.format(IBC_usado)}) menor a 1 SM (${this.format(IBC_min)}). Se aplica IBC mínimo.`
      );
      IBC_usado = IBC_min;
    }

    const riesgo = riksType.nivelesARL.find(r => r.nivel === nivelRiesgo);
    const porcARL = riesgo ? riesgo.porcentaje : 0.00522;

    const aportePension = IBC_usado * this.PORC_PENSION;
    const aporteEPS = IBC_usado * this.PORC_EPS;
    const aporteARL = IBC_usado * porcARL;

    let totalAportes = aportePension + aporteEPS + aporteARL;

    const output: SimuladorOutput = {
      ingresoMensual: input.ingresoMensual,
      porcentajeIBC,
      IBC,
      IBC_usado,
      aportePension,
      aporteEPS,
      aporteARL,
      aportePensionPorcentaje: this.PORC_PENSION,
      aporteEPSPorcentaje: this.PORC_EPS,
      aporteARLPorcentaje: porcARL,
      totalAportes,
      notas
    };

    if (aplicarTopes) {
      const publico = Math.min(IBC_usado, IBC_max_publico);
      const excedente = Math.max(0, IBC_usado - IBC_max_publico);

      output.desglose = {
        IBC_publico: publico,
        IBC_excedente: excedente,
        aporte_publico: publico * this.PORC_PENSION,
        aporte_excedente: excedente * this.PORC_PENSION,
      };

      output.notas?.push(
        `Se aplicó tope público de ${this.format(IBC_max_publico)} COP (2.3 SM).`
      );
    }

    return output;
  }

  private format(n: number) {
    return n.toLocaleString('es-CO', { maximumFractionDigits: 0 });
  }

  
  /* generarPDF() {
    this.pdfService.generarPlanilla(this.trabajador, this.resultado);
  } */
}
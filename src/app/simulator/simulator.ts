import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { SimuladorInput, SimuladorOutput, SimulatorService } from '../../services/simulator';
import { CurrencyPipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { riksType } from '../core/riskType';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-simulator',
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatDividerModule,
    CurrencyPipe,
    CommonModule,
    MatOptionModule
  ],
  templateUrl: './simulator.html',
  styleUrl: './simulator.scss',
})
export class Simulator {
  ingreso = 2000000;
  salarioMinimo = 1423500;
  porcentajeIBC = 0.4;
  aplicarTopes = true;
  nivelRiesgo = 1;
  nivelesARL = riksType.nivelesARL;

  resultado?: SimuladorOutput;

  constructor(private simService: SimulatorService) {}

  calcular() {
    this.resultado = this.simService.simulate({
      ingresoMensual: this.ingreso,
      porcentajeIBC: this.porcentajeIBC,
      salarioMinimo: this.salarioMinimo,
      aplicarTopes: this.aplicarTopes,
      nivelRiesgo: this.nivelRiesgo
    });
    console.log(this.resultado)
  }
}
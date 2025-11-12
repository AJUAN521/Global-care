import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Header } from "../../shared/header/header";
import { PdfGeneratorService } from '../../../services/pdf-generator.service';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { Footer } from '../../shared/footer/footer';


@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe, MatCardModule, Header, CommonModule,MatTableModule, MatCardModule,  MatButtonModule, Footer],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

  usuario: any;
  aportes: any[] = [];

  displayedColumns: string[] = ['fecha', 'ingreso', 'ibc', 'pension', 'eps', 'arl', 'total', 'acciones'];

  constructor(
    private authService: AuthService,
    private pdfService: PdfGeneratorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.obtenerUsuarioActivo();
    if (!this.usuario) {
      this.router.navigate(['/login']);
      return;
    }

    this.cargarAportes();
  }

  cargarAportes() {
    const aportesGuardados = localStorage.getItem('aportes');
    this.aportes = aportesGuardados ? JSON.parse(aportesGuardados) : [];
  }

  irANuevoAporte() {
    this.router.navigate(['/payment-form']);
  }

  irASimulador() {
    this.router.navigate(['/simulator']);
  }

  descargarAporte(planilla: any) {
  this.pdfService.generarPlanilla(planilla);
}
  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
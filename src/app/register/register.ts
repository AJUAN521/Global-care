import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { Header } from "../shared/header/header";
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-register',
  imports: [RouterModule, MatInputModule,MatFormFieldModule, CommonModule, FormsModule, MatCardModule, Header],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
nombre = '';
  correo = '';
  password = '';

  constructor(private auth: AuthService, private router: Router, private snack: MatSnackBar) {}

  registrar() {
    if (this.nombre && this.correo && this.password) {
      const exito = this.auth.registrar(this.nombre, this.correo, this.password);
      if (exito) {
        this.snack.open('Registro exitoso 🎉', 'Cerrar', { duration: 2000 });
        this.router.navigate(['/login']);
      } else {
        this.snack.open('El usuario ya existe ❌', 'Cerrar', { duration: 2000 });
      }
    } else {
      this.snack.open('Completa todos los campos', 'Cerrar', { duration: 2000 });
    }
  }
}
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Header } from '../shared/header/header';

@Component({
  selector: 'app-login',
  imports: [
    RouterModule,
    MatFormFieldModule,
    CommonModule,
    MatCardModule,
    FormsModule,
    MatInputModule,
    Header,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  correo = '';
  password = '';

  constructor(private auth: AuthService, private router: Router, private snack: MatSnackBar) {}

  login() {
    if (this.correo && this.password) {
      const exito = this.auth.login(this.correo, this.password);
      if (exito) {
        this.snack.open('Bienvenido 👋', 'Cerrar', { duration: 2000 });
        this.router.navigate(['/dashboard']);
      } else {
        this.snack.open('Credenciales incorrectas ❌', 'Cerrar', { duration: 2000 });
      }
    } else {
      this.snack.open('Completa todos los campos', 'Cerrar', { duration: 2000 });
    }
  }
}

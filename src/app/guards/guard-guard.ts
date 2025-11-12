import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const usuario = this.auth.obtenerUsuarioActivo();
    if (!usuario) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
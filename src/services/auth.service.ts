import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  private storageKey = 'usuarios';

  registrar(nombre: string, correo: string, password: string): boolean {
    const usuarios = this.obtenerUsuarios();
    const existe = usuarios.find(u => u.correo === correo);

    if (existe) return false;

    usuarios.push({ nombre, correo, password });
    localStorage.setItem(this.storageKey, JSON.stringify(usuarios));
    return true;
  }

  login(correo: string, password: string): boolean {
    const usuarios = this.obtenerUsuarios();
    const usuario = usuarios.find(u => u.correo === correo && u.password === password);

    if (usuario) {
      localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('usuarioActivo');
  }

  obtenerUsuarioActivo() {
    const user = localStorage.getItem('usuarioActivo');
    return user ? JSON.parse(user) : null;
  }

  private obtenerUsuarios(): any[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }
}
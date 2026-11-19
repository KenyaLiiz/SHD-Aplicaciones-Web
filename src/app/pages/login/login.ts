import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from '../../services/post/post';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="max-width: 350px; margin: 80px auto; padding: 25px; border: 1px solid #ddd; border-radius: 10px; font-family: Arial; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
      <h2 style="text-align: center; color: #333;">Iniciar Sesión</h2>
      
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Usuario:</label>
        <input type="text" [(ngModel)]="username" placeholder="Ej. johnd" style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;" />
      </div>
      
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Contraseña:</label>
        <input type="password" [(ngModel)]="password" placeholder="Ej. m38rmF$" style="width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;" />
      </div>

      <button (click)="onLogin()" style="width: 100%; padding: 10px; background: #007bff; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">
        Ingresar
      </button>

      <p *ngIf="errorMessage" style="color: red; font-size: 13px; text-align: center; margin-top: 10px;">{{ errorMessage }}</p>

      <p style="font-size: 11px; color: #666; text-align: center; margin-top: 15px;">
        Credenciales de prueba: <b>johnd</b> / <b>m38rmF$</b>
      </p>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private postService: PostService, private router: Router) {}

  onLogin() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Ingresa usuario y contraseña.';
      return;
    }

    this.postService.login({ username: this.username, password: this.password }).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        void this.router.navigate(['/posts']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Credenciales inválidas. Usa johnd / m38rmF$';
      }
    });
  }
}
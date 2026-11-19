import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token'); // Verificamos si existe el token

  if (token) {
    return true; // Permite el paso si está autenticado
  } else {
    router.navigate(['/login']); // Si no hay sesión, redirige al login
    return false;
  }
};
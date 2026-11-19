import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { FeedComponent } from './pages/feed/feed';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'posts', component: FeedComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

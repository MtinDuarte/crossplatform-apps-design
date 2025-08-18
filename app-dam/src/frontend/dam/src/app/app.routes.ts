import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
    {
    path: 'device-manager',
    loadComponent: () => import('./device-manager/device-manager.page').then( m => m.DeviceManagerPage)
  },
];

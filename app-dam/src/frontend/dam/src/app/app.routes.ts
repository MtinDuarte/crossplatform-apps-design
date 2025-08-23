import { Routes } from '@angular/router';
import { DeviceManagerPage } from './device-manager/device-manager.page';

export const routes: Routes = [
  // Redirigir consultas de "/" a home
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'  
  },
  {
    path: 'home',
    //Eager loading: El componente se carga al inicio. Implica que la carga
    // al inicio va a ser mas costosa. Pero lo tendré dispo
    component: DeviceManagerPage
    
    // Promesa: esto de cargar de esta manera, se llama "Lazy loading"
    //loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'device-manager',
    component : DeviceManagerPage
    //loadComponent: () => import('./device-manager/device-manager.page').then( m => m.DeviceManagerPage)
  },
  {
    path: 'device-manager/:id',
    loadComponent: () => import('./device-manager/device-manager.page').then( m => m.DeviceManagerPage)
  },
  { 
    path: 'device/:id',
    loadComponent: () => import('./pages/device-detail/device-detail.page').then(m => m.DeviceDetailPage)
  },
  {
    path: 'device/:id/measurements',
    loadComponent: () => import('./pages/measurements/measurements/measurements.page').then( m => m.MeasurementsPage)
  },
  // Dejar siempre al final
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

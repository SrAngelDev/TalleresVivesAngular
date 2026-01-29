import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FacturaComponent } from './components/factura/factura.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'factura', pathMatch: 'full' },
      { path: 'factura', component: FacturaComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];

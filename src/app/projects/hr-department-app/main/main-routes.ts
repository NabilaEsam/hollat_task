import { Route } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./main.component').then((c) => c.MainComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./beneficiaries/beneficiaries.component').then((c) => c.BeneficiariesComponent)
      }
    ]
  }
] as Route[];

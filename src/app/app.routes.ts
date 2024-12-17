import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthService } from './core/services/auth/auth.service';

export const routes: Routes = [
    { 
        path: '', 
        canActivate: [() => inject(AuthService).isLoggedIn()],
        // loadComponent: () => import('./projects/hr-department-app/main/beneficiaries/beneficiaries.component').then(c => c.BeneficiariesComponent) 
        loadChildren:()=>import('./projects/hr-department-app/main/main-routes').then(c=>c.default)
    },
/*
    { 
        path: '', 
        canActivate: [() => inject(AuthService).isLoggedIn()],
        loadComponent: () => import('./projects/hr-department-app/main/home/home.component').then(c => c.HomeComponent) 
    },
    */
    { 
        path: 'auth', 
        canActivate: [() => inject(AuthService).isNotLoggedIn()],
        loadChildren: () => import('./auth/auth-routes').then(c => c.default) 
    }
];

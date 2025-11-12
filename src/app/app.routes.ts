import { Routes } from '@angular/router';
import { Landing } from './landing/landing';
import { Footer } from './shared/footer/footer';
import { Header } from './shared/header/header';
import { Register } from './register/register';
import { PaymentForm } from './private/payment-form/payment-form';
import { Login } from './login/login';
import { AuthGuard } from './guards/guard-guard';
import { Dashboard } from './private/dashboard/dashboard';
import { Simulator } from './simulator/simulator';

export const routes: Routes = [
    {
        path: '',
        component: Landing
    },
    {
        path : 'register',
        component : Register
    },
    {
        path: 'payment-form',
        component: PaymentForm,
        canActivate: [AuthGuard] 
    }
    ,
     {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [AuthGuard] 
    }
    ,
     {
        path: 'simulator',
        component: Simulator
    }
    ,
    {
        path: 'login',
        component: Login
    }
];

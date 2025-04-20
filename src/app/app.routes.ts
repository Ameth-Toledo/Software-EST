import { Routes } from '@angular/router';
import { LandingComponent } from './modules/landing/landing.component';

export const routes: Routes = [
    { path: '', redirectTo: '', pathMatch: 'full' },
    { path: '', component: LandingComponent }
];

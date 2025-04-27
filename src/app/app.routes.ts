import { Routes } from '@angular/router';
import { LandingComponent } from './modules/landing/landing.component';
import { LoginComponent } from './modules/login/login.component';
import { HomeComponent } from './modules/home/home.component';
import { RegisterComponent } from './modules/register/register.component';
import { PerfilComponent } from './modules/perfil/perfil.component';
import { AuthCallbackComponent } from './modules/auth-callback/auth-callback.component';
import { NotfoundComponent } from './modules/notfound/notfound.component';
import { AddCourseComponent } from './modules/add-course/add-course.component';
import { SoporteTecnicoComponent } from './modules/soporte-tecnico/soporte-tecnico.component';

export const routes: Routes = [
    { path: '', redirectTo: '', pathMatch: 'full' },
    { path: '', component: LandingComponent },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'perfil', component: PerfilComponent },
    { path: 'auth-callback', component: AuthCallbackComponent },
    { path: 'add/course', component: AddCourseComponent },
    { path: 'soporte/tecnico', component: SoporteTecnicoComponent },
    { path: '**', component: NotfoundComponent }
];

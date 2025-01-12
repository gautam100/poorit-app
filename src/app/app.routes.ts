import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { SignUpComponent } from '../components/sign-up/sign-up.component';
import { InstructionsComponent } from '../components/instructions/instructions.component';
import { LayoutComponent } from '../components/layout/layout.component';
import { authGuard } from '../guards/auth.guard';
import { ExamComponent } from '../components/exam/exam.component';
import { PageNotFoundComponent } from '../components/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Poorit::Login',
  },
  {
    path: 'signup',
    component: SignUpComponent,
    title: 'Poorit::Signup',
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'instructions',
        component: InstructionsComponent,
        title: 'Poorit::Instructions',
        canActivate: [authGuard],
      },
      {
        path: 'exam',
        component: ExamComponent,
        title: 'Poorit::Test',
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

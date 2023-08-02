import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        '../app/features/components/login-signup/login-signup.component'
      ).then((c) => c.LoginSignupComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import(
        '../app/features/components/login-signup/login-signup.component'
      ).then((c) => c.LoginSignupComponent),
  },
  {
    path: 'homePage',
    loadComponent: () =>
      import('../app/features/components/home-page/home-page.component').then(
        (c) => c.HomePageComponent
      ),
  },
];

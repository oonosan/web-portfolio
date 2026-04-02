import { Routes } from '@angular/router';
import { Preview } from './projects/preview/preview';
import { Home } from './home/home';

export const routes: Routes = [
   { path: 'preview', component: Preview },
  { path: '', component: Home, pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
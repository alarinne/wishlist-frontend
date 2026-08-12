import { Routes } from '@angular/router';
import {WishListPage} from './features/wishes/pages/wish-list-page/wish-list-page';

export const routes: Routes = [
  {
    path: 'wishes',
    component: WishListPage
  },
  {
    path: '',
    redirectTo: 'wishes',
    pathMatch: 'full'
  }
];

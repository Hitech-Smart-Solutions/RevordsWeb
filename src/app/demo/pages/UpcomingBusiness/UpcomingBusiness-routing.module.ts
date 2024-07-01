import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpcomingBusinessComponent } from './UpcomingBusiness.components';

const routes: Routes = [
  {
    path: '',
    component: UpcomingBusinessComponent,
    data: {
      title: 'Upcoming Business'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpcomingBusinessRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewEntryComponent } from './new-entry/new-entry.component';
import { GetoppComponent } from './getopp/getopp.component';
import { ViewoppComponent } from './getopp/viewopp/viewopp.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { GetSalesLeadOppComponent } from './get-sales-lead-opp/get-sales-lead-opp.component';
import { GetBidsAwaitingApprovalComponent } from './get-bids-awaiting-approval/get-bids-awaiting-approval.component';
import { HomePageComponent } from './home-page/home-page.component';


const routes: Routes = [
  {
    path: 'ng/login',
    component: LoginComponent,
    pathMatch: 'full'
  },
  {
    path: 'ng/homePage',
    component: HomePageComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'ng/getOpp',
    component: GetoppComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'ng/getSLOpp',
    component: GetSalesLeadOppComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'ng/getAwaitingApprovalOpp',
    component: GetBidsAwaitingApprovalComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'ng/getOpp/:id',
    component: ViewoppComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'ng/new',
    component: NewEntryComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full'
  },
  {path: '**', redirectTo: 'ng/login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

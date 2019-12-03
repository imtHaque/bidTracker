import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NewEntryComponent } from './new-entry/new-entry.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GetoppComponent } from './getopp/getopp.component';
import { ViewoppComponent } from './getopp/viewopp/viewopp.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { GetSalesLeadOppComponent } from './get-sales-lead-opp/get-sales-lead-opp.component';
import { GetBidsAwaitingApprovalComponent } from './get-bids-awaiting-approval/get-bids-awaiting-approval.component';
import { HomePageComponent } from './home-page/home-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IgxToastModule } from 'igniteui-angular';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {PageFooterComponent} from './page-footer/page-footer.component';
import { ViewOpportunityComponent } from './view-opportunity/view-opportunity.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    NewEntryComponent,
    GetoppComponent,
    ViewoppComponent,
    LoginComponent,
    GetSalesLeadOppComponent,
    GetBidsAwaitingApprovalComponent,
    HomePageComponent,
    ViewOpportunityComponent,
    PageFooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IgxToastModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production, registrationStrategy: 'registerImmediately' })
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
}

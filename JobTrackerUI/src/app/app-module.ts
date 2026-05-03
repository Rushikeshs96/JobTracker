import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';

import { App } from './app';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { JobListComponent } from './components/job-list/job-list.component';
import { ContactsComponent } from './components/contacts/contacts/contacts.component';
import { InterviewsComponent } from './components/interviews/interviews/interviews.component';
import { NgxStripeModule } from 'ngx-stripe';
import { PaymentSuccessComponentComponent } from './components/stripe learn/stripe session/payment-success-component/payment-success-component.component';
import { PaymentFailedComponentComponent } from './components/stripe learn/stripe session/payment-failed-component/payment-failed-component.component';
import { StrpesessionComponent } from './components/stripe learn/stripe session/stripesession/strpesession.component';

@NgModule({
  declarations: [
    App,
    DashboardComponent,
    NavbarComponent,
    JobListComponent,
    ContactsComponent,
    InterviewsComponent,
    StrpesessionComponent,
    PaymentSuccessComponentComponent,
    PaymentFailedComponentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatCardModule,
    FormsModule,
    NgxStripeModule.forRoot(
      'pk_test_51TSvJu1LcOLLXsoi0hdv8LKU6qIz8XnD3vlz7fzf8eLEywl1AvOOxXxBDh0nSHWCSp4zLytAZ88EcvzkqVnbhelM00eK774fwk',
    ),
  ],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}

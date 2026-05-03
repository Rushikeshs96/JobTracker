import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { JobListComponent } from './components/job-list/job-list.component';
import { ContactsComponent } from './components/contacts/contacts/contacts.component';
import { InterviewsComponent } from './components/interviews/interviews/interviews.component';
import { PaymentSuccessComponentComponent } from './components/stripe learn/stripe session/payment-success-component/payment-success-component.component';
import { PaymentFailedComponentComponent } from './components/stripe learn/stripe session/payment-failed-component/payment-failed-component.component';
import { StrpesessionComponent } from './components/stripe learn/stripe session/stripesession/strpesession.component';
import { CheckoutComponent } from './components/stripe learn/stripe payment intent/checkout/checkout.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  { path: 'dashboard', component: DashboardComponent },
  { path: 'jobs', component: JobListComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'interviews', component: InterviewsComponent },
  { path: 'stripe-session', component: StrpesessionComponent },
  { path: 'payment-success', component: PaymentSuccessComponentComponent },
  { path: 'payment-failed', component: PaymentFailedComponentComponent },
  { path: 'checkout-v2', component: CheckoutComponent },
  { path: '**', redirectTo: '/dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

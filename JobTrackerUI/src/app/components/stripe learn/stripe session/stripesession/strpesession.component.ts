import { Component, signal } from '@angular/core';
import { StripeService } from '../../../../services/stripe/stripe.service';

@Component({
  selector: 'app-strpesession',
  standalone: false,
  templateUrl: './strpesession.component.html',
  styleUrl: './strpesession.component.css',
})
export class StrpesessionComponent {
  protected readonly title = signal('JobTrackerUI');

  constructor(private stripeService: StripeService) {}

  onCheckout() {
    this.stripeService.startCheckoutSession().subscribe({
      next: (response) => {
        window.location.href = response.url;
      },
      error: (err) => {
        console.error('Checkout error:', err);
        alert('Failed to start checkout. Check if your .NET API is running.');
      },
    });
  }
}

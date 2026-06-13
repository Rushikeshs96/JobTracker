import { Component } from '@angular/core';
import { StripeApiService } from '../../../../services/stripe/stripe.service';

@Component({
  selector: 'app-pricing',
  standalone: false,
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.css',
})
export class PricingComponent {
  userEmail = 'test@example.com';
  userStripeId = 'cus_USiEbZrpvVf6Rr';
  currentUserId = 'user_abc_123';

  // Define your plans here. Replace Price IDs with yours from Stripe Dashboard
  plans = [
    {
      name: 'Basic',
      price: 250,
      priceId: 'price_1TTmJ81LcOLLXsoi32A7Dsgb', // Free or cheap
      features: ['5 Job Applications', 'Email Support', 'Basic Dashboard'],
    },
    {
      name: 'Standard',
      price: 350,
      priceId: 'price_1TTmXr1LcOLLXsoiAvhaQx7w', // Your existing ID
      features: [
        '50 Job Applications',
        'Priority Support',
        'Advanced Analytics',
      ],
    },
    {
      name: 'Advanced',
      price: 25,
      priceId: 'price_1TTmYB1LcOLLXsoiYyD3pQGD',
      features: ['Unlimited Applications', '24/7 Support', 'Custom Export'],
    },
  ];

  constructor(private stripeService: StripeApiService) {}

  subscribe(plan: any) {
    this.stripeService.redirectToSubscription(
      this.userEmail,
      plan.priceId,
      this.currentUserId,
      plan.name,
    );
  }

  manage() {
    this.stripeService.goToBillingPortal(this.userStripeId);
  }
}

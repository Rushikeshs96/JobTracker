using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;

namespace JobTrackerUI.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubscriptionController : ControllerBase
    {
        private readonly IConfiguration _config;

        public SubscriptionController(IConfiguration config)
        {
            _config = config;
        }

        [HttpPost("create-checkout-session")]
        public async Task<IActionResult> CreateCheckoutSession([FromBody] CreateSessionRequest request)
        {
            var domain = "http://localhost:4200";

            var options = new SessionCreateOptions
            {
                CustomerEmail = request.Email,
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        Price = request.PriceId,
                        Quantity = 1,
                    },
                },
                Mode = "subscription",
                SuccessUrl = domain + "/payment-success?session_id={CHECKOUT_SESSION_ID}",
                CancelUrl = domain + "/payment-failed",

                // --- ADD METADATA HERE ---
                // This metadata will be attached to the Checkout Session
                Metadata = new Dictionary<string, string>
                {
                    { "AppUserId", request.UserId },
                    { "PlanType", request.PlanName }
                },

                // This ensures the metadata is also copied to the Subscription object itself
                SubscriptionData = new SessionSubscriptionDataOptions
                {
                    Metadata = new Dictionary<string, string>
                    {
                        { "AppUserId", request.UserId },
                        { "PlanType", request.PlanName }
                    }
                }
            };

            var service = new SessionService();
            Session session = await service.CreateAsync(options);

            return Ok(new { url = session.Url });
        }

        [HttpPost("create-portal-session")]
        public async Task<IActionResult> CreatePortalSession([FromBody] PortalRequest request)
        {
            // IMPORTANT: In production, fetch the StripeCustomerId from your Database 
            // using the logged-in user's ID.
            var options = new Stripe.BillingPortal.SessionCreateOptions
            {
                Customer = request.StripeCustomerId,
                ReturnUrl = "http://localhost:4200/dashboard",
            };

            var service = new Stripe.BillingPortal.SessionService();
            var session = await service.CreateAsync(options);

            return Ok(new { url = session.Url });
        }
    }

    public class CreateSessionRequest
    {
        public string Email { get; set; }
        public string PriceId { get; set; }
        public string UserId { get; set; } // New field
        public string PlanName { get; set; } // New field
    }
    public class PortalRequest { public string StripeCustomerId { get; set; } }
}
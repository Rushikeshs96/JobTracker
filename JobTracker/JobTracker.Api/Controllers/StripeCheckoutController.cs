using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Stripe.Checkout;

namespace JobTracker.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StripeCheckoutController : ControllerBase
    {
        [HttpPost("create-session")]
        public async Task<IActionResult> CreateCheckoutSession()
        {
            var domain = "http://localhost:4200";

            var option = new SessionCreateOptions
            {
                SuccessUrl = domain + "/payment-success",
                CancelUrl = domain + "/payment-failed",

                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            UnitAmount = 2500, // $25.00
                            Currency = "usd",
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = "Job Tracker Premium",
                                Description = "Full access to all job tracking features",
                            },
                        },
                        Quantity = 1,
                    }
                },

                Mode = "payment",
            };

            var service = new SessionService();
            Session session = await service.CreateAsync(option);

            return Ok(new { url = session.Url });


        }
    }
}

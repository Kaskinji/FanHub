using Application.Dto.SubscriptionDto;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Route( "/api/subscriptions" )]
    [ApiController]
    public class SubscriptionController : ControllerBase
    {
        private ISubscriptionService _subscriptionService;

        public SubscriptionController( ISubscriptionService subscriptionService )
        {
            _subscriptionService = subscriptionService;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<SubscriptionReadDto>>> GetSubscriptions()
        {
            IReadOnlyList<SubscriptionReadDto> subscriptions = await _subscriptionService.GetAll();

            return Ok( subscriptions );
        }

        [Authorize]
        [HttpGet( "{id}" )]
        public async Task<ActionResult<SubscriptionReadDto>> GetSubscriptionById( int id )
        {
            SubscriptionReadDto subscription = await _subscriptionService.GetById( id );

            return Ok( subscription );
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<int>> CreateSubscription( [FromBody] SubscriptionCreateDto dto )
        {
            int id = await _subscriptionService.Create( dto );

            return Ok( id );
        }

        [Authorize]
        [HttpDelete( "{id}" )]
        public async Task<IActionResult> DeleteSubscription( int id )
        {
            await _subscriptionService.DeleteAsync( id );

            return Ok();
        }
    }
}

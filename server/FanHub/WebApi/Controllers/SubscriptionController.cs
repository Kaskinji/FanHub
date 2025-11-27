using Application.Dto.SubscriptionDto;
using Application.Services.Interfaces;
using Domain.Foundations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Route( "/api/subscriptions" )]
    [ApiController]
    public class SubscriptionController : ControllerBase
    {
        private ISubscriptionService _subscriptionService;
        private IUnitOfWork _unitOfWork;

        public SubscriptionController( ISubscriptionService subscriptionService, IUnitOfWork unitOfWork )
        {
            _subscriptionService = subscriptionService;
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<ActionResult<List<SubscriptionReadDto>>> GetSubscriptions()
        {
            IReadOnlyList<SubscriptionReadDto> subscriptions = await _subscriptionService.GetAll();

            return Ok( subscriptions );
        }

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

            await _unitOfWork.CommitAsync();

            return Ok( id );
        }

        [Authorize]
        [HttpDelete( "{id}" )]
        public async Task<IActionResult> DeleteSubscription( int id )
        {
            await _subscriptionService.DeleteAsync( id );

            await _unitOfWork.CommitAsync();

            return Ok();
        }
    }
}

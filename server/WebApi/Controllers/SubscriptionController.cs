using Application.Dto.SubscriptionDto;
using Application.Services.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Extensions;

namespace WebApi.Controllers
{
    [Route( "/api/subscriptions" )]
    [ApiController]
    public class SubscriptionController : ControllerBase
    {
        private ISubscriptionService _subscriptionService;
        private IMapper _mapper;

        public SubscriptionController( ISubscriptionService subscriptionService, IMapper mapper )
        {
            _subscriptionService = subscriptionService;
            _mapper = mapper;
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
        public async Task<ActionResult<int>> CreateSubscription( [FromBody] WebApi.Contracts.SubscriptionDto.SubscriptionCreateDto dto )
        {
            SubscriptionCreateDto createDto = _mapper.Map<SubscriptionCreateDto>( dto );

            createDto.UserId = this.GetCurrentUserId();

            int id = await _subscriptionService.Create( createDto );

            return Ok( id );
        }

        [Authorize]
        [HttpGet( "current/{fandomId}" )]
        public async Task<ActionResult<int?>> GetCurrentUserSubscriptionId( [FromRoute] int fandomId )
        {
            int userId = this.GetCurrentUserId();

            int? id = await _subscriptionService.GetSubscription( fandomId, userId );

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

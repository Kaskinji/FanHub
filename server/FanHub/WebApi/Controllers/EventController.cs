using Application.Dto.EventDto;
using Application.Services.Interfaces;
using Domain.Foundations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Controllers.Attributes;

namespace WebApi.Controllers
{
    [Route( "/api/events" )]
    [ApiController]
    public class EventController : ControllerBase
    {
        private IEventService _eventService;
        private IUnitOfWork _unitOfWork;

        public EventController( IEventService EventService, IUnitOfWork unitOfWork )
        {
            _eventService = EventService;
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<ActionResult<List<EventReadDto>>> GetEvents()
        {
            IReadOnlyList<EventReadDto> events = await _eventService.GetAll();

            return Ok( events );
        }

        [HttpGet( "{id}" )]
        public async Task<ActionResult<EventReadDto>> GetEventById( int id )
        {
            EventReadDto @event = await _eventService.GetById( id );
            return Ok( @event );
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<int>> CreateEvent( [FromBody] EventCreateDto dto )
        {
            int id = await _eventService.Create( dto );

            await _unitOfWork.CommitAsync();

            return Ok( id );
        }

        [Authorize]
        [HttpPut( "{id}" )]
        public async Task<IActionResult> UpdateEvent( int id, [FromBody] EventUpdateDto dto )
        {
            await _eventService.Update( id, dto );

            await _unitOfWork.CommitAsync();

            return Ok();
        }

        [Authorize]
        [HttpDelete( "{id}" )]
        public async Task<IActionResult> DeleteEvent( int id )
        {
            await _eventService.DeleteAsync( id );

            await _unitOfWork.CommitAsync();

            return Ok();
        }
    }
}

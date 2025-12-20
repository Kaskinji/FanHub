using Application.Dto.EventDto;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Route( "/api/events" )]
    [ApiController]
    public class EventController : ControllerBase
    {
        private IEventService _eventService;

        public EventController( IEventService EventService )
        {
            _eventService = EventService;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<EventReadDto>>> GetEvents()
        {
            IReadOnlyList<EventReadDto> events = await _eventService.GetAll();

            return Ok( events );
        }
        [Authorize]
        [HttpGet( "fandom/{fandomId}" )]
        public async Task<ActionResult<List<EventReadDto>>> GetEventsByFandomId(
            [FromRoute] int fandomId )
        {
            IReadOnlyList<EventReadDto> events = await _eventService.GetEventsByFandomIdAsync( fandomId );

            return Ok( events );
        }

        [Authorize]
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

            return Ok( id );
        }

        [Authorize]
        [HttpPut( "{id}" )]
        public async Task<IActionResult> UpdateEvent( int id, [FromBody] EventUpdateDto dto )
        {
            await _eventService.Update( id, dto );

            return Ok();
        }

        [Authorize]
        [HttpDelete( "{id}" )]
        public async Task<IActionResult> DeleteEvent( int id )
        {
            await _eventService.DeleteAsync( id );

            return Ok();
        }
    }
}

using Application.Dto.EventDto;
using Domain.Entities;
using Domain.Enums;

namespace Application.Services.Interfaces
{
    public interface IEventService : IBaseService<Event, EventCreateDto, EventReadDto, EventUpdateDto>
    {
        Task<List<Event>> GetUpcomingEventsAsync( int daysAhead = 30 );

        Task<List<Event>> GetEventsByFandomAsync( int fandomId );

        Task<List<Event>> GetEventsByOrganizerAsync( int organizerId );
        Task<List<Event>> SearchEventsAsync( string searchTerm );
    }
}

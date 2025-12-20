using Application.Dto.EventDto;
using Domain.Entities;

namespace Application.Services.Interfaces
{
    public interface IEventService : IBaseService<Event, EventCreateDto, EventReadDto, EventUpdateDto>
    {
        Task<List<EventReadDto>> GetEventsByFandomIdAsync( int fandomId );

    }
}

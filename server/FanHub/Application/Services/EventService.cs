using Application.Services.Interfaces;
using Application.Dto.EventDto;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using FluentValidation;
using Domain.Extensions;
using Microsoft.Extensions.Logging;
using Domain.Foundations;

namespace Application.Services
{
    public class EventService : BaseService<Event, EventCreateDto, EventReadDto, EventUpdateDto>, IEventService
    {
        private readonly IEventRepository _eventRepository;
        private readonly IUserRepository _userRepository;
        private readonly IFandomRepository _fandomRepository;
        public EventService( IEventRepository repository,
            IUserRepository userRepository,
            IFandomRepository fandomRepository,
            IMapper mapper,
            IValidator<Event> validator,
            ILogger<EventService> logger,
            IUnitOfWork unitOfWork )
        : base( repository, mapper, validator, logger, unitOfWork )
        {
            _eventRepository = repository;
            _userRepository = userRepository;
            _fandomRepository = fandomRepository;
        }

        public async Task<List<Event>> GetUpcomingEventsAsync( int daysAhead = 30 )
        {
            return await _eventRepository.FindAllAsync( e =>
                e.StartDate >= DateTime.UtcNow &&
                e.StartDate <= DateTime.UtcNow.AddDays( daysAhead ) );
        }

        public async Task<List<Event>> GetEventsByFandomAsync( int fandomId )
        {
            return await _eventRepository.FindAllAsync( e => e.FandomId == fandomId );
        }

        public async Task<List<Event>> GetEventsByOrganizerAsync( int organizerId )
        {
            return await _eventRepository.FindAllAsync( e => e.OrganizerId == organizerId );
        }

        public async Task<List<Event>> SearchEventsAsync( string searchTerm )
        {
            return await _eventRepository.FindAllAsync( e =>
                e.Title.Contains( searchTerm ) || e.Description.Contains( searchTerm ) );
        }

        protected override async Task ExistEntities( Event eventEntity )
        {
            await _fandomRepository.GetByIdAsyncThrow( eventEntity.FandomId );

            await _userRepository.GetByIdAsyncThrow( eventEntity.OrganizerId );
        }
    }
}

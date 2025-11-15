using Application.Services.Interfaces;
using Application.Dto.EventDto;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using FluentValidation;
using Domain.Enums;
using Domain.Extensions;

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
            IValidator<Event> validator )
        : base( repository, mapper, validator )
        {
            _eventRepository = repository;
            _userRepository = userRepository;
            _fandomRepository = fandomRepository;
        }

        public override async Task<int> Create( EventCreateDto dto )
        {
            if ( dto.StartDate >= dto.EndDate )
            {
                throw new ValidationException( "Дата начала должна быть раньше даты окончания" );
            }

            if ( dto.StartDate <= DateTime.UtcNow )
            {
                throw new ValidationException( "Дата начала должна быть в будущем" );
            }

            return await base.Create( dto );
        }

        public override async Task Update( int id, EventUpdateDto dto )
        {
            if ( dto.StartDate.HasValue && dto.EndDate.HasValue )
            {
                if ( dto.StartDate.Value >= dto.EndDate.Value )
                {
                    throw new ValidationException( "Дата начала должна быть раньше даты окончания" );
                }
            }

            await base.Update( id, dto );
        }

        protected override async Task ExistEntities( Event eventEntity )
        {
            await _fandomRepository.GetByIdAsyncThrow( eventEntity.FandomId );

            await _userRepository.GetByIdAsyncThrow( eventEntity.OrganizerId );
        }
        //можно ли удалять активное событие?

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
    }
}

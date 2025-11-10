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
        public EventService( IEventRepository repository,
            IUserRepository userRepository,
            IFandomService eventService,
            IMapper mapper,
            IValidator<Event> validator )
        : base( repository, mapper, validator ) { }

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

            int eventId = await base.Create( dto );

            Event createdEvent = await _repository.GetByIdAsync( eventId );

            createdEvent.Status = EventStatus.Upcoming;
            createdEvent.StartDate = dto.StartDate;
            createdEvent.EndDate = dto.EndDate;

            _repository.Update( createdEvent );

            return eventId;
        }

        public override async Task Update( int id, EventUpdateDto dto )
        {
            Event existingEvent = await _repository.GetByIdAsyncThrow( id );

            if ( dto.StartDate.HasValue && dto.EndDate.HasValue )
            {
                if ( dto.StartDate.Value >= dto.EndDate.Value )
                {
                    throw new ValidationException( "Дата начала должна быть раньше даты окончания" );
                }
            }

            if ( existingEvent.Status != EventStatus.Upcoming )
            {
                throw new ValidationException( "Можно редактировать только запланированные события" );
            }

            await base.Update( id, dto );
        }

        protected override async Task ExistEntities( Event eventEntity )
        {
            await _repository.GetByIdAsyncThrow( eventEntity.FandomId );

            await _userRepository.GetByIdAsyncThrow( eventEntity.OrganizerId );

        }
        //можно ли удалять активное событие?

        public async Task<List<Event>> GetUpcomingEventsAsync( int daysAhead = 30 )
        {
            return await _repository.FindAllAsync( e =>
                e.StartDate >= DateTime.UtcNow &&
                e.StartDate <= DateTime.UtcNow.AddDays( daysAhead ) );
        }
        //можно добавить для Ongoing и Ivent тоже, мб     

        public async Task<List<Event>> GetEventsByFandomAsync( int fandomId )
        {
            return await _repository.FindAllAsync( e => e.FandomId == fandomId );
        }

        public async Task<List<Event>> GetEventsByOrganizerAsync( int organizerId )
        {
            return await _repository.FindAllAsync( e => e.OrganizerId == organizerId );
        }

        public async Task<List<Event>> SearchEventsAsync( string searchTerm )
        {
            return await _repository.FindAllAsync( e =>
                e.Title.Contains( searchTerm ) || e.Description.Contains( searchTerm ) );
        }

        public async Task<List<Event>> GetEventsByStatusAsync( EventStatus status )
        {
            return await _repository.FindAllAsync( e => e.Status == status );
        }

        private IUserRepository _userRepository;
    }
}

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

        public override async Task<List<EventReadDto>> GetAll()
        {
            List<Event> events = await _eventRepository.GetAllWithStatsAsync();

            return _mapper.Map<List<EventReadDto>>( events );
        }
        public async Task<List<EventReadDto>> GetEventsByFandomIdAsync( int fandomId )
        {
            List<Event> events = await _eventRepository.GetEventsByFandomIdAsync( fandomId );

            return _mapper.Map<List<EventReadDto>>( events );
        }

        protected override async Task ExistEntities( Event eventEntity )
        {
            await _fandomRepository.GetByIdAsyncThrow( eventEntity.FandomId );

            await _userRepository.GetByIdAsyncThrow( eventEntity.OrganizerId );
        }
    }
}

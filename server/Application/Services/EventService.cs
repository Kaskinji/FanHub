using Application.Services.Interfaces;
using Application.Dto.EventDto;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using FluentValidation;
using Domain.Extensions;
using Microsoft.Extensions.Logging;
using Domain.Foundations;
using Application.Tools;
using Application.Dto.NotificationDto;
using Domain.Enums;

namespace Application.Services
{
    public class EventService : BaseService<Event, EventCreateDto, EventReadDto, EventUpdateDto>, IEventService
    {
        private readonly IEventRepository _eventRepository;
        private readonly IUserRepository _userRepository;
        private readonly IFandomService _fandomService;
        private readonly IImageTools _imageTools;
        private readonly INotificationRepository _notificationRepository;
        private readonly INotificationViewedRepository _notificationViewedRepository;

        public EventService( IEventRepository repository,
            IUserRepository userRepository,
            IFandomService fandomService,
            IMapper mapper,
            IValidator<Event> validator,
            ILogger<EventService> logger,
            IUnitOfWork unitOfWork,
            IImageTools imageTools,
            INotificationRepository notificationRepository,
            INotificationViewedRepository notificationViewedRepository )
        : base( repository, mapper, validator, logger, unitOfWork )
        {
            _eventRepository = repository;
            _userRepository = userRepository;
            _fandomService = fandomService;
            _imageTools = imageTools;
            _notificationRepository = notificationRepository;
            _notificationViewedRepository = notificationViewedRepository;
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
            await _fandomService.CheckCreator( eventEntity.OrganizerId, eventEntity.FandomId );

            await _userRepository.GetByIdAsyncThrow( eventEntity.OrganizerId );
        }

        protected override async Task CleanupBeforeUpdate( Event entity, EventUpdateDto updateDto )
        {
            if ( entity.ImageUrl != updateDto.ImageUrl && !string.IsNullOrEmpty( entity.ImageUrl ) )
            {
                await _imageTools.TryDeleteImageAsync( entity.ImageUrl );
            }
        }

        protected override async Task CleanupBeforeDelete( Event entity )
        {
            if ( !string.IsNullOrEmpty( entity.ImageUrl ) )
            {
                await _imageTools.TryDeleteImageAsync( entity.ImageUrl );
            }

            List<FandomNotification> notifications = await _notificationRepository.FindAllAsync( 
                n => n.NotifierId == entity.Id && n.Type == FandomNotificationType.NewEvent );
            
            List<NotificationViewed> allVieweds = new();
            foreach ( FandomNotification notification in notifications )
            {
                List<NotificationViewed> vieweds = await _notificationViewedRepository
                    .GetViewedNotificationsByNotificationIdAsync( notification.Id );
                allVieweds.AddRange( vieweds );
            }

            if ( allVieweds.Count > 0 )
            {
                await _notificationViewedRepository.BulkDeleteAsync( allVieweds );
            }

            foreach ( FandomNotification notification in notifications )
            {
                _notificationRepository.Delete( notification );
            }
        }

        protected override async Task AfterCreate( Event entity )
        {
            await _fandomService.Notify( new FandomNotificationCreateDto
            {
                FandomId = entity.FandomId,
                NotifierId = entity.Id,
                Type = FandomNotificationType.NewEvent,
            } );
        }
    }
}

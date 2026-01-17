using Application.Dto.NotificationDto;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Extensions;
using Domain.Foundations;
using Domain.Repositories;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Application.Services
{
    public class FandomNotificationService : BaseService<FandomNotification, FandomNotificationCreateDto, FandomNotificationReadDto, FandomNotificationUpdateDto>, IFandomNotificationService
    {
        private readonly INotificationRepository _notificationRepository;
        private readonly ISubscriptionRepository _subscriptionRepository;
        private readonly INotificationHubService _notificationHubService;
        private readonly INotificationViewedRepository _notificationViewedRepository;

        public FandomNotificationService( INotificationRepository NotificationRepository,
            IUserRepository UserRepository,
            IPostRepository PostRepository,
            IEventRepository eventRepository,
            ISubscriptionRepository subscriptionRepository,
            INotificationHubService notificationHubService,
            INotificationViewedRepository notificationViewedRepository,
            IMapper mapper,
            IValidator<FandomNotification> validator,
            ILogger<FandomNotificationService> logger,
            IUnitOfWork unitOfWork ) : base( NotificationRepository, mapper, validator, logger, unitOfWork )
        {
            _notificationRepository = NotificationRepository;
            _subscriptionRepository = subscriptionRepository;
            _notificationHubService = notificationHubService;
            _notificationViewedRepository = notificationViewedRepository;
        }

        public async Task<List<FandomNotificationReadDto>> GetNotificationsByFandomIdAsync( int fandomId )
        {
            List<FandomNotification> notifications = await _notificationRepository.GetNotificationsByFandomIdAsync( fandomId );

            return _mapper.Map<List<FandomNotificationReadDto>>( notifications );
        }

        public async Task<List<FandomNotificationReadDto>> GetNotificationsByUserSubscriptionsAsync( int userId )
        {
            List<Subscription> subscriptions = await _subscriptionRepository.GetSubscriptionsByUserIdAsync( userId );

            if ( subscriptions.Count == 0 )
            {
                return new List<FandomNotificationReadDto>();
            }

            List<int> fandomIds = subscriptions.Select( s => s.FandomId ).ToList();
            List<FandomNotification> notifications = await _notificationRepository.GetNotificationsByFandomIdsAsync( fandomIds );

            return _mapper.Map<List<FandomNotificationReadDto>>( notifications );
        }

        public async Task Notify( FandomNotificationCreateDto dto )
        {
            await Create( dto );
        }

        protected override async Task AfterCreate( FandomNotification entity )
        {
            await base.AfterCreate( entity );

            FandomNotificationReadDto notificationDto = _mapper.Map<FandomNotificationReadDto>( entity );

            List<Subscription> subscriptions = await _subscriptionRepository.GetSubscriptionsByFandomAsync( entity.FandomId );
            List<int> userIds = subscriptions.Select( s => s.UserId ).ToList();

            if ( userIds.Count > 0 )
            {
                await _notificationHubService.SendNotificationToUsersAsync( userIds, notificationDto );
            }
        }

        protected override async Task CleanupBeforeDelete( FandomNotification entity )
        {
            // Удаляем все просмотры этого уведомления
            List<NotificationViewed> vieweds = await _notificationViewedRepository.GetViewedNotificationsByNotificationIdAsync( entity.Id );
            
            if ( vieweds.Count > 0 )
            {
                await _notificationViewedRepository.BulkDeleteAsync( vieweds );
            }
        }
    }
}

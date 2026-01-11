using Application.Dto.NotificationDto;
using Application.Dto.NotificationViewedDto;
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
    public class NotificationViewedService : BaseService<NotificationViewed, NotificationViewedCreateDto, NotificationViewedReadDto, NotificationViewedUpdateDto>, INotificationViewedService
    {
        private readonly INotificationViewedRepository _notificationViewedRepository;
        private readonly INotificationRepository _notificationRepository;
        private readonly IUserRepository _userRepository;
        private readonly IFandomNotificationService _fandomNotificationService;
        private readonly ISubscriptionRepository _subscriptionRepository;

        public NotificationViewedService(
            INotificationViewedRepository repository,
            INotificationRepository notificationRepository,
            IUserRepository userRepository,
            IFandomNotificationService fandomNotificationService,
            ISubscriptionRepository subscriptionRepository,
            IMapper mapper,
            IValidator<NotificationViewed> validator,
            ILogger<NotificationViewedService> logger,
            IUnitOfWork unitOfWork )
            : base( repository, mapper, validator, logger, unitOfWork )
        {
            _notificationViewedRepository = repository;
            _notificationRepository = notificationRepository;
            _userRepository = userRepository;
            _fandomNotificationService = fandomNotificationService;
            _subscriptionRepository = subscriptionRepository;
        }

        public async Task<List<NotificationViewedReadDto>> GetViewedNotificationsByUserIdAsync( int userId )
        {
            List<NotificationViewed> entities = await _notificationViewedRepository
                .GetViewedNotificationsByUserIdAsync( userId );

            List<Subscription> subscriptions = await _subscriptionRepository.GetSubscriptionsByUserIdAsync( userId );
            Dictionary<int, DateTime> subscriptionDates = subscriptions.ToDictionary( s => s.FandomId, s => s.Date );

            List<NotificationViewed> filteredEntities = entities
                .Where( nv => subscriptionDates.ContainsKey( nv.Notification.FandomId ) &&
                              nv.Notification.CreatedAt >= subscriptionDates[nv.Notification.FandomId] )
                .ToList();

            return _mapper.Map<List<NotificationViewedReadDto>>( filteredEntities );
        }

        public async Task<List<NotificationViewedReadDto>> GetViewedNotificationsByUserIdAsync( int userId, bool? isHidden )
        {
            List<NotificationViewed> entities = await _notificationViewedRepository
                .GetViewedNotificationsByUserIdAsync( userId, isHidden );

            List<Subscription> subscriptions = await _subscriptionRepository.GetSubscriptionsByUserIdAsync( userId );
            Dictionary<int, DateTime> subscriptionDates = subscriptions.ToDictionary( s => s.FandomId, s => s.Date );

            List<NotificationViewed> filteredEntities = entities
                .Where( nv => subscriptionDates.ContainsKey( nv.Notification.FandomId ) &&
                              nv.Notification.CreatedAt >= subscriptionDates[nv.Notification.FandomId] )
                .ToList();

            return _mapper.Map<List<NotificationViewedReadDto>>( filteredEntities );
        }

        public async Task<List<NotificationViewedReadDto>> GetViewedNotificationsByNotificationIdAsync( int notificationId )
        {
            List<NotificationViewed> entities = await _notificationViewedRepository
                .GetViewedNotificationsByNotificationIdAsync( notificationId );

            return _mapper.Map<List<NotificationViewedReadDto>>( entities );
        }

        public async Task<bool> IsNotificationViewedByUserAsync( int notificationId, int userId )
        {
            NotificationViewed? viewed = await _notificationViewedRepository
                .FindByNotificationAndUserAsync( notificationId, userId );

            return viewed is not null;
        }

        public async Task MarkNotificationsAsViewedAsync( int userId, List<int> notificationIds )
        {
            if ( !ValidateInput( notificationIds ) )
            {
                return;
            }

            await ValidateUserAndNotificationsAsync( userId, notificationIds );

            List<int> newNotificationIds = await GetNewNotificationIdsAsync( userId, notificationIds );

            if ( newNotificationIds.Count == 0 )
            {
                _logger.LogTrace( $"All notifications are already viewed by user {userId}" );
                return;
            }

            List<NotificationViewed> newVieweds = await CreateAndValidateViewedsAsync( userId, newNotificationIds );

            await _notificationViewedRepository.BulkInsertAsync( newVieweds );
            _logger.LogTrace( $"Marked {newVieweds.Count} notifications as viewed for user {userId}" );
            await _unitOfWork.CommitAsync();
        }

        public async Task UnmarkNotificationsAsViewedAsync( int userId, List<int> notificationIds )
        {
            if ( !ValidateInput( notificationIds ) )
            {
                return;
            }

            await _userRepository.GetByIdAsyncThrow( userId );

            List<NotificationViewed> viewedsToDelete = await _notificationViewedRepository
                .FindAllAsync( nv => nv.UserId == userId && notificationIds.Contains( nv.NotificationId ) );

            if ( viewedsToDelete.Count == 0 )
            {
                _logger.LogTrace( $"No viewed notifications found to unmark for user {userId}" );
                return;
            }

            await _notificationViewedRepository.BulkDeleteAsync( viewedsToDelete );
            _logger.LogTrace( $"Unmarked {viewedsToDelete.Count} notifications as viewed for user {userId}" );
            await _unitOfWork.CommitAsync();
        }

        protected override NotificationViewed InitializeEntity( NotificationViewedCreateDto dto )
        {
            NotificationViewed entity = new();
            entity.ViewedAt = DateTime.UtcNow;
            return entity;
        }

        protected override async Task CheckUnique( NotificationViewed entity )
        {
            NotificationViewed? existing = await _notificationViewedRepository
                .FindByNotificationAndUserAsync( entity.NotificationId, entity.UserId );

            if ( existing is not null && existing.Id != entity.Id )
            {
                throw new InvalidOperationException( "Это уведомление уже было просмотрено данным пользователем" );
            }
        }

        protected override async Task ExistEntities( NotificationViewed entity )
        {
            await _notificationRepository.GetByIdAsyncThrow( entity.NotificationId );
            await _userRepository.GetByIdAsyncThrow( entity.UserId );
        }

        private bool ValidateInput( List<int>? notificationIds )
        {
            return notificationIds is not null && notificationIds.Count > 0;
        }

        private async Task ValidateUserAndNotificationsAsync( int userId, List<int> notificationIds )
        {
            await _userRepository.GetByIdAsyncThrow( userId );

            foreach ( int notificationId in notificationIds )
            {
                await _notificationRepository.GetByIdAsyncThrow( notificationId );
            }
        }

        private async Task<List<int>> GetNewNotificationIdsAsync( int userId, List<int> notificationIds )
        {
            List<NotificationViewed> existingVieweds = await _notificationViewedRepository
                .FindAllAsync( nv => nv.UserId == userId && notificationIds.Contains( nv.NotificationId ) );

            HashSet<int> alreadyViewedIds = existingVieweds.Select( ev => ev.NotificationId ).ToHashSet();

            return notificationIds
                .Where( id => !alreadyViewedIds.Contains( id ) )
                .ToList();
        }

        private async Task<List<NotificationViewed>> CreateAndValidateViewedsAsync( int userId, List<int> notificationIds )
        {
            List<NotificationViewed> newVieweds = notificationIds.Select( notificationId => new NotificationViewed
            {
                NotificationId = notificationId,
                UserId = userId,
                ViewedAt = DateTime.UtcNow
            } ).ToList();

            foreach ( NotificationViewed entity in newVieweds )
            {
                await _validator.ValidateAndThrowAsync( entity );
            }

            return newVieweds;
        }

        public async Task HideNotificationsAsync( int userId, List<int> notificationIds )
        {
            if ( !ValidateInput( notificationIds ) )
            {
                return;
            }

            await _userRepository.GetByIdAsyncThrow( userId );

            List<NotificationViewed> viewedsToHide = await _notificationViewedRepository
                .FindAllAsync( nv => nv.UserId == userId && notificationIds.Contains( nv.NotificationId ) && !nv.IsHidden );

            if ( viewedsToHide.Count == 0 )
            {
                _logger.LogTrace( $"No unhidden viewed notifications found for user {userId}" );
                return;
            }

            foreach ( NotificationViewed viewed in viewedsToHide )
            {
                viewed.IsHidden = true;
            }

            await _notificationViewedRepository.BulkUpdateAsync( viewedsToHide );
            _logger.LogTrace( $"Hidden {viewedsToHide.Count} notifications for user {userId}" );
            await _unitOfWork.CommitAsync();
        }

        public async Task UnhideNotificationsAsync( int userId, List<int> notificationIds )
        {
            if ( !ValidateInput( notificationIds ) )
            {
                return;
            }

            await _userRepository.GetByIdAsyncThrow( userId );

            List<NotificationViewed> viewedsToUnhide = await _notificationViewedRepository
                .FindAllAsync( nv => nv.UserId == userId && notificationIds.Contains( nv.NotificationId ) && nv.IsHidden );

            if ( viewedsToUnhide.Count == 0 )
            {
                _logger.LogTrace( $"No hidden viewed notifications found for user {userId}" );
                return;
            }

            foreach ( NotificationViewed viewed in viewedsToUnhide )
            {
                viewed.IsHidden = false;
            }

            await _notificationViewedRepository.BulkUpdateAsync( viewedsToUnhide );
            _logger.LogTrace( $"Unhidden {viewedsToUnhide.Count} notifications for user {userId}" );
            await _unitOfWork.CommitAsync();
        }

        public async Task<List<NotificationWithViewedDto>> GetNotificationsWithViewedAsync( int userId, bool? isHidden = null )
        {
            await _userRepository.GetByIdAsyncThrow( userId );

            List<FandomNotificationReadDto> notifications = await _fandomNotificationService.GetNotificationsByUserSubscriptionsAsync( userId );
            List<NotificationViewed> viewedNotifications = await _notificationViewedRepository
                .FindAllAsync( nv => nv.UserId == userId );

            Dictionary<int, NotificationViewed> viewedDict = viewedNotifications
                .ToDictionary( v => v.NotificationId, v => v );

            List<Subscription> subscriptions = await _subscriptionRepository.GetSubscriptionsByUserIdAsync( userId );
            Dictionary<int, DateTime> subscriptionDates = subscriptions.ToDictionary( s => s.FandomId, s => s.Date );

            List<NotificationWithViewedDto> result = new();

            foreach ( FandomNotificationReadDto notification in notifications )
            {
                if ( !subscriptionDates.ContainsKey( notification.FandomId ) ||
                     notification.CreatedAt < subscriptionDates[notification.FandomId] )
                {
                    continue;
                }

                viewedDict.TryGetValue( notification.Id, out NotificationViewed? viewed );

                if ( isHidden.HasValue )
                {
                    if ( viewed is null && isHidden.Value )
                    {
                        continue;
                    }

                    if ( viewed is not null && viewed.IsHidden != isHidden.Value )
                    {
                        continue;
                    }
                }

                NotificationWithViewedDto dto = new()
                {
                    Id = notification.Id,
                    FandomId = notification.FandomId,
                    NotifierId = notification.NotifierId,
                    CreatedAt = notification.CreatedAt,
                    Type = notification.Type,
                    NotificationViewedId = viewed?.Id,
                    ViewedAt = viewed?.ViewedAt,
                    IsHidden = viewed?.IsHidden ?? false,
                    IsViewed = viewed is not null
                };

                result.Add( dto );
            }

            return result.OrderByDescending( r => r.CreatedAt ).ToList();
        }

        public async Task<NotificationWithViewedDto?> GetNotificationWithViewedAsync( int userId, int notificationId )
        {
            await _userRepository.GetByIdAsyncThrow( userId );

            FandomNotification? notification = await _notificationRepository.GetByIdAsync( notificationId );

            if ( notification is null )
            {
                return null;
            }

            NotificationViewed? viewed = await _notificationViewedRepository
                .FindByNotificationAndUserAsync( notificationId, userId );

            return new NotificationWithViewedDto
            {
                Id = notification.Id,
                FandomId = notification.FandomId,
                NotifierId = notification.NotifierId,
                CreatedAt = notification.CreatedAt,
                Type = notification.Type,
                NotificationViewedId = viewed?.Id,
                ViewedAt = viewed?.ViewedAt,
                IsHidden = viewed?.IsHidden ?? false,
                IsViewed = viewed is not null
            };
        }

        public async Task<List<NotificationViewedReadDto>> GetAllViewedNotificationsAsync( bool? isHidden = null )
        {
            List<NotificationViewed> entities = await _notificationViewedRepository
                .GetAllViewedNotificationsAsync( isHidden );

            return _mapper.Map<List<NotificationViewedReadDto>>( entities );
        }

        public async Task<List<NotificationViewedReadDto>> GetViewedNotificationsByUserIdForAdminAsync( int userId, bool? isHidden = null )
        {
            await _userRepository.GetByIdAsyncThrow( userId );

            List<NotificationViewed> entities = await _notificationViewedRepository
                .GetViewedNotificationsByUserIdAsync( userId, isHidden );

            return _mapper.Map<List<NotificationViewedReadDto>>( entities );
        }
    }
}

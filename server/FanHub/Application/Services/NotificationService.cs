using Application.Dto.EventDto;
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
    public class NotificationService : BaseService<Notification, NotificationCreateDto, NotificationReadDto, NotificationUpdateDto>, INotificationService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPostRepository _postRepository;
        private IEventRepository _eventRepository;
        private readonly INotificationRepository _notificationRepository;

        public NotificationService( INotificationRepository NotificationRepository,
            IUserRepository UserRepository,
            IPostRepository PostRepository,
            IEventRepository eventRepository,
            IMapper mapper,
            IValidator<Notification> validator,
            ILogger<NotificationService> logger,
            IUnitOfWork unitOfWork ) : base( NotificationRepository, mapper, validator, logger, unitOfWork )
        {
            _notificationRepository = NotificationRepository;
            _userRepository = UserRepository;
            _postRepository = PostRepository;
            _eventRepository = eventRepository;
        }

        protected override async Task ExistEntities( Notification entity )
        {
            await _userRepository.GetByIdAsyncThrow( entity.UserId );
            int? postId = entity.PostId;
            int? eventId = entity.EventId;

            if ( postId is not null )
            {
                await _postRepository.GetByIdAsyncThrow( postId.Value );
            }

            if ( eventId is not null )
            {
                await _eventRepository.GetByIdAsyncThrow( eventId.Value );
            }
        }

        public async Task<List<NotificationReadDto>> GetNotificationsByUserIdAsync( int userId )
        {
            List<Notification> notifications = await _notificationRepository.GetNotificationsByUserIdAsync( userId );

            return _mapper.Map<List<NotificationReadDto>>( notifications );
        }
    }
}

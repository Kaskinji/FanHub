using Application.Dto.NotificationDto;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Extensions;
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

        public NotificationService( INotificationRepository NotificationRepository,
            IUserRepository UserRepository,
            IPostRepository PostRepository,
            IEventRepository eventRepository,
            IMapper mapper,
            IValidator<Notification> validator, ILogger<NotificationService> logger ) : base( NotificationRepository, mapper, validator, logger )
        {
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
    }
}

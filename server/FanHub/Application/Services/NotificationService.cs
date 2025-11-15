using Application.Dto.NotificationDto;
using Application.Extensions;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Extensions;
using Domain.Repositories;
using FluentValidation;

namespace Application.Services
{
    public class NotificationService : BaseService<Notification, NotificationCreateDto, NotificationReadDto, NotificationUpdateDto>, INotificationService
    {
        private readonly INotificationRepository _NotificationRepository;
        private readonly IUserRepository _userRepository;
        private readonly IPostRepository _postRepository;
        private IEventRepository _eventRepository;
        public NotificationService( INotificationRepository NotificationRepository,
            IUserRepository UserRepository,
            IPostRepository PostRepository,
            IEventRepository eventRepository,
            IMapper mapper,
            IValidator<Notification> validator ) : base( NotificationRepository, mapper, validator )
        {
            _NotificationRepository = NotificationRepository;
            _userRepository = UserRepository;
            _postRepository = PostRepository;
            _eventRepository = eventRepository;
        }

        protected override async Task ExistEntities( Notification entity )
        {
            await _userRepository.GetByIdAsyncThrow( entity.UserId );
            await _postRepository.GetByIdAsyncThrow( entity.PostId );
            await _eventRepository.GetByIdAsyncThrow( entity.EventId );
        }

    }
}

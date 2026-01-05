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

        public FandomNotificationService( INotificationRepository NotificationRepository,
            IUserRepository UserRepository,
            IPostRepository PostRepository,
            IEventRepository eventRepository,
            IMapper mapper,
            IValidator<FandomNotification> validator,
            ILogger<FandomNotificationService> logger,
            IUnitOfWork unitOfWork ) : base( NotificationRepository, mapper, validator, logger, unitOfWork )
        {
            _notificationRepository = NotificationRepository;
        }

        public async Task<List<FandomNotificationReadDto>> GetNotificationsByFandomIdAsync( int fandomId )
        {
            List<FandomNotification> notifications = await _notificationRepository.GetNotificationsByFandomIdAsync( fandomId );

            return _mapper.Map<List<FandomNotificationReadDto>>( notifications );
        }

        public async Task Notify( FandomNotificationCreateDto dto )
        {
            await Create( dto );
        }
    }
}

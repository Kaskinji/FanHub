using Application.Dto.NotificationDto;
using Domain.Entities;

namespace Application.Services.Interfaces
{
    public interface IFandomNotificationService : IBaseService<FandomNotification, FandomNotificationCreateDto, FandomNotificationReadDto, FandomNotificationUpdateDto>
    {
        Task<List<FandomNotificationReadDto>> GetNotificationsByFandomIdAsync( int fandomId );

        Task Notify( FandomNotificationCreateDto dto );

        Task<List<FandomNotificationReadDto>> GetNotificationsByUserSubscriptionsAsync( int userId );
    }
}

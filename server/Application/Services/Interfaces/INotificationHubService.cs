using Application.Dto.NotificationDto;

namespace Application.Services.Interfaces
{
    public interface INotificationHubService
    {
        Task SendNotificationToUserAsync( int userId, FandomNotificationReadDto notification );
        Task SendNotificationToUsersAsync( List<int> userIds, FandomNotificationReadDto notification );
    }
}


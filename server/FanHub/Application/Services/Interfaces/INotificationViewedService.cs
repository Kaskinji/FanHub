using Application.Dto.NotificationViewedDto;
using Domain.Entities;

namespace Application.Services.Interfaces
{
    public interface INotificationViewedService
    {
        Task<List<NotificationViewedReadDto>> GetViewedNotificationsByUserIdAsync( int userId );
        Task<List<NotificationViewedReadDto>> GetViewedNotificationsByUserIdAsync( int userId, bool? isHidden );
        Task<List<NotificationViewedReadDto>> GetViewedNotificationsByNotificationIdAsync( int notificationId );
        Task<bool> IsNotificationViewedByUserAsync( int notificationId, int userId );
        Task MarkNotificationsAsViewedAsync( int userId, List<int> notificationIds );
        Task UnmarkNotificationsAsViewedAsync( int userId, List<int> notificationIds );
        Task HideNotificationsAsync( int userId, List<int> notificationIds );
        Task UnhideNotificationsAsync( int userId, List<int> notificationIds );
        Task<List<NotificationWithViewedDto>> GetNotificationsWithViewedAsync( int userId, bool? isHidden = null );
        Task<NotificationWithViewedDto?> GetNotificationWithViewedAsync( int userId, int notificationId );
    }
}


using Domain.Entities;

namespace Domain.Repositories
{
    public interface INotificationViewedRepository : IBaseRepository<NotificationViewed>
    {
        Task<List<NotificationViewed>> GetViewedNotificationsByUserIdAsync( int userId );
        Task<List<NotificationViewed>> GetViewedNotificationsByUserIdAsync( int userId, bool? isHidden );
        Task<List<NotificationViewed>> GetViewedNotificationsByNotificationIdAsync( int notificationId );
        Task<NotificationViewed?> FindByNotificationAndUserAsync( int notificationId, int userId );
        Task<List<NotificationViewed>> GetAllViewedNotificationsAsync( bool? isHidden = null );
        Task BulkInsertAsync( List<NotificationViewed> entities );
        Task BulkDeleteAsync( List<NotificationViewed> entities );
        Task BulkUpdateAsync( List<NotificationViewed> entities );
    }
}


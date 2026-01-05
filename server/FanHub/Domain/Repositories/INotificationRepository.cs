using Domain.Entities;

namespace Domain.Repositories
{
    public interface INotificationRepository : IBaseRepository<FandomNotification>
    {
        Task<List<FandomNotification>> GetNotificationsByFandomIdAsync( int userId );
    }
}

using Domain.Entities;

namespace Domain.Repositories
{
    public interface INotificationRepository : IBaseRepository<Notification>
    {
        Task<List<Notification>> GetNotificationsByUserIdAsync( int userId );
    }
}

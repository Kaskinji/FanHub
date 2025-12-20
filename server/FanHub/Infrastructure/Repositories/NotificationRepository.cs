using Domain.Entities;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class NotificationRepository : BaseRepository<Notification>, INotificationRepository
    {
        public NotificationRepository( FanHubDbContext fanhubDbContext ) : base( fanhubDbContext )
        {
        }
        public async Task<List<Notification>> GetNotificationsByUserIdAsync( int userId )
        {
            return await _entities
                .Include( e => e.User )
                .Where( e => e.UserId == userId )
                .ToListAsync();
        }
    }
}

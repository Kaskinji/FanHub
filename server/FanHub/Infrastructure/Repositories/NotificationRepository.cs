using Domain.Entities;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class NotificationRepository : BaseRepository<FandomNotification>, INotificationRepository
    {
        public NotificationRepository( FanHubDbContext fanhubDbContext ) : base( fanhubDbContext )
        {
        }
        public async Task<List<FandomNotification>> GetNotificationsByFandomIdAsync( int fandomId )
        {
            return await _entities
                .Include( e => e.Fandom )
                .Where( e => e.FandomId == fandomId )
                .ToListAsync();
        }
    }
}

using Domain.Entities;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class NotificationViewedRepository : BaseRepository<NotificationViewed>, INotificationViewedRepository
    {
        public NotificationViewedRepository( FanHubDbContext fanhubDbContext ) : base( fanhubDbContext )
        {
        }

        public async Task<List<NotificationViewed>> GetViewedNotificationsByUserIdAsync( int userId )
        {
            return await _entities
                .Where( nv => nv.UserId == userId )
                .OrderByDescending( nv => nv.ViewedAt )
                .ToListAsync();
        }

        public async Task<List<NotificationViewed>> GetViewedNotificationsByUserIdAsync( int userId, bool? isHidden )
        {
            IQueryable<NotificationViewed> query = _entities
                .Where( nv => nv.UserId == userId );

            if ( isHidden.HasValue )
            {
                query = query.Where( nv => nv.IsHidden == isHidden.Value );
            }

            return await query
                .OrderByDescending( nv => nv.ViewedAt )
                .ToListAsync();
        }

        public async Task<List<NotificationViewed>> GetViewedNotificationsByNotificationIdAsync( int notificationId )
        {
            return await _entities
                .Where( nv => nv.NotificationId == notificationId )
                .OrderByDescending( nv => nv.ViewedAt )
                .ToListAsync();
        }

        public async Task<NotificationViewed?> FindByNotificationAndUserAsync( int notificationId, int userId )
        {
            return await _entities
                .FirstOrDefaultAsync( nv => nv.NotificationId == notificationId && nv.UserId == userId );
        }

        public async Task<List<NotificationViewed>> GetAllViewedNotificationsAsync( bool? isHidden = null )
        {
            IQueryable<NotificationViewed> query = _entities;

            if ( isHidden.HasValue )
            {
                query = query.Where( nv => nv.IsHidden == isHidden.Value );
            }

            return await query
                .OrderByDescending( nv => nv.ViewedAt )
                .ToListAsync();
        }

        public async Task BulkInsertAsync( List<NotificationViewed> entities )
        {
            if ( entities is null || entities.Count == 0 )
            {
                return;
            }

            await _entities.AddRangeAsync( entities );
        }

        public Task BulkDeleteAsync( List<NotificationViewed> entities )
        {
            if ( entities is null || entities.Count == 0 )
            {
                return Task.CompletedTask;
            }

            _entities.RemoveRange( entities );
            return Task.CompletedTask;
        }

        public Task BulkUpdateAsync( List<NotificationViewed> entities )
        {
            if ( entities is null || entities.Count == 0 )
            {
                return Task.CompletedTask;
            }

            _entities.UpdateRange( entities );
            return Task.CompletedTask;
        }
    }
}

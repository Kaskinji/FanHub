using Domain.Entities;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class SubscriptionRepository : BaseRepository<Subscription>, ISubscriptionRepository
    {
        public SubscriptionRepository( FanHubDbContext fanhubDbContext ) : base( fanhubDbContext )
        {
        }
        public async Task<int> CountSubscribersAsync( int fandomId )
        {
            return await _entities
                .Where( s => s.FandomId == fandomId )
                .CountAsync();
        }

        public async Task<List<Subscription>> GetSubscriptionsByFandomAsync( int fandomId )
        {
            return await _entities
                .Where( s => s.FandomId == fandomId )
                .ToListAsync();
        }

        public async Task<List<Subscription>> GetSubscriptionsByUserIdAsync( int userId )
        {
            return await _entities
                .Where( s => s.UserId == userId )
                .ToListAsync();
        }

    }
}

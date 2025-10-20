using Domain.Entities;
using Domain.Repositories;

namespace Infrastructure.Repositories
{
    public class SubscriptionRepository : BaseRepository<Subscription>, ISubscriptionRepository
    {
        public SubscriptionRepository( FanHubDbContext fanhubDbContext ) : base( fanhubDbContext )
        {
        }
    }
}

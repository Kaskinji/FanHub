using Domain.Entities;

namespace Domain.Repositories
{
    public interface ISubscriptionRepository : IBaseRepository<Subscription>
    {
        Task<int> CountSubscribersAsync( int fandomId );
        Task<List<Subscription>> GetSubscriptionsByFandomAsync( int fandomId );

    }
}

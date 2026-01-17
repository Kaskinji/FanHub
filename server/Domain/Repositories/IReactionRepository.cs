using Domain.Entities;
namespace Domain.Repositories
{
    public interface IReactionRepository : IBaseRepository<Reaction>
    {
        Task<List<Reaction>> GetReactionsByPostIdAsync( int postId );
    }
}

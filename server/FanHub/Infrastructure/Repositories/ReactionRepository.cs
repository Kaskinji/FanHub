using Domain.Entities;
using Domain.Enums;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class ReactionRepository : BaseRepository<Reaction>, IReactionRepository
    {
        public ReactionRepository( FanHubDbContext fanhubDbContext ) : base( fanhubDbContext )
        {
        }
        public async Task<List<Reaction>> GetReactionsByPostIdAsync( int postId )
        {
            return await _entities
                .Where( r => r.PostId == postId )
                .Include( r => r.User )
                .Include( r => r.Post )
                .OrderByDescending( r => r.Date )
                .ToListAsync();
        }
    }
}

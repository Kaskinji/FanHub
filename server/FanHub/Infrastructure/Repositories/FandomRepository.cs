using Domain.Entities;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class FandomRepository : BaseRepository<Fandom>, IFandomRepository
    {
        public FandomRepository( FanHubDbContext fanhubDbContext ) : base( fanhubDbContext )
        {
        }

        public async Task<List<Fandom>> GetFandomsByGameAsync( int gameId )
        {
            return await _entities
                .Where( f => f.GameId == gameId )
                .ToListAsync();
        }

        public async Task<List<Fandom>> SearchByNameAsync( string searchTerm )
        {
            return await _entities
                .Where( f => f.Name.Contains( searchTerm ) )
                .ToListAsync();
        }
    }
}

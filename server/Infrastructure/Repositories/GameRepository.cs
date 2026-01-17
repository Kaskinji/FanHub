using Domain.Entities;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class GameRepository : BaseRepository<Game>, IGameRepository
    {
        public GameRepository( FanHubDbContext fanhubDbContext ) : base( fanhubDbContext )
        {
        }

        public async Task<List<Game>> SearchGamesByNameAsync( string searchTerm )
        {
            return await _entities
                .Where( g =>
                    g.Title.Contains( searchTerm ) )
                .ToListAsync();
        }

        public async Task<List<Game>> SearchGamesByGenreAsync( string searchTerm )
        {
            return await _entities
                .Where( g =>
                    g.Genre == searchTerm )
                .ToListAsync();
        }

        public async Task<bool> IsGameExistAsync( Game entity )
        {
            return await _entities
                .AnyAsync( c => c.Title == entity.Title && c.Id != entity.Id );
        }

        public async Task<Game?> GetByIdWithStatsAsync( int id )
        {
            return await _entities
                .Where( g => g.Id == id )
                .Include( g => g.Fandoms )
                .FirstOrDefaultAsync();
        }

        public async Task<List<Game>> GetAllWithStatsAsync()
        {
            return await _entities
                .Include( g => g.Fandoms )
                .ToListAsync();
        }
    }
}

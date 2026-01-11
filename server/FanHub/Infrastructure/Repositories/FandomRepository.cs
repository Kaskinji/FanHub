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

        public async Task<List<Fandom>> SearchByNameAndGameWithStatsAsync( string searchTerm, int gameId )
        {
            IQueryable<Fandom> query = _entities
                .Include( f => f.Subscriptions )
                .Include( f => f.Game )
                .Where( f => f.GameId == gameId );

            if ( !string.IsNullOrWhiteSpace( searchTerm ) )
            {
                query = query.Where( f => f.Name.ToLower().Contains( searchTerm.ToLower() ) );
            }

            return await query.ToListAsync();
        }

        public async Task<List<Fandom>> SearchByNameWithStatsAsync( string searchTerm )
        {
            return await _entities
                .Include( f => f.Subscriptions )
                .Include( f => f.Posts )
                .Where( f => f.Name.ToLower().Contains( searchTerm ) )
                .ToListAsync();
        }

        public async Task<List<Fandom>> GetAllWithStatsAsync()
        {
            return await _entities
                .Include( f => f.Subscriptions )
                .Include( f => f.Posts )
                .ToListAsync();
        }

        public async Task<Fandom?> GetByIdWithStatsAsync( int id )
        {
            return await _entities
                .Include( f => f.Subscriptions )
                .Include( f => f.Posts )
                .FirstOrDefaultAsync( f => f.Id == id );
        }

        public async Task<Fandom?> GetByIdWithAllIncludesAsync( int id )
        {
            return await _entities
                .Include( f => f.Events )
                .Include( f => f.Subscriptions )
                .Include( f => f.Notifications )
                    .ThenInclude( n => n.NotificationsViewed )
                .Include( f => f.Posts )
                    .ThenInclude( p => p.Reactions )
                .Include( f => f.Posts )
                    .ThenInclude( p => p.Comments )
                .FirstOrDefaultAsync( f => f.Id == id );
        }

        public async Task<List<Fandom>> GetPopularAsync( int limit )
        {
            return await _entities
                .Include( f => f.Subscriptions )
                .Include( f => f.Posts )
                .Select( f => new
                {
                    Fandom = f,
                    SubscriptionsCount = f.Subscriptions.Count,
                    PostsCount = f.Posts.Count
                } )
                .OrderByDescending( x => x.SubscriptionsCount )
                .ThenByDescending( x => x.PostsCount )
                .Select( x => x.Fandom )
                .Take( limit )
                .ToListAsync();
        }

        public async Task<List<Fandom>> GetPopularByGameAsync( int gameId, int? limit = null )
        {
            IQueryable<Fandom> query = _entities
                .Include( f => f.Subscriptions )
                .Include( f => f.Posts )
                .Where( f => f.GameId == gameId )
                .Select( f => new
                {
                    Fandom = f,
                    SubscriptionsCount = f.Subscriptions.Count,
                    PostsCount = f.Posts.Count
                } )
                .OrderByDescending( x => x.SubscriptionsCount )
                .ThenByDescending( x => x.PostsCount )
                .Select( x => x.Fandom );

            if ( limit.HasValue )
            {
                query = query.Take( limit.Value );
            }

            return await query.ToListAsync();
        }

        public async Task<bool> IsFandomExistAsync( Fandom entity )
        {
            return await _entities
                .AnyAsync( c => c.Name == entity.Name && entity.Id != c.Id );
        }
    }
}

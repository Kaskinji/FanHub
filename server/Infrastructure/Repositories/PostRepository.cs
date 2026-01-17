using Domain.Entities;
using Domain.Enums;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class PostRepository : BaseRepository<Post>, IPostRepository
    {
        public PostRepository( FanHubDbContext fanhubDbContext ) : base( fanhubDbContext )
        {
        }
        public async Task<List<Post>> GetAllWithStatsAsync()
        {
            return await _entities
                .Include( p => p.Reactions )
                .Include( p => p.Comments )
                .OrderByDescending( p => p.PostDate )
                .ToListAsync();
        }
        public async Task<List<Post>> FindByCategoryNameAsync( string categoryName )
        {
            return await _entities
                .Include( p => p.Reactions )
                .Include( p => p.Comments )
                .Where( p => p.Category.Name.ToLower() == categoryName.ToLower() )
                .OrderByDescending( p => p.PostDate )
                .ToListAsync();
        }

        public async Task<List<Post>> GetAllByCategoryId( int categoryId )
        {
            return await _entities
                .Include( p => p.Category )
                .Where( p => p.CategoryId == categoryId )
                .OrderByDescending( p => p.PostDate )
                .ToListAsync();
        }

        public async Task<List<Post>> GetAllByUserId( int userId )
        {
            return await _entities
                .Where( p => p.UserId == userId )
                .Include( p => p.Reactions )
                .Include( p => p.Comments )
                .OrderByDescending( p => p.PostDate )
                .ToListAsync();
        }

        public async Task<List<Post>> GetPopularPostsAsync( int? limit = null )
        {
            IQueryable<Post> query = _entities
                .Include( p => p.Reactions )
                .Include( p => p.Comments )
                .Select( p => new
                {
                    Post = p,
                    LikeCount = p.Reactions.Count( r => r.Type == ReactionType.Like )
                } )
                .OrderByDescending( x => x.LikeCount )
                .ThenByDescending( x => x.Post.PostDate )
                .Select( x => x.Post );

            if ( limit.HasValue )
            {
                query = query.Take( limit.Value );
            }

            return await query.ToListAsync();
        }

        public async Task<List<Post>> GetPopularPostsByFandomAsync( int fandomId, int? limit = null )
        {
            IQueryable<Post> query = _entities
                .Where( p => p.FandomId == fandomId )
                .Select( p => new
                {
                    Post = p,
                    LikeCount = p.Reactions.Count( r => r.Type == ReactionType.Like )
                } )
                .OrderByDescending( x => x.LikeCount )
                .ThenByDescending( x => x.Post.PostDate )
                .Select( x => x.Post )
                .Include( p => p.Reactions )
                .Include( p => p.Comments );

            if ( limit.HasValue )
            {
                query = query.Take( limit.Value );
            }

            return await query.ToListAsync();
        }

        public async Task<Post?> GetByIdWithIncludesAsync( int id )
        {
            return await _entities
                .Where( p => p.Id == id )
                .Include( p => p.Reactions )
                .Include( p => p.Comments )
                .FirstOrDefaultAsync();
        }
    }
}

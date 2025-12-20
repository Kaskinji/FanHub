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
                .Include( p => p.User )
                .Include( p => p.Category )
                .Include( p => p.Fandom )
                .Include( p => p.Reactions )
                .OrderByDescending( p => p.PostDate )
                .ToListAsync();
        }
        public async Task<List<Post>> FindByCategoryNameAsync( string categoryName )
        {
            return await _entities
                .Include( p => p.User )
                .Include( p => p.Category )
                .Include( p => p.Fandom )
                .Include( p => p.Reactions )
                .Where( p => p.Category.Name.ToLower() == categoryName.ToLower() )
                .OrderByDescending( p => p.PostDate )
                .ToListAsync();
        }

        public async Task<List<Post>> GetAllByCategoryId( int categoryId )
        {
            return await _entities
                .Include( p => p.Category )
                .Include( p => p.Reactions )
                .Where( p => p.CategoryId == categoryId )
                .OrderByDescending( p => p.PostDate )
                .ToListAsync();
        }

        public async Task<List<Post>> GetAllByUserId( int userId )
        {
            return await _entities
                .Include( p => p.Reactions )
                .Where( p => p.UserId == userId )
                .OrderByDescending( p => p.PostDate )
                .ToListAsync();
        }

        public async Task<List<Post>> GetPopularPostsAsync( int limit = 20 )
        {
            return await _entities
                .Include( p => p.User )
                .Include( p => p.Category )
                .Include( p => p.Fandom )
                .Include( p => p.Reactions )
                .Select( p => new
                {
                    Post = p,
                    LikeCount = p.Reactions.Count( r => r.Type == ReactionType.Like )
                } )
                .OrderByDescending( x => x.LikeCount )
                .ThenByDescending( x => x.Post.PostDate )
                .Take( limit )
                .Select( x => x.Post )
                .Take( limit )
                .ToListAsync();
        }

        public async Task<List<Post>> GetPopularPostsByFandomAsync( int fandomId, int limit = 20 )
        {
            return await _entities
                .Where( p => p.FandomId == fandomId )
                .Select( p => new
                {
                    Post = p,
                    LikeCount = p.Reactions.Count( r => r.Type == ReactionType.Like )
                } )
                .OrderByDescending( x => x.LikeCount )
                .ThenByDescending( x => x.Post.PostDate )
                .Take( limit )
                .Select( x => x.Post )
                .Include( p => p.User )
                .Include( p => p.Category )
                .Include( p => p.Fandom )
                .Include( p => p.Reactions )
                .Take( limit )
                .ToListAsync();
        }
    }
}

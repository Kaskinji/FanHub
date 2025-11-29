using Domain.Entities;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class PostRepository : BaseRepository<Post>, IPostRepository
    {
        public PostRepository( FanHubDbContext fanhubDbContext ) : base( fanhubDbContext )
        {
        }

        public async Task<List<Post>> GetAllByCategoryId( int categoryId )
        {
            return await _entities.Where( p => p.CategoryId == categoryId ).ToListAsync();
        }

        public async Task<List<Post>> GetAllByUserId( int userId )
        {
            return await _entities.Where( p => p.UserId == userId ).ToListAsync();
        }
    }
}

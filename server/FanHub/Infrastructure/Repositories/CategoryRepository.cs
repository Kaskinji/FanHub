using System.Linq.Expressions;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class CategoryRepository : BaseRepository<Category>, ICategoryRepository
    {
        public CategoryRepository( FanHubDbContext fanhubDbContext ) : base( fanhubDbContext )
        {
        }

        public async Task<Category?> GetByNameAsync( string name )
        {
            return await _entities.FirstOrDefaultAsync( c => c.Name == name );
        }

        public async Task<List<Category>> SearchByNameAsync( string searchTerm )
        {
            return await _entities
                .Where( c => c.Name.Contains( searchTerm ) )
                .ToListAsync();
        }

        public async Task<List<Category>> GetPopularCategoriesAsync( int limit )
        {
            return await _entities
                .Include( c => c.Posts )  //нужно связать Posts с Category
                .OrderByDescending( c => c.Posts.Count )
                .Take( limit )
                .ToListAsync();
        }
    }
}

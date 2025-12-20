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

        public async Task<List<Category>> SearchByNameAsync( string searchTerm )
        {
            return await _entities
                .Where( c => c.Name.Contains( searchTerm ) )
                .ToListAsync();
        }

        public async Task<bool> IsCategoryExistAsync( Category entity )
        {
            return await _entities
                .AnyAsync( c => c.Name == entity.Name );
        }
    }
}

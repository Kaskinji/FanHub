using Domain.Entities;
using Domain.Repositories;

namespace Infrastructure.Repositories
{
    public class CategoryRepository : BaseRepository<Category>, ICategoryRepository
    {
        public CategoryRepository( FanHubDbContext fanhubDbContext ) : base( fanhubDbContext )
        {
        }
    }
}

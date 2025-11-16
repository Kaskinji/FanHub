using Domain.Entities;

namespace Domain.Repositories
{
    public interface ICategoryRepository : IBaseRepository<Category>
    {
        Task<Category?> GetByNameAsync( string name );
        Task<List<Category>> SearchByNameAsync( string searchTerm );
    }
}

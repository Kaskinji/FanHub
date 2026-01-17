using Domain.Entities;

namespace Domain.Repositories
{
    public interface ICategoryRepository : IBaseRepository<Category>
    {
        Task<List<Category>> SearchByNameAsync( string searchTerm );
        Task<bool> IsCategoryExistAsync( Category category );
    }
}

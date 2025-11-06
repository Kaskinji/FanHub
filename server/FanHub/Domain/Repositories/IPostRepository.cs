using Domain.Entities;

namespace Domain.Repositories
{
    public interface IPostRepository : IBaseRepository<Post>
    {
        Task<List<Post>> GetAllByCategoryId( int categoryId );
        Task<List<Post>> GetAllByUserId( int userId );
    }
}

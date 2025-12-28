using Domain.Entities;

namespace Domain.Repositories
{
    public interface IPostRepository : IBaseRepository<Post>
    {
        Task<List<Post>> GetAllWithStatsAsync();
        Task<List<Post>> GetAllByCategoryId( int categoryId );
        Task<List<Post>> GetAllByUserId( int userId );
        Task<List<Post>> FindByCategoryNameAsync( string categoryName );
        Task<List<Post>> GetPopularPostsAsync( int limit = 20 );
        Task<List<Post>> GetPopularPostsByFandomAsync( int fandomId, int limit = 20 );
    }
}

using Domain.Entities;

namespace Domain.Repositories
{
    public interface ICommentRepository : IBaseRepository<Comment>
    {
        Task<List<Comment>> GetCommentsAsync();
        Task<List<Comment>> GetCommentsByPostIdAsync( int postId );
    }
}

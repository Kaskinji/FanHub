using Domain.Entities;
using Domain.Repositories;

namespace Infrastructure.Repositories
{
    public class PostRepository : BaseRepository<Post>, IPostRepository
    {
        public PostRepository( FanHubDbContext fanhubDbContext ) : base( fanhubDbContext )
        {
        }
    }
}

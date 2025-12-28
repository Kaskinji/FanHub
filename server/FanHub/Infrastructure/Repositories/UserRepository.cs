using Domain.Entities;
using Domain.Repositories;

namespace Infrastructure.Repositories
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository( FanHubDbContext fanhubDbContext ) : base( fanhubDbContext )
        {

        }
    }
}

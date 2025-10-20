using Domain.Entities;
using Domain.Repositories;

namespace Infrastructure.Repositories
{
    public class GameRepository : BaseRepository<Game>, IGameRepository
    {
        public GameRepository( FanHubDbContext fanhubDbContext ) : base( fanhubDbContext )
        {
        }
    }
}

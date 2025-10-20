using Domain.Entities;
using Domain.Repositories;

namespace Infrastructure.Repositories
{
    public class FandomRepository : BaseRepository<Fandom>, IFandomRepository
    {
        public FandomRepository( FanHubDbContext fanhubDbContext ) : base( fanhubDbContext )
        {
        }
    }
}

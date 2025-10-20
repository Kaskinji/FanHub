using Domain.Entities;
using Domain.Repositories;

namespace Infrastructure.Repositories
{
    public class EventRepository : BaseRepository<Event>, IEventRepository
    {
        public EventRepository( FanHubDbContext fanhubDbContext ) : base( fanhubDbContext )
        {
        }
    }
}

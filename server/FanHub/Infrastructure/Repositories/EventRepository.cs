using Domain.Entities;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class EventRepository : BaseRepository<Event>, IEventRepository
    {
        public EventRepository( FanHubDbContext fanhubDbContext ) : base( fanhubDbContext )
        {
        }
        public async Task<List<Event>> GetAllWithStatsAsync()
        {
            return await _entities
                .Include( e => e.Fandom )
                .Include( e => e.Organizer )
                .ToListAsync();
        }
        public async Task<List<Event>> GetEventsByFandomIdAsync( int fandomId )
        {
            return await _entities
                .Include( e => e.Fandom )
                .Include( e => e.Organizer )
                .Where( e => e.FandomId == fandomId )
                .ToListAsync();
        }
    }
}

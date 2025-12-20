using Domain.Entities;

namespace Domain.Repositories
{
    public interface IEventRepository : IBaseRepository<Event>
    {
        Task<List<Event>> GetAllWithStatsAsync();
        Task<List<Event>> GetEventsByFandomIdAsync( int fandomId );
    }
}

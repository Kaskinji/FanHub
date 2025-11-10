using Domain.Entities;

namespace Domain.Repositories
{
    public interface IFandomRepository : IBaseRepository<Fandom>
    {
        Task<List<Fandom>> GetFandomsByGameAsync( int gameId );
        Task<List<Fandom>> SearchByNameAsync( string searchTerm );
        Task<List<Fandom>> GetPopularFandomsAsync( int limit );
    }
}

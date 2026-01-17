using Domain.Entities;

namespace Domain.Repositories
{
    public interface IFandomRepository : IBaseRepository<Fandom>
    {
        Task<List<Fandom>> SearchByNameAndGameWithStatsAsync( string searchTerm, int gameId );
        Task<List<Fandom>> SearchByNameWithStatsAsync( string searchTerm );
        Task<List<Fandom>> GetAllWithStatsAsync();
        Task<Fandom?> GetByIdWithStatsAsync( int id );
        Task<Fandom?> GetByIdWithAllIncludesAsync( int id );
        Task<List<Fandom>> GetPopularAsync( int limit );
        Task<List<Fandom>> GetPopularByGameAsync( int gameId, int? limit = null );
        Task<bool> IsFandomExistAsync( Fandom entity );
    }
}

using Domain.Entities;

namespace Domain.Repositories
{
    public interface IGameRepository : IBaseRepository<Game>
    {
        Task<List<Game>> SearchGamesByNameAsync( string searchTerm );
        Task<List<Game>> SearchGamesByGenreAsync( string searchTerm );
        Task<bool> IsGameExistAsync( Game entity );
        Task<Game?> GetByIdWithStatsAsync( int id );
        Task<List<Game>> GetAllWithStatsAsync();
    }
}

using Application.Dto.GameDto;
using Domain.Entities;

namespace Application.Services.Interfaces
{
    public interface IGameService : IBaseService<Game, GameCreateDto, GameReadDto, GameUpdateDto>
    {
        Task<List<GameReadDto>> GetGamesByDeveloperAsync( string developer );
        Task<List<GameReadDto>> GetGamesByGenreAsync( string genre );
        Task<List<GameReadDto>> SearchGamesAsync( string searchTerm );
    }
}

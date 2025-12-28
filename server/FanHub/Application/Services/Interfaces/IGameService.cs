using Application.Dto.GameDto;
using Domain.Entities;

namespace Application.Services.Interfaces
{
    public interface IGameService : IBaseService<Game, GameCreateDto, GameReadDto, GameUpdateDto>
    {
        Task<List<GameReadDto>> SearchGamesByNameAsync( string searchTerm );
        Task<List<GameReadDto>> SearchGamesByGenreAsync( string searchTerm );
    }
}

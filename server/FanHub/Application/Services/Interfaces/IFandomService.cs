using Application.Dto.FandomDto;
using Domain.Entities;

namespace Application.Services.Interfaces
{
    public interface IFandomService : IBaseService<Fandom, FandomCreateDto, FandomReadDto, FandomUpdateDto>
    {
        Task<List<FandomReadDto>> SearchByNameAsync( string searchTerm );
        Task<List<FandomReadDto>> SearchByNameAndGameIdAsync( string searchTerm, int gameId );
    }
}

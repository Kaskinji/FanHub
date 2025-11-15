using Application.Dto.FandomDto;
using Domain.Entities;

namespace Application.Services.Interfaces
{
    public interface IFandomService : IBaseService<Fandom, FandomCreateDto, FandomReadDto, FandomUpdateDto>
    {
        Task<bool> IsNameUniqueAsync( string name, int? excludeId = null );
        Task<List<FandomReadDto>> SearchByNameAsync( string searchTerm );
        Task IsFandomNameUnique( Fandom entity );
    }
}

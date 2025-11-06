using Application.Dto.FandomDto;
using Domain.Entities;

namespace Application.Services.Interfaces
{
    public interface IFandomService : IBaseService<Fandom, FandomCreateDto, FandomReadDto, FandomUpdateDto>
    {
    }
}

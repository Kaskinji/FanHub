using Application.Dto.FandomDto;

namespace Application.Services.Interfaces
{
    public interface IFandomService
    {
        public Task<int> Create( FandomCreateDto dto );
        public Task Update( int id, FandomUpdateDto dto );
        public Task<FandomReadDto> GetById( int id );
        public Task<List<FandomReadDto>> GetAll();
        public Task Delete( int id );
    }
}

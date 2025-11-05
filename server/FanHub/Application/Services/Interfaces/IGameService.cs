using Application.Dto.GameDto;

namespace Application.Services.Interfaces
{
    public interface IGameService
    {
        public Task<int> Create( GameCreateDto game );
        public Task Update( int id, GameUpdateDto game );
        public Task<GameReadDto> GetById( int id );
        public Task<List<GameReadDto>> GetAll();
        public Task Delete( int id );
    }
}

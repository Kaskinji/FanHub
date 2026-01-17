namespace Application.Services.Interfaces
{
    public interface IBaseService<TEntity, TCreateDto, TReadDto, TUpdateDto>
    {
        public Task<int> Create( TCreateDto dto );
        public Task Update( int id, TUpdateDto dto );
        public Task<TReadDto> GetById( int id );
        public Task<List<TReadDto>> GetAll();
        public Task DeleteAsync( int id );
        public Task<bool> CheckCreator( int creatorId, int entityId );
    }
}
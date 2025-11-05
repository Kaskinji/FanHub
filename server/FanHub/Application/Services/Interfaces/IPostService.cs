using Application.Dto.PostDto;

namespace Application.Services.Interfaces
{
    public interface IPostService
    {
        public Task<int> Create( PostCreateDto post );
        public Task Update( int id, PostUpdateDto post );
        public Task<PostReadDto> GetById( int id );
        public Task<List<PostReadDto>> GetAll();
        public Task Delete( int id );
    }
}

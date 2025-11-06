using Application.Dto.UserDto;

namespace Application.Services.Interfaces
{
    public interface IUserService
    {
        public Task<int> Create( UserCreateDto user );
        public Task Update( int id, UserUpdateDto user );
        public Task<UserReadDto> GetById( int id );
        public Task<List<UserReadDto>> GetAll();
        public Task Delete( int id );
    }
}

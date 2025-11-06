using Application.Dto.UserDto;
using Application.Extensions;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Extensions;
using Domain.Repositories;
using FluentValidation;

namespace Application.Services
{
    public class UserService : IUserService
    {
        private IUserRepository _repository;
        private IMapper _mapper;
        private IValidator<User> _validator;

        public UserService( IUserRepository userRepository,
            IMapper mapper,
            IValidator<User> validator )
        {
            _repository = userRepository;
            _mapper = mapper;
            _validator = validator;
        }

        public async Task<int> Create( UserCreateDto dto )
        {
            User user = new User();

            user.Id = IdGenerator.GenerateId();
            _mapper.Map( dto, user );

            await _validator.ValidateAndThrowAsync( user );

            await _repository.CreateAsync( user );

            return user.Id;
        }

        public async Task Delete( int id )
        {
            User user = await _repository.GetByIdAsyncThrow( id );

            _repository.Delete( user );
        }

        public async Task<List<UserReadDto>> GetAll()
        {
            List<User> users = await _repository.GetAllAsync();

            return _mapper.Map<List<UserReadDto>>( users );
        }

        public async Task<UserReadDto> GetById( int id )
        {
            User user = await _repository.GetByIdAsyncThrow( id );

            UserReadDto userReadDto = new();
            _mapper.Map( user, userReadDto );

            return userReadDto;
        }

        public async Task Update( int id, UserUpdateDto dto )
        {
            User user = await _repository.GetByIdAsyncThrow( id );

            _mapper.Map( dto, user );
            await _validator.ValidateAndThrowAsync( user );

            _repository.Update( user );
        }
    }
}

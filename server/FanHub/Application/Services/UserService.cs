using Application.Dto.UserDto;
using Application.Extensions;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using Domain.Extensions;
using Domain.Repositories;
using FluentValidation;

namespace Application.Services
{
    public class UserService : BaseService<User, UserCreateDto, UserReadDto, UserUpdateDto>, IUserService
    {
        private readonly IUserRepository _userRepository;
        public UserService( IUserRepository userRepository,
            IMapper mapper,
            IValidator<User> validator ) : base( userRepository, mapper, validator )
        {
            _userRepository = userRepository;
        }

        public override async Task<int> Create( UserCreateDto dto )
        {
            await ValidateUserUniqueness( dto.Username, dto.Login );

            User entity = new User();
            entity.Id = IdGenerator.GenerateId();
            entity.Role = UserRole.User;
            entity.RegistrationDate = DateTime.UtcNow;
            //добавить логику хэширования пароля
            _mapper.Map( dto, entity );

            await ExistEntities( entity );

            await _validator.ValidateAndThrowAsync( entity );

            await _repository.CreateAsync( entity );

            return entity.Id;
        }

        public override async Task Update( int id, UserUpdateDto dto )
        {
            User entity = await _repository.GetByIdAsyncThrow( id );
            //добавить логику хэширования пароля
            _mapper.Map( dto, entity );

            await ValidateUserUniqueness( dto.Username, dto.Login, id );

            await ExistEntities( entity );

            await _validator.ValidateAndThrowAsync( entity );

            _repository.Update( entity );
        }

        public async Task ValidateUserUniqueness( string username, string login, int? excludeId = null )
        {
            bool isLoginUnique = await IsLoginUniqueAsync( login, excludeId );
            if ( !isLoginUnique )
            {
                throw new ValidationException( "Пользователь с таким логином уже существует" );
            }

            bool isUsernameUnique = await IsUsernameUniqueAsync( username, excludeId );
            if ( !isUsernameUnique )
            {
                throw new ValidationException( "Пользователь с таким именем уже существует" );
            }
        }

        public async Task<bool> IsLoginUniqueAsync( string login, int? excludeId = null )
        {
            User? existing = await _repository.FindAsync( u =>
                u.Login == login &&
                ( excludeId == null || u.Id != excludeId.Value ) );
            return existing == null;
        }

        public async Task<bool> IsUsernameUniqueAsync( string username, int? excludeId = null )
        {
            var existing = await _repository.FindAsync( u =>
                u.Username == username &&
                ( excludeId == null || u.Id != excludeId.Value ) );
            return existing == null;
        }
    }
}

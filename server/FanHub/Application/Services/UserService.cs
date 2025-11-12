using Application.Dto.UserDto;
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
        public UserService( IUserRepository userRepository,
            IMapper mapper,
            IValidator<User> validator ) : base( userRepository, mapper, validator )
        {
        }

        public override async Task<int> Create( UserCreateDto dto )
        {
            bool isEmailUnique = await IsLoginUniqueAsync( dto.Login );
            if ( !isEmailUnique )
            {
                throw new ValidationException( "Пользователь с таким Login уже существует" );
            }

            bool isUsernameUnique = await IsUsernameUniqueAsync( dto.Username );
            if ( !isUsernameUnique )
            {
                throw new ValidationException( "Пользователь с таким именем уже существует" );
            }

            string passwordHash = HashPassword( dto.PasswordHash );

            User user = new User
            {
                Username = dto.Username,
                Login = dto.Login,
                PasswordHash = passwordHash,
                RegistrationDate = DateTime.UtcNow,
                Role = UserRole.User
            };

            await _validator.ValidateAndThrowAsync( user );
            await _repository.CreateAsync( user );

            return user.Id;
        }

        public override async Task Update( int id, UserUpdateDto dto )
        {
            var existingUser = await _repository.GetByIdAsyncThrow( id );

            if ( !string.IsNullOrEmpty( dto.Login ) && dto.Login != existingUser.Login )
            {
                bool isEmailUnique = await IsLoginUniqueAsync( dto.Login, id );
                if ( !isEmailUnique )
                {
                    throw new ValidationException( "Пользователь с таким email уже существует" );
                }
            }

            if ( !string.IsNullOrEmpty( dto.Username ) && dto.Username != existingUser.Username )
            {
                bool isUsernameUnique = await IsUsernameUniqueAsync( dto.Username, id );
                if ( !isUsernameUnique )
                {
                    throw new ValidationException( "Пользователь с таким именем уже существует" );
                }
            }

            if ( !string.IsNullOrEmpty( dto.PasswordHash ) )
            {
                existingUser.PasswordHash = HashPassword( dto.PasswordHash );
            }

            _mapper.Map( dto, existingUser );

            await _validator.ValidateAndThrowAsync( existingUser );
            _repository.Update( existingUser );
        }

        public async Task<bool> IsLoginUniqueAsync( string login, int? excludeId = null )
        {
            var existing = await _repository.FindAsync( u =>
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

        private string HashPassword( string password )
        {
            return Convert.ToBase64String( System.Text.Encoding.UTF8.GetBytes( password ) );
        }
    }
}

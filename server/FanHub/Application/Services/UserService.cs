using Application.Dto.UserDto;
using Application.PasswordHasher;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using Domain.Foundations;
using Domain.Repositories;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Application.Services
{
    public class UserService : BaseService<User, UserCreateDto, UserReadDto, UserUpdateDto>, IUserService
    {
        private IPasswordHasher _hasher;

        public UserService( IUserRepository userRepository,
            IMapper mapper,
            IValidator<User> validator,
            IPasswordHasher hasher,
            ILogger<UserService> logger,
            IUnitOfWork unitOfWork
           ) : base( userRepository, mapper, validator, logger, unitOfWork )
        {
            _hasher = hasher;
        }

        public async Task<int?> GetUserIdByCredentialsAsync( string login, string password )
        {
            User? user = await _repository.FindAsync( e => e.Login == login );
            if ( user is null || !_hasher.VerifyPassword( password, user.PasswordHash ) )
            {
                return null;
            }

            return user.Id;
        }

        protected override User InitializeEntity( UserCreateDto dto )
        {
            User entity = new User();
            entity.RegistrationDate = DateTime.UtcNow;
            entity.PasswordHash = _hasher.Hash( dto.Password );
            entity.Role = UserRole.User;

            return entity;
        }

        protected override async Task CheckUnique( User entity )
        {
            User? existing = await _repository.FindAsync( u =>
                u.Login == entity.Login );

            if ( existing is not null )
            {
                throw new ArgumentException( "Пользователь с таким логином уже существует" );
            }

            User? existingUser = await _repository.FindAsync( u =>
                u.Username == entity.Username );

            if ( existingUser is not null )
            {
                throw new ArgumentException( "Пользователь с таким именем уже существует" );
            }
        }
    }
}

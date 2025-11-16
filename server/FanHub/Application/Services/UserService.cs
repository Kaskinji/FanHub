using Application.Dto.UserDto;
using Application.Extensions;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
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

        protected override User InitializeEntity()
        {
            User entity = new User();
            entity.Id = IdGenerator.GenerateId();
            entity.Role = UserRole.User;
            entity.RegistrationDate = DateTime.UtcNow;

            return entity;
        }

        protected override async Task CheckUnique( User entity )
        {
            User? existing = await _repository.FindAsync( u =>
                u.Login == entity.Login );

            if ( existing is not null )
            {
                throw new ValidationException( "Пользователь с таким логином уже существует" );
            }

            User? existingUser = await _repository.FindAsync( u =>
                u.Username == entity.Username );

            if ( existingUser is not null )
            {
                throw new ValidationException( "Пользователь с таким именем уже существует" );
            }
        }
    }
}

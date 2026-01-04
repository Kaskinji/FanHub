using Application.Dto.PostDto;
using Application.Dto.UserDto;
using Application.PasswordHasher;
using Application.Services.Interfaces;
using Application.Tools;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using Domain.Extensions;
using Domain.Foundations;
using Domain.Repositories;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Application.Services
{
    public class UserService : BaseService<User, UserCreateDto, UserReadDto, UserUpdateDto>, IUserService
    {
        private readonly IPasswordHasher _hasher;
        private readonly IImageTools _imageTools;

        public UserService( IUserRepository userRepository,
            IMapper mapper,
            IValidator<User> validator,
            IPasswordHasher hasher,
            ILogger<UserService> logger,
            IUnitOfWork unitOfWork,
            IImageTools imageTools
           ) : base( userRepository, mapper, validator, logger, unitOfWork )
        {
            _hasher = hasher;
            _imageTools = imageTools;
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
        public override async Task Update( int id, UserUpdateDto dto )
        {
            User entity = await _repository.GetByIdAsyncThrow( id );

            _mapper.Map( dto, entity );

            if ( dto.Password is not null )
            {
                entity.PasswordHash = _hasher.Hash( dto.Password );
            }

            await CheckUnique( entity );

            await ExistEntities( entity );

            await _validator.ValidateAndThrowAsync( entity );

            _logger.LogTrace( $"User with id '{id}' was updated." );

            _repository.Update( entity );

            await _unitOfWork.CommitAsync();
        }

        protected override User InitializeEntity( UserCreateDto dto )
        {
            User entity = new User();
            entity.RegistrationDate = DateTime.UtcNow;
            entity.PasswordHash = _hasher.Hash( dto.Password );
            entity.Role = UserRole.User;

            return entity;
        }

        protected override Task CleanupBeforeUpdate( User entity, UserUpdateDto updateDto )
        {
            if ( entity.Avatar != updateDto.Avatar && !string.IsNullOrEmpty( entity.Avatar ) )
            {
                _imageTools.DeleteImage( entity.Avatar );
            }

            return Task.CompletedTask;
        }

        protected override async Task CheckUnique( User entity )
        {
            User? existing = await _repository.FindAsync( u =>
                u.Login == entity.Login );

            if ( existing is not null && existing.Id != entity.Id )
            {
                throw new ArgumentException( "Пользователь с таким логином уже существует" );
            }

            existing = await _repository.FindAsync( u =>
                u.Username == entity.Username );

            if ( existing is not null && existing.Id != entity.Id )
            {
                throw new ArgumentException( "Пользователь с таким именем уже существует" );
            }
        }

        protected override Task CleanupBeforeDelete( User entity )
        {
            if ( !string.IsNullOrEmpty( entity.Avatar ) )
            {
                _imageTools.DeleteImage( entity.Avatar );
            }

            return Task.CompletedTask;
        }
    }
}

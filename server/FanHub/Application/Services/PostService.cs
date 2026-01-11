using Application.Dto.FandomDto;
using Application.Dto.NotificationDto;
using Application.Dto.PostDto;
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
    public class PostService : BaseService<Post, PostCreateDto, PostReadDto, PostUpdateDto>, IPostService
    {
        private readonly IFandomService _fandomService;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IUserRepository _userRepository;
        private readonly IPostRepository _postRepository;
        private readonly IImageTools _imageTools;

        public PostService( IPostRepository repository,
            IFandomService fandomService,
            ICategoryRepository categoryRepository,
            IUserRepository userRepository,
            IMapper mapper,
            IValidator<Post> validator,
            ILogger<PostService> logger,
            IUnitOfWork unitOfWork,
            IImageTools imageTools ) : base( repository, mapper, validator, logger, unitOfWork )
        {
            _fandomService = fandomService;
            _categoryRepository = categoryRepository;
            _userRepository = userRepository;
            _postRepository = repository;
            _imageTools = imageTools;
        }

        public override async Task<List<PostReadDto>> GetAll()
        {
            List<Post> posts = await _postRepository.GetAllWithStatsAsync();

            return _mapper.Map<List<PostReadDto>>( posts );
        }
        public async Task<List<PostStatsDto>> SearchByCategoryNameAsync( string categoryName )
        {
            List<Post> posts = await _postRepository.FindByCategoryNameAsync( categoryName );

            return _mapper.Map<List<PostStatsDto>>( posts );
        }

        public async Task<List<PostStatsDto>> SearchByCategoryIdAsync( int categoryId )
        {
            List<Post> posts = await _postRepository.GetAllByCategoryId( categoryId );

            return _mapper.Map<List<PostStatsDto>>( posts );
        }

        public async Task<List<PostStatsDto>> SearchByCategoryAsync( string? categoryName = null, int? categoryId = null )
        {
            if ( !categoryId.HasValue && string.IsNullOrWhiteSpace( categoryName ) )
            {
                return new List<PostStatsDto>();
            }

            List<Post> posts;

            if ( categoryId.HasValue )
            {
                posts = await _postRepository.GetAllByCategoryId( categoryId.Value );
            }
            else
            {
                posts = await _postRepository.FindByCategoryNameAsync( categoryName! );
            }

            return _mapper.Map<List<PostStatsDto>>( posts );
        }

        public async Task<List<PostStatsDto>> GetPopularPosts( int? limit = null )
        {
            List<Post> posts = await _postRepository.GetPopularPostsAsync( limit );

            return _mapper.Map<List<PostStatsDto>>( posts );
        }

        public async Task<List<PostStatsDto>> GetPopularPostsByFandom( int fandomId, int? limit = null )
        {
            List<Post> posts = await _postRepository.GetPopularPostsByFandomAsync( fandomId, limit );

            return _mapper.Map<List<PostStatsDto>>( posts );
        }

        protected override Post InitializeEntity( PostCreateDto dto )
        {
            Post entity = new();

            entity.PostDate = DateTime.UtcNow;

            return entity;
        }

        protected override async Task CleanupBeforeUpdate( Post entity, PostUpdateDto updateDto )
        {
            if ( entity.MediaContent != updateDto.MediaContent && !string.IsNullOrEmpty( entity.MediaContent ) )
            {
                await _imageTools.TryDeleteImageAsync( entity.MediaContent );
            }
        }

        protected override async Task CheckUnique( Post post )
        {
            await _fandomService.GetById( post.FandomId );
            await _userRepository.GetByIdAsyncThrow( post.UserId );
            await _categoryRepository.GetByIdAsyncThrow( post.CategoryId );
        }

        public override async Task DeleteAsync( int id )
        {
            Post? entity = await _postRepository.GetByIdWithIncludesAsync( id );

            if ( entity is null )
            {
                throw new KeyNotFoundException( $"Post with id {id} is not found" );
            }

            _logger.LogTrace( $"{typeof( Post ).Name} with id '{id}' was deleted." );

            await CleanupBeforeDelete( entity );

            _repository.Delete( entity );

            await _unitOfWork.CommitAsync();
        }

        protected override async Task CleanupBeforeDelete( Post entity )
        {
            if ( !string.IsNullOrEmpty( entity.MediaContent ) )
            {
                await _imageTools.TryDeleteImageAsync( entity.MediaContent );
            }
        }

        protected override async Task AfterCreate( Post entity )
        {
            await _fandomService.Notify( new FandomNotificationCreateDto
            {
                FandomId = entity.FandomId,
                NotifierId = entity.Id,
                Type = FandomNotificationType.NewPost,
            } );
        }

        public async Task<PostStatsDto> GetPostWithStatsById( int id )
        {
            Post? f = await _postRepository.GetByIdWithIncludesAsync( id );

            if ( f is null )
            {
                throw new KeyNotFoundException( $"Post with id {id} is not found" );
            }

            return _mapper.Map<PostStatsDto>( f );
        }
    }
}

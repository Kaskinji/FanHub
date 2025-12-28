using Application.Dto.PostDto;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Extensions;
using Domain.Foundations;
using Domain.Repositories;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Application.Services
{
    public class PostService : BaseService<Post, PostCreateDto, PostReadDto, PostUpdateDto>, IPostService
    {
        private readonly IFandomRepository _fandomRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IUserRepository _userRepository;
        private readonly IPostRepository _postRepository;

        public PostService( IPostRepository repository,
            IFandomRepository fandomRepository,
            ICategoryRepository categoryRepository,
            IUserRepository userRepository,
            IMapper mapper,
            IValidator<Post> validator,
            ILogger<PostService> logger,
            IUnitOfWork unitOfWork ) : base( repository, mapper, validator, logger, unitOfWork )
        {
            _fandomRepository = fandomRepository;
            _categoryRepository = categoryRepository;
            _userRepository = userRepository;
            _postRepository = repository;
        }

        public override async Task<List<PostReadDto>> GetAll()
        {
            List<Post> posts = await _postRepository.GetAllWithStatsAsync();

            return _mapper.Map<List<PostReadDto>>( posts );
        }
        public async Task<List<PostReadDto>> SearchByCategoryNameAsync( string categoryName )
        {
            List<Post> posts = await _postRepository.FindByCategoryNameAsync( categoryName );

            return _mapper.Map<List<PostReadDto>>( posts );
        }

        public async Task<List<PostReadDto>> SearchByCategoryIdAsync( int categoryId )
        {
            List<Post> posts = await _postRepository.GetAllByCategoryId( categoryId );

            return _mapper.Map<List<PostReadDto>>( posts );
        }

        public async Task<List<PostReadDto>> SearchByCategoryAsync( string? categoryName = null, int? categoryId = null )
        {
            if ( !categoryId.HasValue && string.IsNullOrWhiteSpace( categoryName ) )
            {
                return new List<PostReadDto>();
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

            return _mapper.Map<List<PostReadDto>>( posts );
        }

        public async Task<List<PostReadDto>> GetPopularPosts( int limit = 20 )
        {
            List<Post> posts = await _postRepository.GetPopularPostsAsync( limit );

            return _mapper.Map<List<PostReadDto>>( posts );
        }

        public async Task<List<PostReadDto>> GetPopularPostsByFandom( int fandomId, int limit = 20 )
        {
            List<Post> posts = await _postRepository.GetPopularPostsByFandomAsync( fandomId, limit );

            return _mapper.Map<List<PostReadDto>>( posts );
        }
        protected override Post InitializeEntity( PostCreateDto dto )
        {
            Post entity = new();

            entity.PostDate = DateTime.UtcNow;

            return entity;
        }

        protected override async Task CheckUnique( Post post )
        {
            await _fandomRepository.GetByIdAsyncThrow( post.FandomId );
            await _userRepository.GetByIdAsyncThrow( post.UserId );
            await _categoryRepository.GetByIdAsyncThrow( post.CategoryId );
        }
    }
}

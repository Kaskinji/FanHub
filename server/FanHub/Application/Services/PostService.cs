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

        public async Task<List<PostReadDto>> SearchByCategoryNameAsync( string categoryName )
        {
            if ( string.IsNullOrWhiteSpace( categoryName ) )
            {
                return new List<PostReadDto>();
            }

            Category? category = await _categoryRepository.FindAsync( c =>
                c.Name.ToLower() == categoryName.ToLower() );

            if ( category == null )
            {
                return new List<PostReadDto>();
            }

            List<Post> posts = await _postRepository.FindAllAsync( p =>
                p.CategoryId == category.Id );

            return _mapper.Map<List<PostReadDto>>( posts );
        }

        public async Task<List<PostReadDto>> SearchByCategoryIdAsync( int categoryId )
        {
            await _categoryRepository.GetByIdAsyncThrow( categoryId );

            List<Post> posts = await _postRepository.FindAllAsync( p =>
                p.CategoryId == categoryId );

            return _mapper.Map<List<PostReadDto>>( posts );
        }

        public async Task<List<PostReadDto>> SearchByCategoryAsync( string? categoryName = null, int? categoryId = null )
        {
            if ( categoryId.HasValue )
            {
                return await SearchByCategoryIdAsync( categoryId.Value );
            }
            else if ( !string.IsNullOrWhiteSpace( categoryName ) )
            {
                return await SearchByCategoryNameAsync( categoryName );
            }
            else
            {
                return new List<PostReadDto>();
            }
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

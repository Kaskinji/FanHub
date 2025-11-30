using Application.Dto.PostDto;
using Application.Extensions;
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

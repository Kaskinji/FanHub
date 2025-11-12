using Application.Dto.PostDto;
using Application.Extensions;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using FluentValidation;

namespace Application.Services
{
    public class PostService : BaseService<Post, PostCreateDto, PostReadDto, PostUpdateDto>, IPostService
    {
        private IFandomService _fandomService;
        private ICategoryService _categoryService;
        private IUserService _userService;

        public PostService( IPostRepository repository,
            IFandomService fandomService,
            ICategoryService categoryService,
            IUserService userService,
            IMapper mapper,
            IValidator<Post> validator ) : base( repository, mapper, validator )
        {
            _fandomService = fandomService;
            _categoryService = categoryService;
            _userService = userService;
        }

        public override async Task<int> Create( PostCreateDto dto )
        {
            Post entity = new();

            entity.Id = IdGenerator.GenerateId();
            entity.PostDate = DateTime.UtcNow;

            _mapper.Map( dto, entity );

            await ExistEntities( entity );

            await _validator.ValidateAndThrowAsync( entity );

            await _repository.CreateAsync( entity );

            return entity.Id;
        }

        protected override async Task ExistEntities( Post post )
        {
            await _fandomService.GetById( post.FandomId );
            await _userService.GetById( post.UserId );
            await _categoryService.GetById( post.CategoryId );
        }
    }
}

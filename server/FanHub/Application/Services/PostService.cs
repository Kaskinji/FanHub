using Application.Dto.PostDto;
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

        protected override async Task ExistEntities( Post post )
        {
            await _fandomService.GetById( post.FandomId );
            await _userService.GetById( post.UserId );
            await _categoryService.GetById( post.CategoryId );
        }
    }
}

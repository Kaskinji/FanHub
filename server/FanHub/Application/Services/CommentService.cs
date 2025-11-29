using Application.Services.Interfaces;
using Application.Dto.CommentDto;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using FluentValidation;
using Domain.Extensions;
using Microsoft.Extensions.Logging;

namespace Application.Services
{
    public class CommentService : BaseService<Comment, CommentCreateDto, CommentReadDto, CommentUpdateDto>, ICommentService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPostRepository _postRepository;
        public CommentService( ICommentRepository repository,
            IUserRepository userRepository,
            IPostRepository postRepository,
            IMapper mapper,
            IValidator<Comment> validator,
            ILogger<CommentService> logger )
        : base( repository, mapper, validator, logger )
        {
            _userRepository = userRepository;
            _postRepository = postRepository;
        }

        protected override async Task CheckUnique( Comment entity )
        {
            await _postRepository.GetByIdAsyncThrow( entity.Id );

            await _userRepository.GetByIdAsyncThrow( entity.UserId );
        }
    }
}

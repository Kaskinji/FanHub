using Application.Services.Interfaces;
using Application.Dto.CommentDto;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using FluentValidation;
using Domain.Enums;
using Domain.Extensions;
using Application.Extensions;

namespace Application.Services
{
    public class CommentService : BaseService<Comment, CommentCreateDto, CommentReadDto, CommentUpdateDto>, ICommentService
    {
        private readonly ICommentRepository _CommentRepository;
        private readonly IUserRepository _userRepository;
        private readonly IPostRepository _postRepository;
        public CommentService( ICommentRepository repository,
            IUserRepository userRepository,
            IPostRepository postRepository,
            IMapper mapper,
            IValidator<Comment> validator )
        : base( repository, mapper, validator )
        {
            _CommentRepository = repository;
            _userRepository = userRepository;
            _postRepository = postRepository;
        }
        protected override async Task ExistEntities( Comment entity )
        {
            await _postRepository.GetByIdAsyncThrow( entity.Id );

            await _userRepository.GetByIdAsyncThrow( entity.UserId );
        }
    }
}

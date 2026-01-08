using Application.Dto.CommentDto;
using Application.Services.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Extensions;

namespace WebApi.Controllers
{
    [Route( "/api/comments" )]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private ICommentService _commentService;
        private IMapper _mapper;

        public CommentController( ICommentService commentService, IMapper mapper )
        {
            _commentService = commentService;
            _mapper = mapper;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<CommentShowDto>>> GetCommentsWithAuthorData()
        {
            IReadOnlyList<CommentShowDto> comments = await _commentService.GetCommentsAsync();

            return Ok( comments );
        }

        [Authorize]
        [HttpGet( "post/{postId}" )]
        public async Task<ActionResult<IReadOnlyList<CommentShowDto>>> GetByPostId( [FromRoute]
        int postId )
        {
            IReadOnlyList<CommentShowDto> comments = await _commentService.GetCommentsByPostIdAsync( postId );

            return Ok( comments );
        }
        [Authorize]
        [HttpGet( "{id}" )]
        public async Task<ActionResult<CommentReadDto>> GetCommentById( int id )
        {
            CommentReadDto comment = await _commentService.GetById( id );

            return Ok( comment );
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<int>> CreateComment( [FromBody] WebApi.Contracts.CommentDto.CommentCreateDto dto )
        {
            CommentCreateDto createDto = _mapper.Map<CommentCreateDto>( dto );

            createDto.UserId = this.GetCurrentUserId();

            int id = await _commentService.Create( createDto );

            return Ok( id );
        }

        [Authorize]
        [HttpPut( "{id}" )]
        public async Task<IActionResult> UpdateComment( int id, [FromBody] CommentUpdateDto dto )
        {
            await _commentService.Update( id, dto );

            return Ok();
        }

        [Authorize]
        [HttpDelete( "{id}" )]
        public async Task<IActionResult> DeleteComment( int id )
        {
            await _commentService.DeleteAsync( id );

            return Ok();
        }
    }
}

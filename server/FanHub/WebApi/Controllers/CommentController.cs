using Application.Dto.CommentDto;
using Application.Services.Interfaces;
using Domain.Foundations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Route( "/api/comments" )]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private ICommentService _commentService;

        public CommentController( ICommentService commentService )
        {
            _commentService = commentService;
        }

        [HttpGet]
        public async Task<ActionResult<List<CommentReadDto>>> GetComments()
        {
            IReadOnlyList<CommentReadDto> comments = await _commentService.GetAll();

            return Ok( comments );
        }

        [HttpGet( "{id}" )]
        public async Task<ActionResult<CommentReadDto>> GetCommentById( int id )
        {
            CommentReadDto comment = await _commentService.GetById( id );

            return Ok( comment );
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<int>> CreateComment( [FromBody] CommentCreateDto dto )
        {
            int id = await _commentService.Create( dto );

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

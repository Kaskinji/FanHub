using Application.Dto.ReactionDto;
using Application.Services.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Extensions;

namespace WebApi.Controllers
{
    [Route( "/api/reactions" )]
    [ApiController]
    public class ReactionController : ControllerBase
    {
        private IReactionService _reactionService;
        private IMapper _mapper;

        public ReactionController( IReactionService reactionService, IMapper mapper )
        {
            _reactionService = reactionService;
            _mapper = mapper;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<ReactionReadDto>>> GetReactions()
        {
            IReadOnlyList<ReactionReadDto> reactions = await _reactionService.GetAll();

            return Ok( reactions );
        }

        [Authorize]
        [HttpGet( "{id}" )]
        public async Task<ActionResult<ReactionReadDto>> GetReactionById( int id )
        {
            ReactionReadDto reaction = await _reactionService.GetById( id );

            return Ok( reaction );
        }

        [Authorize]
        [HttpGet( "post/{postId}" )]
        public async Task<ActionResult<IReadOnlyList<ReactionReadDto>>> GetReactionsByPostId(
             [FromRoute] int postId )
        {
            IReadOnlyList<ReactionReadDto> reactions = await _reactionService.GetByPostId( postId );

            return Ok( reactions );
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<int>> CreateReaction( [FromBody] WebApi.Contracts.ReactionDto.ReactionCreateDto dto )
        {
            ReactionCreateDto createDto = _mapper.Map<ReactionCreateDto>( dto );

            createDto.UserId = this.GetCurrentUserId();

            int id = await _reactionService.Create( createDto );

            return Ok( id );
        }

        [Authorize]
        [HttpPut( "{id}" )]
        public async Task<IActionResult> UpdateReaction( int id, [FromBody] ReactionUpdateDto dto )
        {
            await _reactionService.Update( id, dto );

            return Ok();
        }

        [Authorize]
        [HttpDelete( "{id}" )]
        public async Task<IActionResult> DeleteReaction( int id )
        {
            await _reactionService.DeleteAsync( id );

            return Ok();
        }
    }
}

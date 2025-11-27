using Application.Dto.ReactionDto;
using Application.Services.Interfaces;
using Domain.Foundations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Route( "/api/reactions" )]
    [ApiController]
    public class ReactionController : ControllerBase
    {
        private IReactionService _reactionService;
        private IUnitOfWork _unitOfWork;

        public ReactionController( IReactionService reactionService, IUnitOfWork unitOfWork )
        {
            _reactionService = reactionService;
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<ActionResult<List<ReactionReadDto>>> GetReactions()
        {
            IReadOnlyList<ReactionReadDto> reactions = await _reactionService.GetAll();

            return Ok( reactions );
        }

        [HttpGet( "{id}" )]
        public async Task<ActionResult<ReactionReadDto>> GetReactionById( int id )
        {
            ReactionReadDto reaction = await _reactionService.GetById( id );

            return Ok( reaction );
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<int>> CreateReaction( [FromBody] ReactionCreateDto dto )
        {
            int id = await _reactionService.Create( dto );

            await _unitOfWork.CommitAsync();

            return Ok( id );
        }

        [Authorize]
        [HttpPut( "{id}" )]
        public async Task<IActionResult> UpdateReaction( int id, [FromBody] ReactionUpdateDto dto )
        {
            await _reactionService.Update( id, dto );

            await _unitOfWork.CommitAsync();

            return Ok();
        }

        [Authorize]
        [HttpDelete( "{id}" )]
        public async Task<IActionResult> DeleteReaction( int id )
        {
            await _reactionService.DeleteAsync( id );

            await _unitOfWork.CommitAsync();

            return Ok();
        }
    }
}

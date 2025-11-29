using Application.Dto.GameDto;
using Application.Services.Interfaces;
using Domain.Enums;
using Domain.Foundations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FanHub.Controllers;

[Route( "/api/games" )]
[ApiController]
public class GameController : ControllerBase
{
    private IGameService _gameService;
    private IUnitOfWork _unitOfWork;

    public GameController( IGameService gameService, IUnitOfWork unitOfWork )
    {
        _gameService = gameService;
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<ActionResult<List<GameReadDto>>> GetGames()
    {
        IReadOnlyList<GameReadDto> games = await _gameService.GetAll();

        return Ok( games );
    }

    [HttpGet( "{id}" )]
    public async Task<ActionResult<GameReadDto>> GetGameById( int id )
    {
        GameReadDto game = await _gameService.GetById( id );

        return Ok( game );
    }

    [Authorize( Roles = nameof( UserRole.Admin ) )]
    [HttpPost]
    public async Task<ActionResult<int>> CreateGame( [FromBody] GameCreateDto dto )
    {
        int id = await _gameService.Create( dto );

        await _unitOfWork.CommitAsync();

        return Ok( id );
    }

    [Authorize( Roles = nameof( UserRole.Admin ) )]
    [HttpPut( "{id}" )]
    public async Task<IActionResult> UpdateGame( int id, [FromBody] GameUpdateDto dto )
    {
        await _gameService.Update( id, dto );

        await _unitOfWork.CommitAsync();

        return Ok();
    }

    [Authorize( Roles = nameof( UserRole.Admin ) )]
    [HttpDelete( "{id}" )]
    public async Task<IActionResult> DeleteGame( int id )
    {
        await _gameService.DeleteAsync( id );

        await _unitOfWork.CommitAsync();

        return Ok();
    }
}

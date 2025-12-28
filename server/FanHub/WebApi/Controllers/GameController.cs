using Application.Dto.GameDto;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FanHub.Controllers;

[Route( "/api/games" )]
[ApiController]
public class GameController : ControllerBase
{
    private IGameService _gameService;

    public GameController( IGameService gameService )
    {
        _gameService = gameService;
    }

    [HttpGet]
    public async Task<ActionResult<List<GameReadDto>>> GetGames()
    {
        IReadOnlyList<GameReadDto> games = await _gameService.GetAll();

        return Ok( games );
    }

    [HttpGet( "/game/name" )]
    public async Task<ActionResult<GameReadDto>> GetGameByName(
        [FromQuery] string name )
    {
        List<GameReadDto> games = await _gameService.SearchGamesByNameAsync( name );

        return Ok( games );
    }
    [HttpGet( "/game/genre" )]
    public async Task<ActionResult<GameReadDto>> GetGameByGenre(
        [FromQuery] string name )
    {
        List<GameReadDto> games = await _gameService.SearchGamesByGenreAsync( name );

        return Ok( games );
    }

    [HttpGet( "{id}" )]
    public async Task<ActionResult<GameReadDto>> GetGameById( int id )
    {
        GameReadDto game = await _gameService.GetById( id );

        return Ok( game );
    }

    [Authorize( Policy = "AdminOnly" )]
    [HttpPost]
    public async Task<ActionResult<int>> CreateGame( [FromBody] GameCreateDto dto )
    {
        int id = await _gameService.Create( dto );

        return Ok( id );
    }

    [Authorize( Policy = "AdminOnly" )]
    [HttpPut( "{id}" )]
    public async Task<IActionResult> UpdateGame( int id, [FromBody] GameUpdateDto dto )
    {
        await _gameService.Update( id, dto );

        return Ok();
    }

    [Authorize( Policy = "AdminOnly" )]
    [HttpDelete( "{id}" )]
    public async Task<IActionResult> DeleteGame( int id )
    {
        await _gameService.DeleteAsync( id );

        return Ok();
    }
}

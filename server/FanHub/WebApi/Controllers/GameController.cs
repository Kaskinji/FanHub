using Application.Dto.GameDto;
using Application.Services.Interfaces;
using Domain.Foundations;
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

    [HttpPost]
    public async Task<IActionResult> CreateGame( [FromBody] GameCreateDto dto )
    {
        await _gameService.Create( dto );

        await _unitOfWork.CommitAsync();

        return Created();
    }

    [HttpPut( "{id}" )]
    public async Task<IActionResult> UpdateGame( int id, [FromBody] GameUpdateDto dto ) // todo: поменять dto(убрать опциональные поля)
    {
        await _gameService.Update( id, dto );

        await _unitOfWork.CommitAsync();

        return Ok();
    }

    [HttpDelete( "{id}" )]
    public async Task<IActionResult> DeleteGame( int id )
    {
        await _gameService.Delete( id );

        await _unitOfWork.CommitAsync();

        return Ok();
    }
}

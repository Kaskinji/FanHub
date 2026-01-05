using Application.Dto.NotificationDto;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Route( "/api/notifications" )]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private IFandomNotificationService _notificationService;

        public NotificationController( IFandomNotificationService NotificationService )
        {
            _notificationService = NotificationService;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<FandomNotificationReadDto>>> GetNotifications()
        {
            IReadOnlyList<FandomNotificationReadDto> notifications = await _notificationService.GetAll();

            return Ok( notifications );
        }

        [Authorize]
        [HttpGet( "{id}" )]
        public async Task<ActionResult<FandomNotificationReadDto>> GetNotificationById( int id )
        {
            FandomNotificationReadDto notification = await _notificationService.GetById( id );

            return Ok( notification );
        }

        [Authorize]
        [HttpGet( "user/{userId}" )]
        public async Task<ActionResult<FandomNotificationReadDto>> GetByUserId( int id )
        {
            List<FandomNotificationReadDto> notifications = await _notificationService.GetNotificationsByFandomIdAsync( id );

            return Ok( notifications );
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<int>> CreateNotification( [FromBody] FandomNotificationCreateDto dto )
        {
            int id = await _notificationService.Create( dto );

            return Ok( id );
        }

        [Authorize]
        [HttpPut( "{id}" )]
        public async Task<IActionResult> UpdateNotification( int id, [FromBody] FandomNotificationUpdateDto dto )
        {
            await _notificationService.Update( id, dto );

            return Ok();
        }

        [Authorize]
        [HttpDelete( "{id}" )]
        public async Task<IActionResult> DeleteNotification( int id )
        {
            await _notificationService.DeleteAsync( id );

            return Ok();
        }
    }
}

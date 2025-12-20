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
        private INotificationService _notificationService;

        public NotificationController( INotificationService NotificationService )
        {
            _notificationService = NotificationService;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<NotificationReadDto>>> GetNotifications()
        {
            IReadOnlyList<NotificationReadDto> notifications = await _notificationService.GetAll();

            return Ok( notifications );
        }

        [Authorize]
        [HttpGet( "{id}" )]
        public async Task<ActionResult<NotificationReadDto>> GetNotificationById( int id )
        {
            NotificationReadDto notification = await _notificationService.GetById( id );

            return Ok( notification );
        }

        [Authorize]
        [HttpGet( "user/{userId}" )]
        public async Task<ActionResult<NotificationReadDto>> GetByUserId( int id )
        {
            List<NotificationReadDto> notifications = await _notificationService.GetNotificationsByUserIdAsync( id );

            return Ok( notifications );
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<int>> CreateNotification( [FromBody] NotificationCreateDto dto )
        {
            int id = await _notificationService.Create( dto );

            return Ok( id );
        }

        [Authorize]
        [HttpPut( "{id}" )]
        public async Task<IActionResult> UpdateNotification( int id, [FromBody] NotificationUpdateDto dto )
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

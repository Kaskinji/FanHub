using Application.Dto.NotificationDto;
using Application.Services.Interfaces;
using Domain.Foundations;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Route( "/api/notifications" )]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private INotificationService _notificationService;
        private IUnitOfWork _unitOfWork;

        public NotificationController( INotificationService NotificationService, IUnitOfWork unitOfWork )
        {
            _notificationService = NotificationService;
            _unitOfWork = unitOfWork;
        }

        // можно добавить GetNotificationsForUser

        [HttpGet]
        public async Task<ActionResult<List<NotificationReadDto>>> GetNotifications()
        {
            IReadOnlyList<NotificationReadDto> notifications = await _notificationService.GetAll();

            return Ok( notifications );
        }

        [HttpGet( "{id}" )]
        public async Task<ActionResult<NotificationReadDto>> GetNotificationById( int id )
        {
            NotificationReadDto notification = await _notificationService.GetById( id );

            return Ok( notification );
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateNotification( [FromBody] NotificationCreateDto dto )
        {
            int id = await _notificationService.Create( dto );

            await _unitOfWork.CommitAsync();

            return Ok( id );
        }

        [HttpPut( "{id}" )]
        public async Task<IActionResult> UpdateNotification( int id, [FromBody] NotificationUpdateDto dto )
        {
            await _notificationService.Update( id, dto );

            await _unitOfWork.CommitAsync();

            return Ok();
        }

        [HttpDelete( "{id}" )]
        public async Task<IActionResult> DeleteNotification( int id )
        {
            await _notificationService.DeleteAsync( id );

            await _unitOfWork.CommitAsync();

            return Ok();
        }
    }
}

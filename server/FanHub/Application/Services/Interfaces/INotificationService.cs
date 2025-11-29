using Application.Dto.NotificationDto;
using Domain.Entities;

namespace Application.Services.Interfaces
{
    public interface INotificationService : IBaseService<Notification, NotificationCreateDto, NotificationReadDto, NotificationUpdateDto>
    {
    }
}

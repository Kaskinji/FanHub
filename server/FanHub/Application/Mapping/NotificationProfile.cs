using Application.Dto.NotificationDto;
using AutoMapper;
using Domain.Entities;

namespace Application.Mapping
{
    public class NotificationProfile : Profile
    {
        public NotificationProfile()
        {
            CreateMap<FandomNotification, FandomNotificationReadDto>();

            CreateMap<FandomNotificationCreateDto, FandomNotification>();

            CreateMap<FandomNotificationUpdateDto, FandomNotification>();
        }
    }
}

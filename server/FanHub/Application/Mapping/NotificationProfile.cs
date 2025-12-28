using Application.Dto.NotificationDto;
using AutoMapper;
using Domain.Entities;

namespace Application.Mapping
{
    public class NotificationProfile : Profile
    {
        public NotificationProfile()
        {
            CreateMap<Notification, NotificationReadDto>();

            CreateMap<NotificationCreateDto, Notification>();

            CreateMap<NotificationUpdateDto, Notification>();
        }
    }
}

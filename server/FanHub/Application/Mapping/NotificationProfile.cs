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

            CreateMap<NotificationCreateDto, Notification>()
            .ForMember( dest => dest.Id, opt => opt.Ignore() );

            CreateMap<NotificationUpdateDto, Notification>()
                .ForMember( dest => dest.Id, opt => opt.Ignore() )
                .ForMember( dest => dest.UserId, opt => opt.Ignore() )
                .ForMember( dest => dest.PostId, opt => opt.Ignore() )
                .ForMember( dest => dest.EventId, opt => opt.Ignore() );
        }
    }
}

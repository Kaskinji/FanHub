using Application.Dto.NotificationViewedDto;
using AutoMapper;
using Domain.Entities;

namespace Application.Mapping
{
    public class NotificationViewedProfile : Profile
    {
        public NotificationViewedProfile()
        {
            CreateMap<NotificationViewed, NotificationViewedReadDto>();

            CreateMap<NotificationViewedCreateDto, NotificationViewed>();

            CreateMap<NotificationViewedUpdateDto, NotificationViewed>()
                .ForMember( dest => dest.IsHidden,
                    opt => opt.Condition( ( src, dest, srcMember ) =>
                        src.IsHidden.HasValue ) );
        }
    }
}


using Application.Dto.SubscriptionDto;
using AutoMapper;
using Domain.Entities;

namespace Application.Mapping
{
    public class SubscriptionProfile : Profile
    {
        public SubscriptionProfile()
        {
            CreateMap<Subscription, SubscriptionReadDto>();

            CreateMap<SubscriptionCreateDto, Subscription>();

            CreateMap<SubscriptionUpdateDto, Subscription>();
        }
    }
}

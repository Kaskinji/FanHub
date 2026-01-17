using Application.Dto.SubscriptionDto;
using AutoMapper;

namespace WebApi.Mapping
{
    public class SubscriptionProfile : Profile
    {
        public SubscriptionProfile()
        {
            CreateMap<WebApi.Contracts.SubscriptionDto.SubscriptionCreateDto, SubscriptionCreateDto>();
        }
    }
}

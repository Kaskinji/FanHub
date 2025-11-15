using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dto.SubscriptionDto;
using Application.Dto.UserDto;
using AutoMapper;
using Domain.Entities;

namespace Application.Mapping
{
    public class SubscriptionProfile : Profile
    {
        public SubscriptionProfile()
        {
            CreateMap<Subscription, SubscriptionReadDto>();

            CreateMap<SubscriptionCreateDto, Subscription>()
                .ForMember( dest => dest.Date, opt => opt.MapFrom( src => DateTime.UtcNow ) );

            CreateMap<SubscriptionUpdateDto, Subscription>()
                .ForMember( dest => dest.Date, opt => opt.MapFrom( src => DateTime.UtcNow ) );
        }
    }
}

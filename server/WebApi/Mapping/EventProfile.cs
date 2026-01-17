using Application.Dto.EventDto;
using AutoMapper;

namespace WebApi.Mapping
{
    public class EventProfile : Profile
    {
        public EventProfile()
        {
            CreateMap<WebApi.Contracts.EventDto.EventCreateDto, EventCreateDto>();
        }
    }
}

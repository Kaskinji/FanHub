using Application.Dto.FandomDto;
using AutoMapper;

namespace WebApi.Mapping
{
    public class FandomProfile : Profile
    {
        public FandomProfile()
        {
            CreateMap<WebApi.Contracts.FandomDto.FandomCreateDto, FandomCreateDto>();
        }
    }
}

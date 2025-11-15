using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dto.ReactionDto;
using Application.Dto.UserDto;
using AutoMapper;
using Domain.Entities;
namespace Application.Mapping
{
    public class ReactionProfile : Profile
    {
        public ReactionProfile()
        {
            CreateMap<Reaction, ReactionReadDto>();

            CreateMap<ReactionCreateDto, Reaction>()
                .ForMember( dest => dest.Id, opt => opt.Ignore() )
                .ForMember( dest => dest.Date, opt => opt.Ignore() );

            CreateMap<ReactionUpdateDto, Reaction>()
                .ForMember( dest => dest.Id, opt => opt.Ignore() )
                .ForMember( dest => dest.Date, opt => opt.Ignore() )
                .ForMember( dest => dest.UserId, opt => opt.Ignore() )
                .ForMember( dest => dest.PostId, opt => opt.Ignore() );
        }
    }
}

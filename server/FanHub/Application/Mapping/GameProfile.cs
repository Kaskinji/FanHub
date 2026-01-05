using Application.Dto.GameDto;
using AutoMapper;
using Domain.Entities;

namespace Application.Mapping
{
    public class GameProfile : Profile
    {
        public GameProfile()
        {
            CreateMap<Game, GameReadDto>();

            CreateMap<GameCreateDto, Game>();

            CreateMap<GameUpdateDto, Game>()
                .ForAllMembers( opts => opts.Condition( ( src, dest, srcMember ) =>
                {
                    if ( srcMember is null )
                    {
                        return false;
                    }

                    if ( srcMember is DateTime dateTimeValue && dateTimeValue == default )
                    {
                        return false;
                    }

                    if ( srcMember is string stringValue && string.IsNullOrEmpty( stringValue ) )
                    {
                        return false;
                    }

                    return true;
                } ) );
        }
    }
}
using Application.Dto.EventDto;
using AutoMapper;
using Domain.Entities;

public class EventProfile : Profile
{
    public EventProfile()
    {
        CreateMap<Event, EventReadDto>()
           .ForMember( dest => dest.OrganizerId,
               opt => opt.MapFrom( src => src.Organizer.Id ) )
           .ForMember( dest => dest.FandomId,
               opt => opt.MapFrom( src => src.Fandom.Id ) );

        CreateMap<EventCreateDto, Event>();

        CreateMap<EventUpdateDto, Event>()
            .ForMember( dest => dest.Title,
                opt => opt.Condition( ( src, dest, srcMember ) =>
                    srcMember is not null && !string.IsNullOrWhiteSpace( srcMember ) ) )
            .ForMember( dest => dest.Description,
                opt => opt.Condition( ( src, dest, srcMember ) =>
                    srcMember is not null && !string.IsNullOrWhiteSpace( srcMember ) ) )
            .ForMember( dest => dest.StartDate,
                opt => opt.Condition( ( src, dest, srcMember ) =>
                    src.StartDate.HasValue && src.StartDate.Value != default ) )
            .ForMember( dest => dest.EndDate,
                opt => opt.Condition( ( src, dest, srcMember ) =>
                    src.EndDate != default ) )
            .ForMember( dest => dest.ImageUrl,
                opt => opt.MapFrom( src => src.ImageUrl ) );
    }
}
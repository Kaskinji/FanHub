using Application.Dto.EventDto;
using AutoMapper;
using Domain.Entities;

public class EventProfile : Profile
{
    public EventProfile()
    {
        CreateMap<Event, EventReadDto>();

        CreateMap<EventCreateDto, Event>()
        .ForMember( dest => dest.Id, opt => opt.Ignore() );

        CreateMap<EventUpdateDto, Event>()
            .ForMember( dest => dest.Id, opt => opt.Ignore() )
            .ForMember( dest => dest.Title, opt => opt.Condition( src => src.Title != null ) )
            .ForMember( dest => dest.Description, opt => opt.Condition( src => src.Description != null ) )
            .ForMember( dest => dest.StartDate, opt => opt.Condition( src =>
                src.StartDate.HasValue && src.StartDate.Value != default ) )
            .ForMember( dest => dest.EndDate, opt => opt.Condition( src =>
                src.EndDate.HasValue && src.EndDate.Value != default ) )
            .ForMember( dest => dest.ImageUrl, opt => opt.Condition( src => src.ImageUrl != null ) );
    }
}
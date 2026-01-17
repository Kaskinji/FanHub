using Domain.Entities;
using FluentValidation;

namespace Domain.Validators
{
    public class EventValidator : AbstractValidator<Event>
    {
        public EventValidator()
        {
            RuleFor( x => x.Title )
                .NotEmpty().WithMessage( "Название события обязательно" )
                .Length( 5, 128 ).WithMessage( "Название должно быть от 5 до 128 символов" )
                .Matches( "^[a-zA-Zа-яА-Я0-9\\s\\-\\.!,?:]+$" ).WithMessage( "Название содержит недопустимые символы" )
                .Must( title => !string.IsNullOrWhiteSpace( title ) ).WithMessage( "Название не может состоять только из пробелов" );

            RuleFor( x => x.Description )
                .NotEmpty().WithMessage( "Описание события обязательно" )
                .Length( 4, 500 ).WithMessage( "Описание должно быть от 4 до 500 символов" )
                .Must( desc => !string.IsNullOrWhiteSpace( desc ) ).WithMessage( "Описание не может состоять только из пробелов" );

            RuleFor( x => x.EndDate )
                .GreaterThanOrEqualTo( x => x.StartDate ).WithMessage( "Дата окончания события должна быть позже даты начала" );

            RuleFor( x => x.FandomId )
                .GreaterThan( 0 ).WithMessage( "ID фандома должен быть положительным числом" );

            RuleFor( x => x.OrganizerId )
                .GreaterThan( 0 ).WithMessage( "ID организатора должен быть положительным числом" );
        }
    }
}
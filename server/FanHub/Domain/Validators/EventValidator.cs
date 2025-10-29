using Domain;
using Domain.Entities;
using Domain.Enums;
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
                .Length( 10, 500 ).WithMessage( "Описание должно быть от 10 до 500 символов" )
                .Must( desc => !string.IsNullOrWhiteSpace( desc ) ).WithMessage( "Описание не может состоять только из пробелов" );

            RuleFor( x => x.FandomId )
                .GreaterThan( 0 ).WithMessage( "ID фандома должен быть положительным числом" );

            RuleFor( x => x.OrganizerId )
                .GreaterThan( 0 ).WithMessage( "ID организатора должен быть положительным числом" );

            RuleFor( x => x.Status )
                .IsInEnum().WithMessage( "Некорректный статус события" );

            RuleFor( x => x )
                .Must( HaveValidOrganizer ).WithMessage( "Организатор должен быть участником фандома" )
                .Must( HaveReasonableEventDuration ).WithMessage( "Событие не может длиться более n дней" );
        }

        private bool HaveValidOrganizer( Event eventEntity )
        {
            //организатор должен быть участником фандома
            return eventEntity.OrganizerId > 0 && eventEntity.FandomId > 0;
        }

        private bool HaveReasonableEventDuration( Event eventEntity )
        {
            //Событие не может длиться более n дней
            return true;
        }
    }
}
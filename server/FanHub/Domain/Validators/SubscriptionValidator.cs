using Domain.Entities;
using FluentValidation;

namespace Domain.Validators
{
    public class SubscriptionValidator : AbstractValidator<Subscription>
    {
        public SubscriptionValidator()
        {
            RuleFor( x => x.UserId )
                .GreaterThan( 0 ).WithMessage( "User ID должен быть положительным числом" );

            RuleFor( x => x.FandomId )
                .GreaterThan( 0 ).WithMessage( "Fandom ID должен быть положительным числом" );

            RuleFor( x => x.Date )
                .NotEmpty().WithMessage( "Дата подписки обязательна" )
                .LessThanOrEqualTo( DateTime.UtcNow ).WithMessage( "Дата подписки не может быть в будущем" )
                .GreaterThanOrEqualTo( DateTime.UtcNow.AddYears( -1 ) ).WithMessage( "Дата подписки не может быть старше 1 года" );
        }
    }
}
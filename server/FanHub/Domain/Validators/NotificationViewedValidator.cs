using Domain.Entities;
using FluentValidation;

namespace Domain.Validators
{
    public class NotificationViewedValidator : AbstractValidator<NotificationViewed>
    {
        public NotificationViewedValidator()
        {
            RuleFor( x => x.NotificationId )
                .GreaterThan( 0 ).WithMessage( "Notification ID должен быть положительным числом" );

            RuleFor( x => x.UserId )
                .GreaterThan( 0 ).WithMessage( "User ID должен быть положительным числом" );

            RuleFor( x => x.ViewedAt )
                .NotEmpty().WithMessage( "Дата просмотра обязательна" )
                .LessThanOrEqualTo( DateTime.UtcNow.AddMinutes( 1 ) ).WithMessage( "Дата просмотра не может быть в будущем" )
                .GreaterThanOrEqualTo( DateTime.UtcNow.AddYears( -1 ) ).WithMessage( "Дата просмотра слишком старая" );
        }
    }
}


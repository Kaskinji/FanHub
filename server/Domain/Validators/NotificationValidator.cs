using Domain.Entities;
using FluentValidation;

namespace Domain.Validators
{
    public class NotificationValidator : AbstractValidator<FandomNotification>
    {
        public NotificationValidator()
        {
            RuleFor( x => x.FandomId )
                .GreaterThan( 0 ).WithMessage( "Fandom ID должен быть положительным числом" );

            RuleFor( x => x.NotifierId )
                .GreaterThan( 0 ).WithMessage( "Notifier ID должен быть положительным числом" );

            RuleFor( x => x.Type )
                .IsInEnum().WithMessage( "Некорректный тип уведомления" );

            RuleFor( x => x.CreatedAt )
                .LessThanOrEqualTo( DateTime.UtcNow.AddMinutes( 1 ) ).WithMessage( "Дата создания не может быть в будущем" )
                .GreaterThanOrEqualTo( DateTime.UtcNow.AddYears( -1 ) ).WithMessage( "Дата создания слишком старая" );
        }
    }
}
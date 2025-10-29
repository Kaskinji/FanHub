using Domain.Entities;
using Domain.Enums;
using FluentValidation;

namespace Domain.Validators
{
    public class NotificationValidator : AbstractValidator<Notification>
    {
        public NotificationValidator()
        {
            RuleFor( x => x.UserId )
                .GreaterThan( 0 ).WithMessage( "UserId должен быть положительным числом" );

            RuleFor( x => x.Content )
                .NotEmpty().WithMessage( "Содержание уведомления обязательно" )
                .Length( 1, 500 ).WithMessage( "Содержание должно быть от 1 до 500 символов" )
                .Must( content => !string.IsNullOrWhiteSpace( content ) )
                .WithMessage( "Содержание не может состоять только из пробелов" );

            RuleFor( x => x.Type )
                .IsInEnum().WithMessage( "Некорректный тип уведомления" );

            RuleFor( x => x.PostId )
                .GreaterThan( 0 ).WithMessage( "PostId должен быть положительным числом" )
                .When( x => x.PostId.HasValue );

            RuleFor( x => x.EventId )
                .GreaterThan( 0 ).WithMessage( "EventId должен быть положительным числом" )
                .When( x => x.EventId.HasValue );

            RuleFor( x => x )
                .Must( HaveAtLeastOneReference )
                .WithMessage( "Уведомление должно ссылаться на пост или событие" );

        }

        private bool HaveAtLeastOneReference( Notification notification )
        {
            return notification.PostId.HasValue || notification.EventId.HasValue;
        }
    }
}
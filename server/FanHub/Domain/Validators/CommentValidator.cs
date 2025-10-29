using Domain.Entities;
using FluentValidation;

namespace Domain.Validators
{
    public class CommentValidator : AbstractValidator<Comment>
    {
        public CommentValidator()
        {
            RuleFor( x => x.Content )
                .NotEmpty().WithMessage( "Текст комментария не может быть пустым" )
                .MinimumLength( 1 ).WithMessage( "Комментарий должен содержать хотя бы 1 символ" )
                .MaximumLength( 500 ).WithMessage( "Комментарий не может превышать 500 символов" )
                .Must( content => !string.IsNullOrWhiteSpace( content ) ).WithMessage( "Комментарий не может состоять только из пробелов" );

            RuleFor( x => x.CommentDate )
                .NotEmpty().WithMessage( "Дата комментария обязательна" )
                .LessThanOrEqualTo( DateTime.UtcNow ).WithMessage( "Дата комментария не может быть в будущем" )
                .GreaterThanOrEqualTo( DateTime.UtcNow.AddYears( -1 ) ).WithMessage( "Дата комментария слишком старая" );

            RuleFor( x => x.PostId )
                .GreaterThan( 0 ).WithMessage( "ID поста должен быть положительным числом" );

            RuleFor( x => x.UserId )
                .GreaterThan( 0 ).WithMessage( "ID пользователя должен быть положительным числом" );

            RuleFor( x => x )
                .Must( x => x.Post is not null || x.User is not null )
                .WithMessage( "Должен быть указан либо пост, либо пользователь" );
        }
    }
}
using Domain.Entities;
using Domain.Enums;
using FluentValidation;

namespace Domain.Validators
{
    public class BasePostValidator : AbstractValidator<Post>
    {
        public BasePostValidator()
        {
            RuleFor( x => x.Title )
                .NotEmpty().WithMessage( "Заголовок поста обязателен" )
                .Length( 1, 128 ).WithMessage( "Заголовок должен быть от 1 до 128 символов" )
                .Matches( "^[a-zA-Zа-яА-Я0-9\\s\\-\\.!?,:;\\(\\)\\[\\]]+$" )
                .WithMessage( "Заголовок содержит недопустимые символы" )
                .Must( title => !string.IsNullOrWhiteSpace( title ) )
                .WithMessage( "Заголовок не может состоять только из пробелов" );

            RuleFor( x => x.Content )
                .NotEmpty().WithMessage( "Содержимое поста обязательно" )
                .MinimumLength( 10 ).WithMessage( "Содержимое должно быть не менее 10 символов" )
                .MaximumLength( 5000 ).WithMessage( "Содержимое не может превышать 5000 символов" );

            RuleFor( x => x.MediaContent )
                .MaximumLength( 500 ).WithMessage( "Ссылка на медиа-контент не может превышать 500 символов" )
                .Must( UrlValidator.ValidateMediaWithVideoUrl ).WithMessage( "Некорректная ссылка на медиа-контент" )
                .When( x => !string.IsNullOrEmpty( x.MediaContent ) );

            RuleFor( x => x.PostDate )
                .LessThanOrEqualTo( DateTime.Now ).WithMessage( "Дата публикации не может быть в будущем" )
                .GreaterThanOrEqualTo( DateTime.Now.AddYears( -1 ) ).WithMessage( "Дата публикации не может быть старше 1 года" );

            RuleFor( x => x.Status )
                .IsInEnum().WithMessage( "Некорректный статус поста" );

            RuleFor( x => x.UserId )
                .GreaterThan( 0 ).WithMessage( "ID пользователя должен быть больше 0" );

            RuleFor( x => x.FandomId )
                .GreaterThan( 0 ).WithMessage( "ID фандома должен быть больше 0" );

            RuleFor( x => x.CategoryId )
                .GreaterThan( 0 ).WithMessage( "ID категории должен быть больше 0" );
        }
    }
}
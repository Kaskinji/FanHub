using Domain.Entities;
using FluentValidation;

namespace Domain.Validators
{
    public class GameValidator : AbstractValidator<Game>
    {
        public GameValidator()
        {
            RuleFor( x => x.Title )
                .NotEmpty().WithMessage( "Название игры обязательно" )
                .Length( 1, 128 ).WithMessage( "Название должно быть от 1 до 128 символов" )
                .Matches( "^[a-zA-Zа-яА-Я0-9\\s\\-\\.!:&()+']+$" ).WithMessage( "Название содержит недопустимые символы" )
                .Must( title => !string.IsNullOrWhiteSpace( title ) ).WithMessage( "Название не может состоять только из пробелов" );

            RuleFor( x => x.Description )
                .NotEmpty().WithMessage( "Описание игры обязательно" )
                .MinimumLength( 10 ).WithMessage( "Описание должно быть не менее 10 символов" )
                .MaximumLength( 500 ).WithMessage( "Описание не может превышать 500 символов" )
                .When( x => !string.IsNullOrEmpty( x.Description ) );

            RuleFor( x => x.ReleaseDate )
                .NotEmpty().WithMessage( "Дата релиза обязательна" )
                .LessThanOrEqualTo( DateTime.Now ).WithMessage( "Дата релиза не может быть в будущем" )
                .GreaterThanOrEqualTo( new DateTime( 1980, 1, 1 ) ).WithMessage( "Дата релиза не может быть раньше 1980 года" );

            RuleFor( x => x.Developer )
                .NotEmpty().WithMessage( "Разработчик обязателен" )
                .Length( 1, 128 ).WithMessage( "Название разработчика должно быть от 1 до 128 символов" )
                .Matches( "^[a-zA-Zа-яА-Я0-9\\s\\-\\.&]+$" ).WithMessage( "Название разработчика содержит недопустимые символы" );

            RuleFor( x => x.Publisher )
                .NotEmpty().WithMessage( "Издатель обязателен" )
                .Length( 1, 128 ).WithMessage( "Название издателя должно быть от 1 до 128 символов" )
                .Matches( "^[a-zA-Zа-яА-Я0-9\\s\\-\\.&]+$" ).WithMessage( "Название издателя содержит недопустимые символы" )
                .When( x => !string.IsNullOrEmpty( x.Publisher ) );

            RuleFor( x => x.CoverImage )
                .NotEmpty().WithMessage( "Обложка игры обязательна" )
                .MaximumLength( 500 ).WithMessage( "Путь к обложке не может превышать 500 символов" )
                .Must( BeValidImageUrl ).WithMessage( "Некорректный URL обложки" )
                .When( x => !string.IsNullOrEmpty( x.CoverImage ) );

            RuleFor( x => x.Genre )
                .NotEmpty().WithMessage( "Жанр обязателен" )
                .Length( 1, 50 ).WithMessage( "Жанр должен быть от 1 до 50 символов" )
                .Matches( "^[a-zA-Zа-яА-Я\\s\\-/]+$" ).WithMessage( "Жанр содержит недопустимые символы" );
        }

        private bool BeValidImageUrl( string url )
        {
            if ( string.IsNullOrEmpty( url ) )
            {
                return false;
            }

            if ( !Uri.TryCreate( url, UriKind.Absolute, out Uri? uriResult ) )
            {
                return false;
            }

            if ( uriResult.Scheme != Uri.UriSchemeHttp && uriResult.Scheme != Uri.UriSchemeHttps )
            {
                return false;
            }

            string[] allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
            string? extension = Path.GetExtension( uriResult.AbsolutePath )?.ToLower();

            return allowedExtensions.Contains( extension );
        }
    }
}
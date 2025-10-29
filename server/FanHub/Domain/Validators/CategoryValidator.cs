using Domain.Entities;
using FluentValidation;

namespace Domain.Validators
{
    public class CategoryValidator : AbstractValidator<Category>
    {
        public CategoryValidator()
        {

            RuleFor( x => x.Name )
                .NotEmpty().WithMessage( "Название категории обязательно" )
                .Length( 2, 256 ).WithMessage( "Название должно быть от 2 до 256 символов" )
                .Matches( "^[a-zA-Zа-яА-Я0-9\\s\\-\\.]+$" ).WithMessage( "Название может содержать только буквы, цифры, пробелы, дефисы и точки" )
                .Must( name => !string.IsNullOrWhiteSpace( name ) ).WithMessage( "Название не может состоять только из пробелов" );


            RuleFor( x => x.Icon )
                .NotEmpty().WithMessage( "Иконка категории обязательна" )
                .MaximumLength( 500 ).WithMessage( "Путь к иконке не может превышать 500 символов" )
                .Must( BeValidIconPath ).WithMessage( "Некорректный путь к иконке" )
                .When( x => !string.IsNullOrEmpty( x.Icon ) );
        }
        private bool BeValidIconPath( string iconPath )
        {
            if ( string.IsNullOrEmpty( iconPath ) )
            {
                return true;
            }

            string[] allowedExtensions = new[] { ".png", ".jpg", ".jpeg", ".svg", ".gif", ".ico" };
            string? extension = Path.GetExtension( iconPath )?.ToLower();

            return Uri.TryCreate( iconPath, UriKind.Absolute, out _ ) ||
                   ( allowedExtensions.Contains( extension ) && !iconPath.Contains( ".." ) );
        }
    }
}
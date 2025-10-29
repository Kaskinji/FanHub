using Domain.Entities;
using Domain.Enums;
using FluentValidation;
using System.Text.RegularExpressions;

namespace Domain.Validators
{
    public class UserValidator : AbstractValidator<User>
    {
        public UserValidator()
        {
            RuleFor( x => x.UserId )
                .GreaterThanOrEqualTo( 0 ).WithMessage( "ID пользователя должен быть неотрицательным" );

            RuleFor( x => x.Username )
                .NotEmpty().WithMessage( "Имя пользователя обязательно" )
                .Length( 3, 256 ).WithMessage( "Имя пользователя должно быть от 3 до 256 символов" )
                .Matches( "^[a-zA-Z0-9_]+$" ).WithMessage( "Имя пользователя может содержать только буквы, цифры и подчеркивания" )
                .Must( username => !username.All( char.IsDigit ) ).WithMessage( "Имя пользователя не может состоять только из цифр" );

            RuleFor( x => x.Email )
                .NotEmpty().WithMessage( "Email обязателен" )
                .MaximumLength( 256 ).WithMessage( "Email не может превышать 256 символов" )
                .EmailAddress().WithMessage( "Некорректный формат email" )
                .Must( email => !email.Contains( "+" ) ).WithMessage( "Email не должен содержать '+'" )
                .When( x => !string.IsNullOrEmpty( x.Email ) );

            RuleFor( x => x.PasswordHash )
                .NotEmpty().WithMessage( "Пароль обязателен" )
                .MinimumLength( 8 ).WithMessage( "Пароль должен быть не менее 8 символов" )
                .MaximumLength( 256 ).WithMessage( "Пароль слишком длинный" )
                .Must( BeStrongPassword ).WithMessage( "Пароль должен содержать минимум 1 заглавную букву, 1 цифру и 1 специальный символ" )
                .When( x => !string.IsNullOrEmpty( x.PasswordHash ) );

            RuleFor( x => x.Avatar )
                .MaximumLength( 500 ).WithMessage( "URL аватара не может превышать 500 символов" )
                .Must( BeValidImageUrl ).WithMessage( "Некорректный URL аватара" )
                .When( x => !string.IsNullOrEmpty( x.Avatar ) );

            RuleFor( x => x.RegistrationDate )
                .LessThanOrEqualTo( DateTime.UtcNow ).WithMessage( "Дата регистрации не может быть в будущем" )
                .GreaterThanOrEqualTo( new DateTime( 2020, 1, 1 ) ).WithMessage( "Дата регистрации некорректна" );

            RuleFor( x => x.Role )
                .IsInEnum().WithMessage( "Некорректная роль пользователя" )
                .Must( role => role != UserRole.Admin ).WithMessage( "Нельзя напрямую устанавливать роль Admin" )
                .When( x => x.UserId == 0 );
        }

        private bool BeStrongPassword( string password )
        {
            if ( string.IsNullOrEmpty( password ) )
            {
                return false;
            }

            // мин 8 символов, 1 заглавная, 1 цифра, 1 специальный символ
            Regex hasUpperCase = new Regex( @"[A-Z]" );
            Regex hasLowerCase = new Regex( @"[a-z]" );
            Regex hasDigit = new Regex( @"[0-9]" );
            Regex hasSpecialChar = new Regex( @"[!@#$%^&*()_+\-=\[\]{};':""\\|,.<>\/?]" );

            return hasUpperCase.IsMatch( password ) &&
                   hasLowerCase.IsMatch( password ) &&
                   hasDigit.IsMatch( password ) &&
                   hasSpecialChar.IsMatch( password );
        }

        private bool BeValidImageUrl( string url )
        {
            if ( string.IsNullOrEmpty( url ) )
            {
                return true;
            }

            if ( !Uri.TryCreate( url, UriKind.Absolute, out Uri? uriResult ) )
            {
                return false;
            }

            if ( uriResult.Scheme != Uri.UriSchemeHttp && uriResult.Scheme != Uri.UriSchemeHttps )
            {
                return false;
            }

            string[] allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp" };
            string? extension = Path.GetExtension( uriResult.AbsolutePath )?.ToLower();

            return allowedExtensions.Contains( extension );
        }
    }
}
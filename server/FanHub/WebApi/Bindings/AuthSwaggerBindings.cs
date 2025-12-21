using System.Security.Claims;
using System.Text;
using Domain.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using WebApi.Options;

namespace WebApi.Bindings
{
    public static class AuthSwaggerBindings
    {
        public static IServiceCollection AddJwtAuthAndSwagger( this IServiceCollection services, IConfiguration configuration )
        {
            AuthCookieOptions? cookieOptions = configuration.GetSection( "AuthCookieOptions" ).Get<AuthCookieOptions>();

            services.AddAuthentication( JwtBearerDefaults.AuthenticationScheme )
                .AddJwtBearer( ( options ) =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes( configuration[ "JwtOptions:Secret" ] ?? "" ) ),
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        RoleClaimType = ClaimTypes.Role,
                    };
                    options.Events = new JwtBearerEvents()
                    {
                        OnMessageReceived = context =>
                        {
                            context.Token = context.Request.Cookies[ cookieOptions!.JwtCookieName ];

                            return Task.CompletedTask;
                        }
                    };
                } );

            services.AddAuthorization( options =>
            {
                options.AddPolicy( "AdminOnly", policy =>
                    policy.RequireRole( UserRoleString.Admin ) );

                options.AddPolicy( "UserOnly", policy =>
                    policy.RequireRole( UserRoleString.User ) );
            } );

            services.AddSwaggerGen( options =>
            {
                options.AddSecurityDefinition( "Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter JWT token in format: Bearer {token}"
                } );

                options.AddSecurityRequirement( new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                } );

            } );

            return services;
        }
    }
}

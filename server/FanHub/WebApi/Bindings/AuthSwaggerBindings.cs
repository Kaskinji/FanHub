using System.Text;
using Application.Options;
using Domain.Enums;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace WebApi.Bindings
{
    public static class AuthSwaggerBindings
    {
        public static IServiceCollection AddJwtAuthAndSwagger( this IServiceCollection services, IConfiguration configuration )
        {
            services.AddAuthentication( JwtBearerDefaults.AuthenticationScheme )
                .AddJwtBearer( options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes( configuration[ "JwtOptions:Secret" ] ?? "" ) ),
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        RoleClaimType = "role",
                    };
                } );

            services.AddAuthorization( options =>
            {
                options.AddPolicy( "AdminOnly", policy =>
                    policy.RequireRole( nameof( UserRole.Admin ) ) );

                options.AddPolicy( "UserOnly", policy =>
                    policy.RequireRole( nameof( UserRole.User ) ) );
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

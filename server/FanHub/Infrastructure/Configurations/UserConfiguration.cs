using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure( EntityTypeBuilder<User> builder )
        {
            builder.HasKey( u => u.UserId );

            builder.Property( u => u.Username )
                .IsRequired()
                .HasMaxLength( 256 );

            builder.Property( u => u.Email )
                .IsRequired()
                .HasMaxLength( 256 );

            builder.Property( u => u.PasswordHash )
                .IsRequired()
                .HasMaxLength( 256 );

            builder.Property( u => u.Avatar )
                .HasMaxLength( 256 );

            builder.Property( u => u.RegistrationDate )
                .IsRequired();

            builder.Property( u => u.Role )
                .IsRequired()
                .HasConversion<byte>();
        }
    }
}
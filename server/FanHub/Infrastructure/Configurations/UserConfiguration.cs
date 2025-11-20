using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure( EntityTypeBuilder<User> builder )
        {
            builder.HasKey( u => u.Id );

            builder.Property( u => u.Username )
                .IsRequired()
                .HasMaxLength( 64 );

            builder.Property( u => u.Login )
                .IsRequired()
                .HasMaxLength( 128 );

            builder.Property( u => u.PasswordHash )
                .IsRequired()
                .HasMaxLength( 256 );

            builder.Property( u => u.Avatar )
                .HasMaxLength( 1000 );

            builder.Property( u => u.RegistrationDate )
                .IsRequired();

            builder.HasMany( u => u.Reactions )
                .WithOne( r => r.User )
                .HasForeignKey( r => r.UserId )
                .OnDelete( DeleteBehavior.Cascade );

            builder.HasMany( u => u.Events )
                .WithOne( e => e.Organizer )
                .HasForeignKey( e => e.OrganizerId )
                .OnDelete( DeleteBehavior.Cascade );

            builder.HasMany( u => u.Comments )
                .WithOne( c => c.User )
                .HasForeignKey( c => c.UserId )
                .OnDelete( DeleteBehavior.Cascade );

            builder.HasMany( u => u.Notifications )
                .WithOne( n => n.User )
                .HasForeignKey( n => n.UserId )
                .OnDelete( DeleteBehavior.Cascade );

            builder.HasMany( u => u.Subscriptions )
                .WithOne( s => s.User )
                .HasForeignKey( s => s.UserId )
                .OnDelete( DeleteBehavior.Cascade );

            builder.HasMany( u => u.Posts )
                .WithOne( p => p.User )
                .HasForeignKey( p => p.UserId )
                .OnDelete( DeleteBehavior.Cascade );

            builder.HasIndex( u => u.Username ).IsUnique();
            builder.HasIndex( u => u.Login ).IsUnique();
            builder.HasIndex( u => u.RegistrationDate );
        }
    }
}
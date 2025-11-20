using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
    public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
    {
        public void Configure( EntityTypeBuilder<Notification> builder )
        {
            builder.HasKey( n => n.Id );

            builder.Property( n => n.UserId ).IsRequired();
            builder.Property( n => n.PostId );
            builder.Property( n => n.EventId );
            builder.Property( n => n.Content )
                .IsRequired()
                .HasMaxLength( 500 );

            builder.HasOne( n => n.User )
                .WithMany()
                .HasForeignKey( n => n.UserId )
                .OnDelete( DeleteBehavior.Restrict );

            builder.HasOne( n => n.Post )
                .WithMany()
                .HasForeignKey( n => n.PostId )
                .OnDelete( DeleteBehavior.SetNull );

            builder.HasOne( n => n.Event )
                .WithMany()
                .HasForeignKey( n => n.EventId )
                .OnDelete( DeleteBehavior.SetNull );

            builder.HasIndex( n => n.UserId );
            builder.HasIndex( n => n.PostId );
            builder.HasIndex( n => n.EventId );
        }
    }
}

using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
    public class NotificationViewedConfiguration : IEntityTypeConfiguration<NotificationViewed>
    {
        public void Configure( EntityTypeBuilder<NotificationViewed> builder )
        {
            builder.HasKey( nv => nv.Id );

            builder.Property( nv => nv.NotificationId )
                .IsRequired();

            builder.Property( nv => nv.UserId )
                .IsRequired();

            builder.Property( nv => nv.ViewedAt )
                .IsRequired();

            builder.Property( nv => nv.IsHidden )
                .IsRequired()
                .HasDefaultValue( false );

            builder.HasIndex( nv => nv.NotificationId );
            builder.HasIndex( nv => nv.IsHidden );
            builder.HasIndex( nv => nv.UserId );
            builder.HasIndex( nv => nv.ViewedAt );
            builder.HasIndex( nv => new { nv.NotificationId, nv.UserId } ).IsUnique();

            builder.HasOne( nv => nv.Notification )
                .WithMany( n => n.NotificationsViewed )
                .HasForeignKey( nv => nv.NotificationId )
                .OnDelete( DeleteBehavior.ClientCascade );

            builder.HasOne( nv => nv.User )
                .WithMany( u => u.NotificationsViewed )
                .HasForeignKey( nv => nv.UserId )
                .OnDelete( DeleteBehavior.Cascade );
        }
    }
}


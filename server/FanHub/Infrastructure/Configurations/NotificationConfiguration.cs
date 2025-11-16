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

            builder.Property( n => n.UserId )
                .IsRequired();

            builder.Property( n => n.PostId );

            builder.Property( n => n.EventId );

            builder.Property( n => n.Content )
                .IsRequired()
                .HasMaxLength( 500 );

            builder.Property( n => n.Type )
                .IsRequired()
                .HasConversion<byte>();
        }
    }
}

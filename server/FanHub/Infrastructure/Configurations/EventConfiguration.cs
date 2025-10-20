using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
    public class EventConfiguration : IEntityTypeConfiguration<Event>
    {
        public void Configure( EntityTypeBuilder<Event> builder )
        {
            builder.HasKey( e => e.Id );

            builder.Property( e => e.FandomId )
                .IsRequired();

            builder.Property( e => e.OrganizerId )
                .IsRequired();

            builder.Property( e => e.Title )
                .IsRequired()
                .HasMaxLength( 128 );

            builder.Property( e => e.Description )
                .IsRequired()
                .HasMaxLength( 500 );

            builder.Property( e => e.Status )
                .IsRequired()
                .HasConversion<byte>();

            builder.HasOne( e => e.Fandom )
                .WithMany()
                .HasForeignKey( e => e.FandomId );
        }
    }
}

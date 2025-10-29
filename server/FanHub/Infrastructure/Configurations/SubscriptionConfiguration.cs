using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
    public class SubscriptionConfiguration : IEntityTypeConfiguration<Subscription>
    {
        public void Configure( EntityTypeBuilder<Subscription> builder )
        {
            builder.HasKey( s => s.SubscriptionId );

            builder.Property( s => s.UserId )
                .IsRequired();

            builder.Property( s => s.FandomId )
                .IsRequired()
                .HasMaxLength( 100 );

            builder.Property( s => s.Date )
                .IsRequired();

            builder.HasOne( s => s.User )
                .WithMany()
                .HasForeignKey( s => s.UserId );

            builder.HasOne( s => s.Fandom )
                .WithMany()
                .HasForeignKey( s => s.FandomId );
        }
    }
}
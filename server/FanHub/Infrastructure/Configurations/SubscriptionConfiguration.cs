using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
    public class SubscriptionConfiguration : IEntityTypeConfiguration<Subscription>
    {
        public void Configure( EntityTypeBuilder<Subscription> builder )
        {
            builder.HasKey( s => s.Id );

            builder.Property( s => s.UserId )
                .IsRequired();

            builder.Property( s => s.FandomId )
                .IsRequired();

            builder.Property( s => s.Date )
                .IsRequired();
        }
    }
}
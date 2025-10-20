using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
    public class ReactionConfiguration : IEntityTypeConfiguration<Reaction>
    {
        public void Configure( EntityTypeBuilder<Reaction> builder )
        {
            builder.HasKey( r => r.Id );

            builder.Property( r => r.UserId )
                .IsRequired();

            builder.Property( r => r.PostId )
                .IsRequired();

            builder.Property( r => r.Date )
                .IsRequired();

            builder.Property( r => r.Type )
                .IsRequired()
                .HasConversion<byte>();

            builder.HasOne( r => r.User )
                .WithMany()
                .HasForeignKey( r => r.UserId );

            builder.HasOne( r => r.Post )
                .WithMany()
                .HasForeignKey( r => r.PostId );
        }
    }
}

using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
    public class CategoryConfiguration : IEntityTypeConfiguration<Category>
    {
        public void Configure( EntityTypeBuilder<Category> builder )
        {
            builder.HasKey( c => c.Id );

            builder.Property( c => c.Name )
                .IsRequired()
                .HasMaxLength( 128 );

            builder.Property( c => c.Icon )
                .IsRequired()
                .HasMaxLength( 1000 );

            builder.HasMany( c => c.Posts )
                .WithOne( pc => pc.Category )
                .HasForeignKey( pc => pc.CategoryId );

            builder.HasIndex( c => c.Name );
        }
    }
}

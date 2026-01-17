using Domain.Foundations;

namespace Infrastructure.Foundations
{
    public class UnitOfWork : IUnitOfWork
    {
        FanHubDbContext _dbContext;

        public UnitOfWork( FanHubDbContext dbContext )
        {
            _dbContext = dbContext;
        }

        public async Task CommitAsync()
        {
            _ = await _dbContext.SaveChangesAsync();
        }
    }
}
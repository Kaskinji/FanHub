namespace Infrastructure.Foundations
{
    public class UnitOfWork : IUnitOfWork
    {
        WebApiDbContext _dbContext;

        public UnitOfWork( WebApi dbContext )
        {
            _dbContext = dbContext;
        }

        public async Task CommitAsync()
        {
            _ = await _dbContext.SaveChangesAsync();
        }
    }
}

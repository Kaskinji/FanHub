namespace Domain.Foundations
{
    public class UnitOfWork : IUnitOfWork
    {
        WebApiDbContext _dbContext;

        public UnitOfWork( WebApiDbContext dbContext )
        {
            _dbContext = dbContext;
        }

        public async Task CommitAsync()
        {
            _ = await _dbContext.SaveChangesAsync();
        }
    }
}

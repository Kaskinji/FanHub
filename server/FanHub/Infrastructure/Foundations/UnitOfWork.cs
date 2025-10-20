namespace Infrastructure.Foundations
{
    public interface IUnitOfWork
    {
        public Task CommitAsync();
    }
}
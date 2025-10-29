namespace Domain.Foundations
{
    public interface IUnitOfWork
    {
        public Task CommitAsync();
    }
}

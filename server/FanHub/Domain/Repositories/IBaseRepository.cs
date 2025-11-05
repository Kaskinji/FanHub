namespace Domain.Repositories
{
    public interface IBaseRepository<TEntity> where TEntity : class
    {
        Task CreateAsync( TEntity entity );

        Task<List<TEntity>> GetAllAsync();
        Task<TEntity?> GetByIdAsync( int id );
        void Update( TEntity entity );

        void Delete( TEntity entity );
    }
}
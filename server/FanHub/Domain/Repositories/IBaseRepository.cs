using Domain.Entities;
using System.Linq.Expressions;

namespace Domain.Repositories
{
    public interface IBaseRepository<TEntity> where TEntity : class
    {
        Task CreateAsync( TEntity entity );

        Task<List<TEntity>> GetAllAsync();
        Task<TEntity?> GetByIdAsync( int id );
        void Update( TEntity entity );

        void Delete( TEntity entity );

        Task<TEntity?> FindAsync( Expression<Func<TEntity, bool>> predicate );
        Task<List<TEntity>> FindAllAsync( Expression<Func<TEntity, bool>> predicate );
    }
}
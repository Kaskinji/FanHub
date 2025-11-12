using System.Linq.Expressions;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class BaseRepository<TEntity> : IBaseRepository<TEntity> where TEntity : class
    {
        protected readonly DbSet<TEntity> _entities;

        public BaseRepository( FanHubDbContext fanhubDbContext )
        {
            _entities = fanhubDbContext.Set<TEntity>();
        }

        public async Task CreateAsync( TEntity entity )
        {
            await _entities.AddAsync( entity );
        }

        public virtual async Task<List<TEntity>> GetAllAsync()
        {
            return await _entities.ToListAsync();
        }

        public virtual async Task<TEntity?> GetByIdAsync( int id )
        {
            return await _entities.FindAsync( id );
        }

        public void Update( TEntity entity )
        {
            _entities.Update( entity );
        }

        public void Delete( TEntity entity )
        {
            _entities.Remove( entity );
        }

        public async Task<TEntity?> FindAsync( Expression<Func<TEntity, bool>> predicate )
        {
            return await _entities.FirstOrDefaultAsync( predicate );
        }

        public async Task<List<TEntity>> FindAllAsync( Expression<Func<TEntity, bool>> predicate )
        {
            return await _entities.Where( predicate ).ToListAsync();
        }
    }
}

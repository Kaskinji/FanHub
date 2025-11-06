using Domain.Repositories;

namespace Domain.Extensions
{
    public static class RepositoryExtensions
    {
        public static async Task<TEntity> GetByIdAsyncThrow<TEntity>( this IBaseRepository<TEntity> repository,
    int id ) where TEntity : class
        {
            TEntity? entity = await repository.GetByIdAsync( id );
            if ( entity is null )
            {
                throw new KeyNotFoundException( $"Entity with id {id} is not found" );
            }

            return entity;
        }
    }
}

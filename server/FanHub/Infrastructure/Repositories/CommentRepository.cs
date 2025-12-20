using Application.Dto.CommentDto;
using System.Xml.Linq;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class CommentRepository : BaseRepository<Comment>, ICommentRepository
    {
        public CommentRepository( FanHubDbContext fanhubDbContext ) : base( fanhubDbContext )
        {
        }

        public async Task<List<Comment>> GetCommentsAsync()
        {
            return await _entities
                .Include( c => c.User )
                .Include( c => c.Post )
                .OrderByDescending( c => c.CommentDate )
                .ToListAsync();
        }
        public async Task<List<Comment>> GetCommentsByPostIdAsync( int postId )
        {
            bool postExists = await _entities.AnyAsync( p => p.Id == postId );
            if ( !postExists )
            {
                throw new KeyNotFoundException( $"Post {postId} not exist" );
            }

            return await _entities
                .Include( c => c.User )
                .Include( c => c.Post )
                .Where( c => c.PostId == postId )
                .OrderByDescending( c => c.CommentDate )
                .ToListAsync();
        }
    }
}

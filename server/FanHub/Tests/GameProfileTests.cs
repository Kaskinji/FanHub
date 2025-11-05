using Application.Dto.GameDto;
using Application.Mapping;
using AutoMapper;
using Domain.Entities;
using FluentAssertions;

namespace Tests
{
    public class GameProfileTests
    {
        private IMapper _mapper = CreateMapper();

        [Fact]
        public void Map_From_Update_Dto_With_Default_Date()
        {
            DateTime date = DateTime.Now;

            Game game = new()
            {
                ReleaseDate = date,
                Title = "Test",
                CoverImage = "https://s3.stroi-news.ru/img/klassnie-kartinki-dlya-devochek-4.jpg",
                Description = "Test description",
                Publisher = "Test publisher",
                Developer = "Test developer",
                Genre = "Test genre",
            };

            GameUpdateDto dto = new()
            {
                ReleaseDate = default,
                Title = "Testttt"
            };

            _mapper.Map( dto, game );

            game.ReleaseDate.Should().Be( date );
        }

        private static IMapper CreateMapper()
        {
            MapperConfiguration configuration = new MapperConfiguration( cfg =>
            {
                cfg.AddProfile<GameProfile>();
            } );

            configuration.AssertConfigurationIsValid();

            return configuration.CreateMapper();
        }
    }
}
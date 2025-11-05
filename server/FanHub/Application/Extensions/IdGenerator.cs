namespace Application.Extensions
{
    public static class IdGenerator
    {
        public static int GenerateId()
        {
            Random rnd = new Random();

            return rnd.Next( 1, int.MaxValue );
        }
    }
}

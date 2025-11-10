using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
public class FandomWithStatsDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string GameName { get; set; } = string.Empty;
    public int PostCount { get; set; }
    public int MemberCount { get; set; }
    public DateTime CreationDate { get; set; }
}

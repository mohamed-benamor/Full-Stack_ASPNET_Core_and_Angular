namespace API.Entities;

using System.Text.Json.Serialization;

public class Photo
{
  public int Id { get; set; }
  public required string Url { get; set; }
  public string? PublicId { get; set; }

  [JsonIgnore]
  public Member Member { get; set; } = null!;
}

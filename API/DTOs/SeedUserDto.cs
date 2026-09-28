namespace API.DTOs;

public record class SeedUserDto
{
  public string Id { get; set; } = null!;
  public required string DisplayName { get; set; }
  public required string Email { get; set; }
  public required string Gender { get; set; }
  public required string City { get; set; }
  public required string Country { get; set; }
  public DateOnly DateOfBirth { get; set; }
  public string? Description { get; set; }
  public string? ImageUrl { get; set; }
  public DateTime Created { get; set; }
  public DateTime LastActive { get; set; }
}

namespace API.DTOs;

using System.ComponentModel.DataAnnotations;

public record class LoginDto
{
  [Required]
  [EmailAddress]
  public required string Email { get; set; }

  [Required]
  [MinLength(4)]
  public required string Password { get; set; }
}

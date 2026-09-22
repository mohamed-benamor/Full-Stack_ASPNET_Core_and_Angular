using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public record RegisterDto(
  [Required] string DisplayName,
  [Required] [EmailAddress] string Email,
  [Required] [MinLength(4)] string Password
);

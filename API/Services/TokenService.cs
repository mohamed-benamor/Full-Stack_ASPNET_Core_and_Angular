namespace API.Services;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Entities;
using API.Interfaces;
using Microsoft.IdentityModel.Tokens;

public class TokenService(IConfiguration configuration) : ITokenService
{
  public string CreateToken(AppUser user)
  {
    var jwtSecret = configuration["JwtSecret"] ?? throw new Exception("Cannot get token key");

    if (jwtSecret.Length < 64)
    {
      throw new Exception("Your token key must be 64 characters long or greater");
    }

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));

    var claims = new List<Claim>
    {
      new(ClaimTypes.NameIdentifier, user.Id),
      new(ClaimTypes.Email, user.Email),
    };

    var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

    var tokenDescriptor = new SecurityTokenDescriptor
    {
      Subject = new ClaimsIdentity(claims),
      Expires = DateTime.UtcNow.AddDays(1),
      SigningCredentials = credentials,
    };

    var tokenHandler = new JwtSecurityTokenHandler();
    var token = tokenHandler.CreateToken(tokenDescriptor);

    return tokenHandler.WriteToken(token);
  }
}

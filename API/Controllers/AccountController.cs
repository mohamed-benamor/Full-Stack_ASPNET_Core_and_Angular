namespace API.Controllers;

using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class AccountController(AppDbContext context, ITokenService tokenService) : BaseApiController
{
  [HttpPost("register")]
  public async Task<ActionResult<UserDto>> Register(RegisterDto body)
  {
    if (await IsEmailExists(body.Email))
    {
      return BadRequest("Email is already registered");
    }

    using var hmac = new HMACSHA512();

    var user = new AppUser
    {
      DisplayName = body.DisplayName,
      Email = body.Email,
      PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(body.Password)),
      PasswordSalt = hmac.Key,
    };

    context.Users.Add(user);
    await context.SaveChangesAsync();

    return user.ToDto(tokenService);
  }

  [HttpPost("login")]
  public async Task<ActionResult<UserDto>> Login(LoginDto body)
  {
    var user = await context.Users.SingleOrDefaultAsync(user => user.Email == body.Email);

    if (user is null)
    {
      return Unauthorized("Invalid credentials");
    }

    using var hmac = new HMACSHA512(user.PasswordSalt);

    var computeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(body.Password));

    for (var i = 0; i < computeHash.Length; i++)
    {
      if (computeHash[i] != user.PasswordHash[i])
      {
        return Unauthorized("Invalid credentials");
      }
    }

    return user.ToDto(tokenService);
  }

  private async Task<bool> IsEmailExists(string email)
  {
    return await context.Users.AnyAsync(user => user.Email.ToLower() == email.ToLower());
  }
}

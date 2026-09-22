namespace API.Controllers;

using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class AccountController(AppDbContext context) : BaseApiController
{
  [HttpPost("register")]
  public async Task<ActionResult<AppUser>> Register(RegisterDto body)
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

    return user;
  }

  private async Task<bool> IsEmailExists(string email)
  {
    return await context.Users.AnyAsync(user => user.Email.ToLower() == email.ToLower());
  }
}

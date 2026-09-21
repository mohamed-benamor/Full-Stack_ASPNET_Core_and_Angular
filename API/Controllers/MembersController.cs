namespace API.Controllers;

using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class MembersController(AppDbContext context) : ControllerBase
{
  [HttpGet]
  public ActionResult<IReadOnlyList<AppUser>> GetMembers()
  {
    var members = context.Users.ToList();

    return members;
  }

  [HttpGet("{id}")]
  public ActionResult<AppUser> GetMember(string id)
  {
    var member = context.Users.Find(id);

    return member is null ? NotFound() : member;
  }
}

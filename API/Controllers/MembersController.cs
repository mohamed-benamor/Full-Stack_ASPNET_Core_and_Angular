namespace API.Controllers;

using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
public class MembersController(IMemberRepository repository) : BaseApiController
{
  [HttpGet]
  public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers()
  {
    return Ok(await repository.GetMembersAsync());
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<Member>> GetMember(string id)
  {
    var member = await repository.GetMemberByIdAsync(id);

    return member is null ? NotFound() : Ok(member);
  }

  [HttpGet("{id}/photos")]
  public async Task<ActionResult<IReadOnlyList<Photo>>> GetMemberPhotos(string id)
  {
    return Ok(await repository.GetPhotosForMemberAsync(id));
  }
}

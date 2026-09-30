namespace API.Controllers;

using API.DTOs;
using API.Entities;
using API.Extensions;
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

  [HttpPut]
  public async Task<ActionResult> UpdateRequest(MemberUpdateDto body)
  {
    var memberId = User.GetMemberId();

    var member = await repository.GetMemberForUpdate(memberId);

    if (member is null)
    {
      return BadRequest("Could not found member");
    }

    member.DisplayName = body.DisplayName ?? member.DisplayName;
    member.Description = body.Description ?? member.Description;
    member.City = body.City ?? member.City;
    member.Country = body.Country ?? member.Country;

    member.User.DisplayName = member.DisplayName;

    repository.Update(member);

    if (await repository.SaveAllAsync())
    {
      return NoContent();
    }

    return BadRequest("Faild to update member");
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

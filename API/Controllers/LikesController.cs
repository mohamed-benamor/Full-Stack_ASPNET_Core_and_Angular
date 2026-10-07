namespace API.Controllers;

using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

public class LikesController(ILikeRepository repository) : BaseApiController
{
  [HttpPost("{targetMemberId}")]
  public async Task<ActionResult> ToggleLike(string targetMemberId)
  {
    var sourceMemberId = User.GetMemberId();

    if (sourceMemberId == targetMemberId)
    {
      return BadRequest("You cannot like yourself");
    }

    var existingLike = await repository.GetMemberLike(sourceMemberId, targetMemberId);

    if (existingLike is null)
    {
      var like = new MemberLike
      {
        SourceMemberId = sourceMemberId,
        TargetMemberId = targetMemberId,
      };

      repository.AddLike(like);
    }
    else
    {
      repository.DeleteLike(existingLike);
    }

    if (await repository.SaveAllAsync())
    {
      return Ok();
    }

    return BadRequest("Faild to update like");
  }

  [HttpGet("list")]
  public async Task<ActionResult<IReadOnlyList<string>>> GetCurrentMemberLikeIds()
  {
    return Ok(await repository.GetCurrentMemberLikeIds(User.GetMemberId()));
  }

  [HttpGet]
  public async Task<ActionResult<IReadOnlyList<Member>>> GetMemberLikes(
    [FromQuery] LikesParam likesParam
  )
  {
    likesParam.MemberId = User.GetMemberId();
    var members = await repository.GetMemberLikes(likesParam);

    return Ok(members);
  }
}

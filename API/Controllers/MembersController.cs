namespace API.Controllers;

using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
public class MembersController(IMemberRepository repository, IPhotoService photoService)
  : BaseApiController
{
  [HttpGet]
  public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers(
    [FromQuery] MemberParams memberParams
  )
  {
    memberParams.CurrentMemberId = User.GetMemberId();

    return Ok(await repository.GetMembersAsync(memberParams));
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

  [HttpPost("add-photo")]
  public async Task<ActionResult<Photo>> AddPhoto([FromForm] IFormFile file)
  {
    var member = await repository.GetMemberForUpdate(User.GetMemberId());

    if (member is null)
    {
      return BadRequest("Cannot update member");
    }

    var result = await photoService.UploadPhotoAsync(file);

    if (result.Error != null)
    {
      return BadRequest(result.Error.Message);
    }

    var photo = new Photo { Url = result.SecureUrl.AbsoluteUri, PublicId = result.PublicId };

    if (member.ImageUrl is null)
    {
      member.ImageUrl = photo.Url;
      member.User.ImageUrl = photo.Url;
    }

    member.Photos.Add(photo);

    if (await repository.SaveAllAsync())
    {
      return photo;
    }

    return BadRequest("Problem adding photo");
  }

  [HttpPut("profile-photo/{photoId}")]
  public async Task<ActionResult> UpdateProfilePhoto(int photoId)
  {
    var member = await repository.GetMemberForUpdate(User.GetMemberId());

    if (member is null)
    {
      return BadRequest("Cannot get member from token");
    }

    var photo = member.Photos.SingleOrDefault(photo => photo.Id == photoId);

    if (photo is null || member.ImageUrl == photo.Url)
    {
      return BadRequest("Cannot set this as main image");
    }

    member.ImageUrl = photo.Url;
    member.User.ImageUrl = photo.Url;

    if (await repository.SaveAllAsync())
    {
      return NoContent();
    }

    return BadRequest("Problem setting main photo");
  }

  [HttpDelete("delete-photo/{photoId}")]
  public async Task<ActionResult> DeletePhoto(int photoId)
  {
    var member = await repository.GetMemberForUpdate(User.GetMemberId());

    if (member is null)
    {
      return BadRequest("Cannot get member from token");
    }

    var photo = member.Photos.SingleOrDefault(photo => photo.Id == photoId);

    if (photo is null || photo.Url == member.ImageUrl)
    {
      return BadRequest("This photo cannot be deleted");
    }

    if (photo.PublicId != null)
    {
      var result = await photoService.DeletePhotoAsync(photo.PublicId);

      if (result.Error != null)
      {
        return BadRequest(result.Error.Message);
      }
    }

    member.Photos.Remove(photo);

    if (await repository.SaveAllAsync())
    {
      return Ok();
    }

    return BadRequest("Problem deleting the photo");
  }
}

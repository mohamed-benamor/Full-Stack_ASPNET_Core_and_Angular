namespace API.Data;

using System;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

public class LikeRepository(AppDbContext context) : ILikeRepository
{
  public async Task<bool> SaveAllAsync()
  {
    return await context.SaveChangesAsync() > 0;
  }

  public async Task<MemberLike?> GetMemberLike(string sourceMemberId, string targetMemberId)
  {
    return await context.Likes.FindAsync(sourceMemberId, targetMemberId);
  }

  public async Task<IReadOnlyList<Member>> GetMemberLikes(string predicate, string memberId)
  {
    var query = context.Likes.AsQueryable();

    switch (predicate)
    {
      case "liked":
        return await query
          .Where(memberLike => memberLike.SourceMemberId == memberId)
          .Select(memberLike => memberLike.TargetMember)
          .ToListAsync();
      case "likedBy":
        return await query
          .Where(memberLike => memberLike.TargetMemberId == memberId)
          .Select(memberLike => memberLike.SourceMember)
          .ToListAsync();
      default:
        var likeIds = await GetCurrentMemberLikeIds(memberId);

        return await query
          .Where(memberLike =>
            memberLike.TargetMemberId == memberId && likeIds.Contains(memberLike.SourceMemberId)
          )
          .Select(memberLike => memberLike.SourceMember)
          .ToListAsync();
    }
  }

  public async Task<IReadOnlyList<string>> GetCurrentMemberLikeIds(string memberId)
  {
    return await context
      .Likes.Where(memberLike => memberLike.SourceMemberId == memberId)
      .Select(memberLike => memberLike.TargetMemberId)
      .ToListAsync();
  }

  public void AddLike(MemberLike like)
  {
    context.Likes.Add(like);
  }

  public void DeleteLike(MemberLike like)
  {
    context.Likes.Remove(like);
  }
}

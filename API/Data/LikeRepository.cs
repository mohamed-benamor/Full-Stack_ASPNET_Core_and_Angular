namespace API.Data;

using System;
using API.Entities;
using API.Helpers;
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

  public async Task<PaginatedResult<Member>> GetMemberLikes(LikesParam likesParam)
  {
    var query = context.Likes.AsQueryable();

    var result = likesParam.Predicate switch
    {
      "liked" => query
        .Where(memberLike => memberLike.SourceMemberId == likesParam.MemberId)
        .Select(memberLike => memberLike.TargetMember),
      "likedBy" => query
        .Where(memberLike => memberLike.TargetMemberId == likesParam.MemberId)
        .Select(memberLike => memberLike.SourceMember),

      _ => await GetCurrentMemberLikeIdsQuery(query, likesParam.MemberId),
    };

    return await PaginationHelper.CreateAsync(result, likesParam.PageNumber, likesParam.PageSize);
  }

  private async Task<IQueryable<Member>> GetCurrentMemberLikeIdsQuery(
    IQueryable<MemberLike> query,
    string memberId
  )
  {
    var likeIds = await GetCurrentMemberLikeIds(memberId);

    return query
      .Where(memberLike =>
        memberLike.TargetMemberId == memberId && likeIds.Contains(memberLike.SourceMemberId)
      )
      .Select(memberLike => memberLike.SourceMember);
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

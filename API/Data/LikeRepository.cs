namespace API.Data;

using System;
using API.Entities;
using API.Interfaces;

public class LikeRepository : ILikeRepository
{
  public Task<bool> SaveAllAsync()
  {
    throw new NotImplementedException();
  }

  public Task<MemberLike> GetMemberLike(string sourceMemberId, string targetMemberId)
  {
    throw new NotImplementedException();
  }

  public Task<IReadOnlyList<Member>> GetMemberLikes(string predicate, string memberId)
  {
    throw new NotImplementedException();
  }

  public Task<IReadOnlyList<string>> GetCurrentMemberLikeIds(string memberId)
  {
    throw new NotImplementedException();
  }

  public void AddLike(MemberLike like)
  {
    throw new NotImplementedException();
  }

  public void DeleteLike(MemberLike like)
  {
    throw new NotImplementedException();
  }
}

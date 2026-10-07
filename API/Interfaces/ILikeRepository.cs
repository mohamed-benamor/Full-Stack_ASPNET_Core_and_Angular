namespace API.Interfaces;

using API.Entities;

public interface ILikeRepository
{
  Task<bool> SaveAllAsync();
  Task<MemberLike> GetMemberLike(string sourceMemberId, string targetMemberId);
  Task<IReadOnlyList<Member>> GetMemberLikes(string predicate, string memberId);
  Task<IReadOnlyList<string>> GetCurrentMemberLikeIds(string memberId);
  void AddLike(MemberLike like);
  void DeleteLike(MemberLike like);
}

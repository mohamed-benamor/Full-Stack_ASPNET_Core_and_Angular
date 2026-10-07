namespace API.Interfaces;

using API.Entities;
using API.Helpers;

public interface ILikeRepository
{
  Task<bool> SaveAllAsync();
  Task<MemberLike?> GetMemberLike(string sourceMemberId, string targetMemberId);
  Task<PaginatedResult<Member>> GetMemberLikes(LikesParam likesParam);
  Task<IReadOnlyList<string>> GetCurrentMemberLikeIds(string memberId);
  void AddLike(MemberLike like);
  void DeleteLike(MemberLike like);
}

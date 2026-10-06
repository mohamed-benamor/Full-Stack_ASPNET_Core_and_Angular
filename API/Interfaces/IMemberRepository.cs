namespace API.Interfaces;

using API.Entities;
using API.Helpers;

public interface IMemberRepository
{
  Task<bool> SaveAllAsync();
  Task<Member?> GetMemberByIdAsync(string id);
  Task<Member?> GetMemberForUpdate(string id);
  Task<PaginatedResult<Member>> GetMembersAsync(MemberParams memberParams);
  Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId);
  void Update(Member member);
}

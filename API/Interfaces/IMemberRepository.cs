namespace API.Interfaces;

using API.Entities;

public interface IMemberRepository
{
  Task<bool> SaveAllAsync();
  Task<Member?> GetMemberByIdAsync(string id);
  Task<Member?> GetMemberForUpdate(string id);
  Task<IReadOnlyList<Member>> GetMembersAsync();
  Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId);
  void Update(Member member);
}

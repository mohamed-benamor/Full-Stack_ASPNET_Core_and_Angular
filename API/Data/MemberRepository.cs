namespace API.Data;

using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

public class MemberRepository(AppDbContext context) : IMemberRepository
{
  public async Task<Member?> GetMemberByIdAsync(string id)
  {
    return await context.Members.FindAsync(id);
  }

  public async Task<Member?> GetMemberForUpdate(string id)
  {
    return await context
      .Members.Include(member => member.User)
      .Include(member => member.Photos)
      .SingleOrDefaultAsync(user => user.Id == id);
  }

  public async Task<PaginatedResult<Member>> GetMembersAsync(MemberParams memberParams)
  {
    var query = context.Members.AsQueryable();

    query = query.Where(member => member.Id != memberParams.CurrentMemberId);

    if (memberParams.Gender != null)
    {
      query = query.Where(member => member.Gender == memberParams.Gender);
    }

    var minDateOfBirth = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MaxAge - 1));
    var maxDateOfBirth = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MinAge));

    query = query.Where(member =>
      member.DateOfBirth >= minDateOfBirth && member.DateOfBirth <= maxDateOfBirth
    );

    query = memberParams.OrderBy switch
    {
      "created" => query.OrderByDescending(member => member.Created),
      _ => query.OrderByDescending(member => member.LastActive),
    };

    return await PaginationHelper.CreateAsync(
      query,
      memberParams.PageNumber,
      memberParams.PageSize
    );
  }

  public async Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId)
  {
    return await context
      .Members.Where(member => member.Id == memberId)
      .SelectMany(member => member.Photos)
      .ToListAsync();
  }

  public async Task<bool> SaveAllAsync()
  {
    return await context.SaveChangesAsync() > 0;
  }

  public void Update(Member member)
  {
    context.Entry(member).State = EntityState.Modified;
  }
}

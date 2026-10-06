namespace API.Helpers;

using System;

public class MemberParams : PagingParams
{
  public string? Gender { get; set; }
  public string? CurrentMemberId { get; set; }
}

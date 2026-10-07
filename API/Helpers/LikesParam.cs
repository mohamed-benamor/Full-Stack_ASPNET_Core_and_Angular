namespace API.Helpers;

using System;

public class LikesParam : PagingParams
{
  public string MemberId { get; set; } = "";
  public string Predicate { get; set; } = "liked";
}

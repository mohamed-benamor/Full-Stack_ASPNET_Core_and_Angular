namespace API.Rules;

using System.Text.Json;

public static class JsonDefaults
{
  public static readonly JsonNamingPolicy KebabCaseOptions = new KebabCaseNamingPolicy();
}

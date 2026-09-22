using System.Text.RegularExpressions;

namespace API;

public partial class KebabCaseParameterTransformer : IOutboundParameterTransformer
{
  [GeneratedRegex("([a-z])([A-Z])")]
  private partial Regex KababRegex();

  public string? TransformOutbound(object? value)
  {
    return value is null ? null : KababRegex().Replace(value.ToString()!, "$1-$2").ToLower();
  }
}

namespace API.Controllers;

using API.Helpers;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
[ServiceFilter(typeof(LogUserActivity))]
public class BaseApiController : ControllerBase { }

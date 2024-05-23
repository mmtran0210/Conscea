using ConsceaAPI.Data;
using Microsoft.AspNetCore.Mvc;

namespace ConsceaAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CertificatesController : ControllerBase
{
    private readonly AppDbContext _context;

    public CertificatesController(AppDbContext context)
    {
        _context = context;
    }

    // Get all certificates
    [HttpGet]
    public IActionResult Get()
    {
        // Get all certificates from the database
        var certificates = _context.Certificates.ToList();

        return Ok(certificates);
    }
}

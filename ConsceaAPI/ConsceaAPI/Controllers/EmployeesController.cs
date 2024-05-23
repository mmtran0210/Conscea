using Azure.Core;
using ConsceaAPI.Data;
using ConsceaAPI.DTOs;
using ConsceaAPI.Helpers;
using ConsceaAPI.Interfaces;
using ConsceaAPI.Models;
using ConsceaAPI.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace ConsceaAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class EmployeesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IStorageService _storageService;
    private readonly MessageSenderService _messageSenderService;

    public EmployeesController(AppDbContext context, IStorageService storageService, MessageSenderService messageSenderService)
    {
        _context = context;
        _storageService = storageService;
        _messageSenderService = messageSenderService;
    }

    // GET: api/Employees
    [HttpGet]
    public IActionResult Get()
    {
        // Get all employees from the database
        var employees = _context.Employees.ToList();

        return Ok(employees);
    }

    // GET: api/Employees/5
    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        // Get the employee with the specified ID from the database
        var employee = _context.Employees.Find(id);

        if (employee == null)
        {
            // If the employee is not found, return a 404 Not Found response
            throw new NotFoundException("Employee not found", $"Employee with ID {id} not found");
        }

        return Ok(employee);
    }

    // GET: api/Employees/1/certificates
    [HttpGet("{id}/certificates")]
    public IActionResult GetCertificates(int id)
    {
        // Get the employee with the specified ID from the database
        var employee = _context.Employees.Find(id);

        if (employee == null)
        {
            // If the employee is not found, return a 404 Not Found response
            throw new NotFoundException("Employee not found", $"Employee with ID {id} not found");
        }

        // Get the certificates associated with the employee
        // Select everything but the employee
        var certificates = _context.EmployeeCertificates
            .Where(ec => ec.EmployeeID == id)
            .Select(ec => new EmployeeCertificateResponse
            {
                Id = ec.Id,
                Certificate = ec.Certificate,
                CertificationDate = ec.CertificationDate,
                ValidTillDate = ec.ValidTillDate,
                Status = "Valid"
            })
            .ToList();

        // Go through each certificate and add the status of the certificate
        // If valid till date is null, the certificate is still valid, but if it's not null, check if it's expired
        foreach (var certificate in certificates)
        {
            if (certificate.ValidTillDate != null)
            {
                if (certificate.ValidTillDate < DateOnly.FromDateTime(DateTime.Now))
                {
                    // Add a status property to the certificate object


                    certificate.Status = "Expired";
                }
                else
                {
                    certificate.Status = "Valid";
                }
            }
            else
            {
                certificate.Status = "Valid";
            }
        }

        return Ok(certificates);
    }

    // DELETE: api/Employees/5/certificates/1
    [HttpDelete("{id}/certificates/{ecId}")]
    public IActionResult DeleteCertificate(int id, int ecId)
    {
        // Get the employee with the specified ID from the database
        var employee = _context.Employees.Find(id);

        if (employee == null)
        {
            // If the employee is not found, return a 404 Not Found response
            throw new NotFoundException("Employee not found", $"Employee with ID {id} not found");
        }

        // Get the certificate with the specified ID from the database
        var certificate = _context.EmployeeCertificates.FirstOrDefault(ec => ec.Id == ecId);

        if (certificate == null)
        {
            // If the certificate is not found, return a 404 Not Found response
            throw new NotFoundException("Employee Certificate not found", $"Employee Certificate with ID {ecId} not found");
        }

        // Delete the certificate
        _context.EmployeeCertificates.Remove(certificate);
        _context.SaveChanges();

        return Ok();
    }

    // POST: api/Employees/1/certificates
    [HttpPost("{id}/certificates")]
    public async Task<IActionResult> PostCertificate(int id, [FromBody] EmployeeCertificateRequest request)
    {
        // Get the employee with the specified ID from the database
        var employee = _context.Employees.Find(id);

        if (employee == null)
        {
            // If the employee is not found, return a 404 Not Found response
            throw new NotFoundException("Employee not found", $"Employee with ID {id} not found");
        }

        // Get the certificate with the specified ID from the database
        var certificate = _context.Certificates.Find(request.CertificateID);

        if (certificate == null)
        {
            // If the certificate is not found, return a 404 Not Found response
            throw new NotFoundException("Certificate not found", $"Certificate with ID {request.CertificateID} not found");
        }

        // Create a new EmployeeCertificate object
        var employeeCertificate = new EmployeeCertificate
        {
            EmployeeID = id,
            Employee = employee,
            CertificateID = request.CertificateID,
            Certificate = certificate,
            CertificationDate = request.CertificationDate,
            ValidTillDate = request.ValidTillDate
        };

        // Add the new certificate to the database
        _context.EmployeeCertificates.Add(employeeCertificate);
        _context.SaveChanges();

        var message = new
        {
            Body = $"Certificate {certificate.Name} has been added to your profile",
            Subject = "Certificate Added",
            Recipient = employee.Email,
        };

        await _messageSenderService.SendMessageAsync("primaryqueue", JsonSerializer.Serialize(message));

        return Ok();
    }

    // GET: api/Employees/1/certificates/1
    [HttpGet("{id}/certificates/{ecId}")]
    public IActionResult GetCertificate(int id, int ecId)
    {
        // Get the employee with the specified ID from the database
        var employee = _context.Employees.Find(id);

        if (employee == null)
        {
            // If the employee is not found, return a 404 Not Found response
            throw new NotFoundException("Employee not found", $"Employee with ID {id} not found");
        }

        // Get the certificate with the specified ID from the database
        var certificate = _context.EmployeeCertificates.Where(ec => ec.Id == ecId).Select(ec => new EmployeeCertificateResponse
        {
            Id = ec.Id,
            Certificate = ec.Certificate,
            CertificationDate = ec.CertificationDate,
            ValidTillDate = ec.ValidTillDate,
            Status = "Valid"
        }).FirstOrDefault();

        if (certificate == null)
        {
            // If the certificate is not found, return a 404 Not Found response
            throw new NotFoundException("Employee Certificate not found", $"Employee Certificate with ID {ecId} not found");
        }

        return Ok(certificate);
    }

    // PUT: api/Employees/1/certificates
    [HttpPut("{id}/certificates/{ecId}")]
    public async Task<IActionResult> PutCertificate(int id, int ecId, [FromBody] EmployeeCertificateRequest request)
    {
        // Get the employee with the specified ID from the database
        var employee = _context.Employees.Find(id);

        if (employee == null)
        {
            // If the employee is not found, return a 404 Not Found response
            throw new NotFoundException("Employee not found", $"Employee with ID {id} not found");
        }

        // Get the certifcate from the database
        var certificate = _context.Certificates.Find(request.CertificateID);

        if (certificate == null)
        {
            // If the certificate is not found, return a 404 Not Found response
            throw new NotFoundException("Certificate not found", $"Certificate with ID {request.CertificateID} not found");
        }

        // Get the certificate with the specified ID from the database
        var ec = _context.EmployeeCertificates.FirstOrDefault(ec => ec.Id == ecId);

        if (ec == null)
        {
            // If the certificate is not found, return a 404 Not Found response
            throw new NotFoundException("Employee Certificate not found", $"The Employee Certificate was not found");
        }

        // Update the certificate
        ec.CertificateID = request.CertificateID;
        ec.CertificationDate = request.CertificationDate;
        ec.ValidTillDate = request.ValidTillDate;

        _context.SaveChanges();

        var message = new
        {
            Body = $"Hello, {employee.FirstName} Your certificate details have been updated: Certificate: {certificate.Name} Certification Date: {request.CertificationDate} Valid Till: {request.ValidTillDate}",
            Subject = "Certificate Updated",
            Recipient = employee.Email,
        };

        await _messageSenderService.SendMessageAsync("primaryqueue", JsonSerializer.Serialize(message));

        return Ok();
    }

    // POST: api/Employees/1/Picture
    [HttpPost("{id}/Picture")]
    public async Task <IActionResult> PostPicture(int id, IFormFile avatarFile)
    {
        // Find the employee
        var employee = _context.Employees.Find(id) ?? throw new NotFoundException("Employee not found", $"Employee with ID {id} not found");

        using var stream = avatarFile.OpenReadStream();
        using Stream normalizedAvatar = AvatarService.NormalizeAvatar(stream);
        var newFileName = Guid.NewGuid().ToString() + ".jpg";

        var avatarUri = await _storageService.UploadAsync(normalizedAvatar, newFileName);

        employee.PfpUrl = avatarUri.AbsoluteUri;

        _context.SaveChanges();

        var response = new
        {
            ImageUrl = avatarUri.AbsoluteUri,
        };
        return Ok(response);
    }
}

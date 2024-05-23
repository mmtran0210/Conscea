using ConsceaAPI.Data;
using ConsceaAPI.DTOs;
using ConsceaAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ConsceaAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SearchController : ControllerBase
{
    private readonly AppDbContext _context;

    public SearchController(AppDbContext context)
    {
        _context = context;
    }

    // Search for employees with a specific certificate in a specific year
    [HttpGet]
    public IActionResult Get([FromQuery] EmployeeCertificateFilter filter)
    {
        // Get all the employees
        var employees = _context.Employees.ToList();

        // Convert the filter year int to a datetime
        var year = new DateOnly(filter.Year, 1, 1);
        var nextYear = year.AddYears(1);

        // Find all the employee certificates that match the filter
        var employeeCertificates = _context.EmployeeCertificates
            .Where(ec => ec.CertificateID == filter.CertificateId &&
                         ec.CertificationDate <= nextYear &&
                         ec.ValidTillDate >= year)
            .Include(ec => ec.Certificate)
            .ToList();

        var employeeCertificatesResponse = new List<EmployeeCertificateResponse>();

        // We need to return all employees, even if they don't have the certificate
        // Create a new employee certificate object for each employee that doesn't have the certificate
        foreach (var employee in employees)
        {
            if (employeeCertificates.All(ec => ec.EmployeeID != employee.Id))
            {
                employeeCertificatesResponse.Add(new EmployeeCertificateResponse
                {
                    EmployeeID = employee.Id,
                    Employee = employee,
                    CertificateID = null,
                    Certificate = null,
                    CertificationDate = null,
                    ValidTillDate = null,
                    Status = "No Certificate"
                });
            }
            else
            {
                employeeCertificatesResponse.AddRange(employeeCertificates
                            .Where(ec => ec.EmployeeID == employee.Id)
                            .Select(ec => new EmployeeCertificateResponse
                            {
                                Id = ec.Id,
                                EmployeeID = ec.EmployeeID,
                                Employee = ec.Employee,
                                CertificateID = ec.CertificateID,
                                Certificate = ec.Certificate,
                                CertificationDate = ec.CertificationDate,
                                ValidTillDate = ec.ValidTillDate,
                                Status = ec.ValidTillDate == null || ec.ValidTillDate < DateOnly.FromDateTime(DateTime.Now) ? "Expired" : "Valid"
                            }));
            }
        }

        var response = new
        {
            EmployeeCertificates = employeeCertificatesResponse,
            AdoptionRate = GetAdoptionRate(employees.Count, employeeCertificatesResponse.Count(ec => ec.Status == "Valid"))
        };

        return Ok(response);
    }

    // Get addoption rate
    private double GetAdoptionRate(int total, int adopted)
    {
        return total == 0 ? 0 : Math.Round((double)adopted / total * 100, 2);
    }
}

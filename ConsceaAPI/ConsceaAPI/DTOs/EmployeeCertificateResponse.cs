using ConsceaAPI.Models;

namespace ConsceaAPI.DTOs;

public class EmployeeCertificateResponse
{
    public int Id { get; set; }
    public int? EmployeeID { get; set; }
    public Employee? Employee { get; set; }
    public int? CertificateID { get; set; }
    public Certificate? Certificate { get; set; }
    public DateOnly? CertificationDate { get; set; }
    public DateOnly? ValidTillDate { get; set; }
    public string? Status { get; set; }
}

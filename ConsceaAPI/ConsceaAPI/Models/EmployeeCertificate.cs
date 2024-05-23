namespace ConsceaAPI.Models;

public class EmployeeCertificate
{
    public int Id { get; set; }
    public int EmployeeID { get; set; }
    public Employee Employee { get; set; } = new Employee();
    public int CertificateID { get; set; }
    public Certificate Certificate { get; set; } = new Certificate();
    public DateOnly CertificationDate { get; set; } = new DateOnly();
    public DateOnly? ValidTillDate { get; set; } = new DateOnly();
}
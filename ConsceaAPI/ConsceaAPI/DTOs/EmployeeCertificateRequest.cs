namespace ConsceaAPI.DTOs;

public class EmployeeCertificateRequest
{
    public int CertificateID { get; set; }
    public DateOnly CertificationDate { get; set; }
    public DateOnly? ValidTillDate { get; set; }
}

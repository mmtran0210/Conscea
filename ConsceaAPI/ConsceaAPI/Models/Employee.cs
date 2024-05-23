namespace ConsceaAPI.Models;

public class Employee
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public char Grade { get; set; } 
    public string Role { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string PfpUrl { get; set; } = "https://i.stack.imgur.com/34AD2.jpg";
}

using ConsceaAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace ConsceaAPI.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Employee> Employees { get; set; }
    public DbSet<Certificate> Certificates { get; set; }
    public DbSet<EmployeeCertificate> EmployeeCertificates { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Give employees a default profile picture URL
        modelBuilder.Entity<Employee>()
            .Property(e => e.PfpUrl)
            .HasDefaultValue("https://i.stack.imgur.com/34AD2.jpg");
    }
}

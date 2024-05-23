using System.Globalization;
using CsvHelper;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Extensions.Sql;
using Microsoft.Extensions.Logging;

namespace CertificationFeed
{
    public class Function1
    {
        private readonly ILogger<Function1> _logger;

        public Function1(ILogger<Function1> logger)
        {
            _logger = logger;
        }

        [Function(nameof(Function1))]
        [SqlOutput("dbo.EmployeeCertificates", connectionStringSetting: "sqlConn")]
        public async Task<EmployeeCertificateDBO[]> Run(
            [SqlInput(commandText: "SELECT [Id], [Name], [Level] FROM dbo.Certificates", connectionStringSetting: "sqlConn")]
            IEnumerable<CertificateQueryResult> queryResult,
            [BlobTrigger("conscea-cert-emp/{name}", Connection = "blobConn")] Stream stream)
        {
            List<EmployeeCertificateDBO> employeeCertificates = [];

            // Example rows:
            // ID,Certificate Achieved,Certified Date
            // 6655,Microsoft Certified: Azure AI Fundamentals (AI-900),10/1/2023
            // ,,
            using StreamReader blobStreamReader = new(stream);
            using CsvReader csvReader = new(blobStreamReader, CultureInfo.InvariantCulture);

            while (await csvReader.ReadAsync())
            {
                string[] data = csvReader.Context.Parser.Record;

                if (data[0].ToLower() == "id")
                {
                    _logger.LogInformation($"Skip header");
                    continue;
                }

                // Ignore the data if has an blank column
                if (data[0] == "" || data[1] == "" || data[2] == "")
                {
                    _logger.LogInformation($"Skipping data");
                    continue;
                }

                EmployeeCertificateDBO empCert = new()
                {
                    EmployeeID = int.Parse(data[0]),
                    CertificateID = CertificateQueryResult.GetId(queryResult, data[1]),
                    CertificationDate = DateOnly.ParseExact(data[2], "m/d/yyyy", CultureInfo.InvariantCulture),

                };

                // Make advanced certificates expire after 1 yr
                // The only other type of certificate is "Foundation" which never expire
                // By default a certificate never expires
                if (CertificateQueryResult.GetLevel(queryResult, data[1]).ToLower() == "advanced")
                {
                    empCert.ValidTillDate = empCert.CertificationDate.AddYears(1);
                }

                employeeCertificates.Add(empCert);
            }

            _logger.LogInformation($"Adding {employeeCertificates.Count} datas");

            return employeeCertificates.ToArray();
        }
    }
}

public class CertificateQueryResult
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Level { get; set; } = "";

    public static int GetId(IEnumerable<CertificateQueryResult> Certificates, string Name)
    {
        foreach (var cert in Certificates)
        {
            if (Name.ToLower().Trim() == cert.Name.ToLower().Trim())
            {
                return cert.Id;
            }
        }

        throw new Exception("Certificate not found");
    }

    public static string GetLevel(IEnumerable<CertificateQueryResult> Certificates, string Name)
    {
        foreach (var cert in Certificates)
        {
            if (Name.ToLower().Trim() == cert.Name.ToLower().Trim())
            {
                return cert.Level;
            }
        }

        throw new Exception("Certificate not found");
    }
}

public record EmployeeCertificateDBO
{
    public int EmployeeID { get; set; }
    public int CertificateID { get; set; }
    public DateOnly CertificationDate { get; set; }
    public DateOnly? ValidTillDate { get; set; } = null;
}

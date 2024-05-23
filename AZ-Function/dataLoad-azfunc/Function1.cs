using CsvHelper;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Extensions.Sql;
using Microsoft.Extensions.Logging;
using System.Globalization;
using Newtonsoft.Json;
using Microsoft.Data.SqlClient;


namespace dataLoad_azfunc
{
    public class Function1
    {
        private readonly ILogger<Function1> _logger;

        public Function1(ILogger<Function1> logger)
        {
            _logger = logger;
        }

        [Function(nameof(Function1))]
        // blob: excel-employee-data
        public async Task Run([BlobTrigger("excel-employee-data/{name}", Connection = "blobConn")] Stream myBlob)
        {
            List<EmployeeTable> employee = [];

            using StreamReader blobReader = new(myBlob);

            using CsvReader csvReader = new(blobReader, CultureInfo.InvariantCulture);

            while (await csvReader.ReadAsync())
            {
                string[] data = csvReader.Context.Parser.Record;

                if (data[0] == "id")
                {
                    continue;
                }

                // Ignore the record if employee Id or email id is unavailable. 
                if (data[0] == "" || data[3] == "")
                {
                    continue;
                }

                // for logging purpose
                var employeeData = new EmployeeTable()
                {
                    Id = int.Parse(data[0]),
                    FirstName = data[1],
                    LastName = data[2],
                    Email = data[3],
                    Phone = data[4],
                    Grade = data[5],
                    Role = data[6],
                    Username = data[7],
                };

                employee.Add(new EmployeeTable()
                {
                    Id = int.Parse(data[0]),
                    FirstName = data[1],
                    LastName = data[2],
                    Email = data[3],
                    Phone = data[4],
                    Grade = data[5],
                    Role = data[6],
                    Username = data[7],
                });

                // Log the data being insert
                _logger.LogInformation($"Inserting data: {JsonConvert.SerializeObject(employeeData)}");
            
            }

            // Get the connection string
            var connectionString = Environment.GetEnvironmentVariable("sqlConn");

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();

                foreach (var emp in employee)
                {
                    // table: Employees

                    // Check if a record with the same Id or Email already exists
                    var checkSql = "SELECT COUNT(*) FROM dbo.Employees WHERE Id = @Id OR Email = @Email";
                    
                    using (SqlCommand checkCommand = new SqlCommand(checkSql, conn))
                    {
                        checkCommand.Parameters.AddWithValue("@Id", emp.Id);
                        
                        checkCommand.Parameters.AddWithValue("@Email", emp.Email);
                        
                        int existingCount = (int)checkCommand.ExecuteScalar();

                        // If a record with the same Id or Email does not exist, insert the new record
                        if (existingCount == 0)
                        {
                            // Enable identity insert
                            using (SqlCommand identityInsertCommand = new SqlCommand("SET IDENTITY_INSERT dbo.Employees ON", conn))
                            {
                                identityInsertCommand.ExecuteNonQuery();
                            }

                            string insertSql = "INSERT INTO dbo.Employees (Id, FirstName, LastName, Email, Phone, Grade, Role, Username) " +
                                                            "VALUES (@Id, @FirstName, @LastName, @Email, @Phone, @Grade, @Role, @Username)";
                            using (SqlCommand command = new SqlCommand(insertSql, conn))
                            {
                                command.Parameters.AddWithValue("@Id", emp.Id);
                                command.Parameters.AddWithValue("@FirstName", emp.FirstName);
                                command.Parameters.AddWithValue("@LastName", emp.LastName);
                                command.Parameters.AddWithValue("@Email", emp.Email);
                                command.Parameters.AddWithValue("@Phone", emp.Phone);
                                command.Parameters.AddWithValue("@Grade", emp.Grade);
                                command.Parameters.AddWithValue("@Role", emp.Role);
                                command.Parameters.AddWithValue("@Username", emp.Username);

                                command.ExecuteNonQuery();
                            }

                            // Disable identity insert
                            using (SqlCommand identityInsertCommand = new SqlCommand("SET IDENTITY_INSERT dbo.Employees OFF", conn))
                            {
                                identityInsertCommand.ExecuteNonQuery();
                            }
                        }
                        else
                        {
                            _logger.LogInformation($"Skipping duplicate Id or Email: {emp.Id} or {emp.Email}");
                        }
                    }
                }

            }
        }
    }


    public record EmployeeTable
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
        public string Email { get; set; } = "";
        public string Phone { get; set; } = "";
        public string Grade { get; set; } = "";
        public string Role { get; set; } = "";
        public string Username { get; set; } = "";
    }

}

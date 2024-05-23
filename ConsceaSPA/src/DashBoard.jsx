import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ExportIcon from '@mui/icons-material/FileDownload';
import Button from '@mui/material/Button';
import { filterEmployeesCertificates } from './services/searchService';
import { getAllCertificates } from './services/certificateService';

// Overall adoption rate provided by the api response
const OverallAdoptionRate = ({ adoptionRate }) => {
  return (
    <div style={{ textAlign: 'left', marginBottom: 24 }}>
      Overall Adoption Rate: {adoptionRate}%
    </div>
  );
};

const Employees = ({ employees }) => {
  const columns = [
    {
      field: 'fullName',
      headerName: 'Full name',
      valueGetter: (value, row) =>
        `${row.employee.firstName} ${row.employee.lastName}`,
    },
    {
      field: 'role',
      headerName: 'Role',
      valueGetter: (value, row) => row.employee.role,
    },
    {
      field: 'grade',
      headerName: 'Grade',
      valueGetter: (value, row) => row.employee.grade,
    },
    {
      field: 'email',
      headerName: 'Email',
      valueGetter: (value, row) => row.employee.email,
      width: 200,
    },
    {
      field: 'certificateName',
      headerName: 'Certificate Name',
      valueGetter: (value, row) => row.certificate?.name ?? '-',
      width: 400,
    },
    {
      field: 'employeeId',
      headerName: 'Employee ID',
      valueGetter: (value, row) => row.employee.id,
    },
    {
      field: 'certificateLevel',
      headerName: 'Certificate Level',
      valueGetter: (value, row) => row.certificate?.level ?? 'No Certificate',
      width: 150,
    },
    {
      field: 'certifiedDate',
      headerName: 'Certified Date',
      valueGetter: (value, row) => row.certificationDate ?? '-',
      width: 150,
    },
    {
      field: 'expiryDate',
      headerName: 'Expiry Date',
      valueGetter: (value, row) => row.validTillDate ?? '-',
      width: 150,
    },
  ];

  const getRowClasses = ({row}) => {
    if (row.status === 'Valid' || row.validTillDate === null) {
      return [];
    }

    return ['expired-cert'];
  }

  return (
    <DataGrid
      rows={employees}
      columns={columns}
      getRowId={(row) => `${row.employeeID}.${row.certificateID}`}
      getRowClassName={getRowClasses}
      initialState={{
        pagination: {
          paginationModel: { page: 0, pageSize: 20 },
        },
      }}
      pageSizeOptions={[5, 10, 20]}
      checkboxSelection
      sx={{
        '& .MuiDataGrid-cell': {
          fontWeight: 500,
        },
      }}
    />
  );
};

const Dashboard = () => {
  const [years, setYears] = useState([]);
  const [year, setYear] = useState(2024);
  const [employees, setEmployees] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState({});
  const [adoptionRate, setAdoptionRate] = useState(0);

  // Use effect for when the year or certificate changes
  useEffect(() => {
    filterEmployeesCertificates({
      certificateId: selectedCertificate,
      year: year,
    }).then((response) => {
      setEmployees(response.employeeCertificates);
      setAdoptionRate(response.adoptionRate);
    });
  }, [year, selectedCertificate]);

  // set the years
  useEffect(() => {
    let years = [];
    for (let i = 2030; i >= 2000; i--) {
      years.push(i);
    }
    setYears(years);

    getAllCertificates().then((certificates) => {
      setCertificates(certificates);
      setSelectedCertificate(certificates[0]?.id);
    });
  }, []);

  return (
    <div style={{ marginTop: '5%', justifyContent: 'center' }}>
      {/* <h1 className="page-title">Dashboard</h1> */}

      <div
        style={{
          display: 'flex',
          gap: 16,
          alignItems: 'center',
          marginBottom: 32,
          marginTop:"10%",
        }}
      >
        <FormControl>
          <InputLabel id="year-select-label">Year</InputLabel>
          <Select
            labelId="year-select-label"
            id="year-select"
            value={year}
            label="Year"
            onChange={(e) => setYear(e.target.value)}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel id="certificate-select-label">Certificate</InputLabel>
          <Select
            labelId="certificate-select-label"
            id="certificate-select"
            value={selectedCertificate}
            label="Certificate"
            onChange={(e) => setSelectedCertificate(e.target.value)}
            style={{ width: 600 }}
          >
            {certificates.map((certificate) => (
              <MenuItem key={certificate.id} value={certificate.id}>
                {certificate.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <OverallAdoptionRate adoptionRate={adoptionRate} />

      <Employees employees={employees} />
    </div>
  );
};

export default Dashboard;

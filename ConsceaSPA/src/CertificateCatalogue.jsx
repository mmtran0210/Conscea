import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { getAllCertificates } from './services/certificateService';

const CertificateCatalogue = () => {
  const [rows, setRows] = useState([]);

  const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Certification name', width: 600 },
    { field: 'level', headerName: 'Expertise' },
    { field: 'category', headerName: 'Category' },
  ];

  useEffect(() => {
    getAllCertificates().then((certificates) => {
      setRows(certificates);
    });
  }, []);

  return (
    <div style={{ width: '100%' }}>
      {/* <h1 className="page-title">Certificate Catalogue</h1> */}
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{
          '& .MuiDataGrid-cell': {
            fontWeight: 500,
          },
        }}
      />
    </div>
  );
};

export default CertificateCatalogue;

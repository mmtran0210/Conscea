import { useEffect, useState } from 'react';
import './Home.css';
import UserContext from './context/userContext';
import { useContext } from 'react';
import {
  getAllEmployees,
  getEmployee,
  getEmployeeCertificates,
  updateEmployeeCertificate,
  deleteEmployeeCertificate,
  createEmployeeCertificate,
} from './services/employeeService';
import { getAllCertificates } from './services/certificateService';
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Autocomplete, TextField, Button } from '@mui/material';

const Home = () => {
  const { user: currentUser } = useContext(UserContext);
  const [certifications, setCertifications] = useState([]);
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [allCertificates, setAllCertificates] = useState([]);
  const [newCertification, setNewCertification] = useState({
    certificateId: '',
    certificationDate: '',
    validTillDate: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirmation] = useState(false);
  const [deleteCertificationId, setDeleteCertificationId] = useState(null);

  const fetchCertifications = async () => {
    const employeeCertificates = await getEmployeeCertificates(
      currentUser.id,
    );
    console.log(employeeCertificates);
    setCertifications(employeeCertificates);
  };
  useEffect(() => {
    
    fetchCertifications();
    const fetchAllCertificates = async () => {
      const certificates = await getAllCertificates();
      setAllCertificates(certificates);
    };
    fetchAllCertificates();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteEmployeeCertificate(currentUser.id, id);
      setCertifications((prevCertifications) =>
        prevCertifications.filter(
          (certification) => certification.certificate.id !== id,
        ),
      );
      setShowDeleteConfirmation(false);
      fetchCertifications();
    } catch (error) {
      console.error('Failed to delete certificate', error);
    }
  };

  const handleModify = (id) => {
    const certification = certifications.find(
      (cert) => cert.certificate.id === id,
    );
    console.log('Selected Certification:', certification);
    setSelectedCertification(certification);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setSelectedCertification(null);
    setShowModal(false);
  };

  const handleSave = async () => {
    try {
      console.log('Message1');
      await updateEmployeeCertificate(
        currentUser.id,
        selectedCertification.id,
        {
          certificateId: selectedCertification.certificate.id,
          certificationDate: selectedCertification.certificationDate,
          validTillDate: selectedCertification.validTillDate,
        },
      );
      console.log('Message2');
      const employeeCertificates = await getEmployeeCertificates(
        currentUser.id,
      );
      console.log('Message3');
      setCertifications(employeeCertificates);
    } catch (error) {
      console.error('Failed to update certificate', error);
    }
    setSelectedCertification(null);
  };
  const handleAddCertfication = () => {
    setShowForm(true);
  };
  const handleSaveCertification = async () => {
    try {
      await createEmployeeCertificate(currentUser.id, newCertification);
      const employeeCertificates = await getEmployeeCertificates(
        currentUser.id,
      );
      setCertifications(employeeCertificates);
      setShowForm(false);
      setNewCertification({
        certificateId: '',
        certificationDate: '',
        validTillDate: '',
      });
    } catch (error) {
      console.error('Failed to create certificate', error);
    }
  };

  const handleChangeModify = (event) => {
    setSelectedCertification({
      ...selectedCertification,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeNewcer = (event) => {
    setNewCertification({
      ...newCertification,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div>
      {/* <h2 style={{ marginBottom: '5%' }}>Certification</h2> */}
      <table className="certification-table">
        <thead>
          <tr>
            <th>Certification Name</th>
            <th>Certified Date</th>
            <th>Status</th>
            <th>Expiry Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {certifications.map((certification) => (
            <tr key={certification.certificate.id}>
              <td>{certification.certificate.name}</td>
              <td>{certification.certificationDate}</td>
              <td
                className={
                  certification.status === 'Expired' ? 'expired-status' : ''
                }
              >
                {certification.status}
              </td>
              <td>{certification.validTillDate}</td>
              <td>
                <Button
                  ClassName="ModifyButton"
                  variant="outlined"
                  onClick={() => handleModify(certification.certificate.id)}
                >
                  Modify
                </Button>
                <Button
                  ClassName="DeleteButton"
                  variant="outlined"
                  style={{ color: 'red', borderColor: 'red' }}
                  onClick={() => {
                    setShowDeleteConfirmation(true);
                    setDeleteCertificationId(certification.id);
                  }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirmation(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            backgroundColor: 'lightcoral',
            width: '1200px',
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this certificate?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowDeleteConfirmation(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleDelete(deleteCertificationId)}
            color="primary"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {selectedCertification && showModal && (
        <Dialog
          open={showModal}
          onClose={handleCloseModal}
          aria-labelledby="form-dialog-title"
          PaperProps={{
            sx: {
              backgroundColor: 'lightgrey',
              width: '1200px',
              minWidth: 600,
            },
          }}
        >
          <DialogTitle id="form-dialog-title">Modify Certification</DialogTitle>
          <DialogContent style={{ display: 'flex', flexDirection: 'row' }}>
            <div>
              <DialogContentText>
                Please modify the certification details.
              </DialogContentText>
              <Autocomplete
                options={allCertificates}
                value={
                  allCertificates.find(
                    (certificate) =>
                      certificate.id === selectedCertification?.certificate?.id,
                  ) || null
                }
                onChange={(event, newValue) => {
                  setSelectedCertification({
                    ...selectedCertification,
                    certificate: {
                      ...selectedCertification.certificate,
                      id: newValue ? newValue.id : '',
                    },
                  });
                }}
                getOptionLabel={(certificate) => certificate.name}
                renderInput={(params) => (
                  <TextField {...params} label="Select Certificate" />
                )}
              />
            </div>
            <div
              style={{
                marginLeft: '5%',
                display: 'flex',
                alignContent: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: '15%',
                }}
              >
                <DialogContentText
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    marginRight: '5%',
                  }}
                >
                  Certified:
                </DialogContentText>
                <input
                  type="date"
                  name="certificationDate"
                  value={selectedCertification.certificationDate}
                  onChange={handleChangeModify}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <DialogContentText
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    marginRight: '9%',
                  }}
                >
                  Expire's:
                </DialogContentText>
                <input
                  type="date"
                  name="validTillDate"
                  value={selectedCertification.validTillDate}
                  onChange={handleChangeModify}
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Button variant="outlined" onClick={() => handleAddCertfication()}>
        {' '}
        Add New Certificate
      </Button>

      {showForm && (
        <Dialog
          open={showForm}
          onClose={() => setShowForm(false)}
          aria-labelledby="form-dialog-title"
          PaperProps={{
            sx: {
              backgroundColor: 'lightgrey',
              width: 600,
              minWidth: 600,
            },
          }}
        >
          <DialogTitle id="form-dialog-title">Add New Certificate</DialogTitle>
          <DialogContent style={{ display: 'flex', flexDirection: 'row' }}>
            <div>
              <DialogContentText
                sx={{
                  width: 'max-content',
                }}
              >
                Please fill in the details for the new certificate.
              </DialogContentText>
              <Autocomplete
                style={{ width: '100%', height: 'fit-content' }}
                options={allCertificates}
                value={
                  allCertificates.find(
                    (certificate) =>
                      certificate.id === newCertification.certificateId,
                  ) || null
                }
                onChange={(_, newValue) => {
                  handleChangeNewcer({
                    target: {
                      name: 'certificateId',
                      value: newValue ? newValue.id : '',
                    },
                  });
                }}
                getOptionLabel={(certificate) => certificate.name}
                renderInput={(params) => (
                  <TextField {...params} label="Select Certificate" />
                )}
              />
            </div>
            <div
              style={{
                marginLeft: '5%',
                display: 'flex',
                alignContent: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: '15%',
                }}
              >
                <DialogContentText
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    marginRight: '5%',
                  }}
                >
                  Certified:
                </DialogContentText>
                <input
                  className="HomeInput"
                  type="date"
                  name="certificationDate"
                  value={newCertification.certificationDate}
                  onChange={handleChangeNewcer}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <DialogContentText
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    marginRight: '9%',
                  }}
                >
                  Expire's:
                </DialogContentText>
                <input
                  className="HomeInput"
                  type="date"
                  name="validTillDate"
                  value={newCertification.validTillDate}
                  onChange={handleChangeNewcer}
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowForm(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSaveCertification} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default Home;

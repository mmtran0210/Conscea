import {
  Button,
  TextField,
  Box,
  Typography,
  Grid,
  Autocomplete,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useState, useEffect, useContext } from 'react';
import { getAllEmployees } from './services/employeeService';
import UserContext from './context/userContext';

export default function Login() {
  const { login } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  var returnUrl = searchParams.get('returnUrl');

  const fetchUsers = async () => {
    const fetchedUsers = await getAllEmployees();
    setUsers(fetchedUsers);
  };

  // Call fetch certificates when the component mounts
  useEffect(() => {
    fetchUsers();
    console.log(users);
  }, []);

  return (
    <div
      style={{
        width: '300px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <Typography variant="h3">Login</Typography>
      <Autocomplete
        options={users}
        getOptionLabel={(user) => `${user.firstName} ${user.lastName}`}
        value={selectedUser}
        onChange={(event, newValue) => {
          setSelectedUser(newValue);
          setLoginError('');
        }}
        style={{ borderRadius: 5, backgroundColor: 'white' }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select User"
            error={!!loginError}
            helperText={loginError}
            style={{ color: 'red' }}
          />
        )}
      />
      <Button
        onClick={() => {
          if (selectedUser) {
            // Navigate or perform any other action based on the selected user
            console.log('Selected user:', selectedUser);
            login(selectedUser.id);
            navigate(returnUrl ?? '/home');
          } else {
            setLoginError('Please select a user.');
          }
        }}
      >
        Login
      </Button>
    </div>
  );
}

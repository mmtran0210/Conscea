import { createContext } from 'react';

const UserContext = createContext({
  user: null,
  userId: null,
  login: () => {},
  logout: () => {},
});

export default UserContext;

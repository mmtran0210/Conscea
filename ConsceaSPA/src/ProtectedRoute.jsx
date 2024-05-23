import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from './context/userContext';

export const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  // Get the current route
  const currentRoute = window.location.pathname;

  useEffect(() => {
    console.log(currentRoute);
    const delay = async () => {
      // We need to wait for a short period to ensure the user is set
      // Otherwise, refreshing a protected route will redirect to the login page
      await new Promise((resolve) => setTimeout(resolve, 200));
      setIsLoading(false);
    };

    delay();
  }, [currentRoute]);

  if (isLoading) {
    return null;
  }

  // If no user redirect to login
  // If user is not admin, make sure they cant access the dashboard
  if (!user) {
    return (
      <Navigate to={`/login?returnUrl=${encodeURIComponent(currentRoute)}`} />
    );
  } else if (
    user &&
    user.role.toLowerCase() !== 'admin' &&
    currentRoute.toLowerCase() === '/dashboard'
  ) {
    return <Navigate to="/home" />;
  }

  return children;
};

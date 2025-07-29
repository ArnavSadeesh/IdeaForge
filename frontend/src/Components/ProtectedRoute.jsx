import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext.jsx';

const ProtectedRoute = ({ children, requiredUserType }) => {
  const { isLoggedIn, userType } = useContext(AuthContext);

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (requiredUserType && userType !== requiredUserType) {
    // Optionally, redirect to an unauthorized page or home
    return <Navigate to="/ideas/:hackathonName" replace />;
  }

  return children;
};

export default ProtectedRoute;

import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const { auth } = useContext(AuthContext);

  return auth ? <Route {...rest} element={Component} /> : <Navigate to="/login" />;
};

export default PrivateRoute;

import React from 'react';
import { ToastContainer } from 'react-toastify';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <ToastContainer />
      {children}
    </div>
  );
};

export default AdminLayout;

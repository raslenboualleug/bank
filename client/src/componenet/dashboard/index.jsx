// Dashboard.jsx
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './sidebar'
import ClientTable from './Client/clients';
import ArchiveManagement from './archiveManagement';

const Dashboard = () => {
  return (
    <div className="dashboard">
      
      <Sidebar />
      <div className="dashboard__content">
        <Routes>
          <Route path="/"  element={ClientTable} />
          <Route path="/dashboard/archives" element={ArchiveManagement} />
          
        </Routes>
      </div>
      
    </div>
  );
};

export default Dashboard;

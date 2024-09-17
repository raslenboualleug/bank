import React from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './componenet/regesterform/login';
import Signup from './componenet/regesterform/signup';
import Dashboard from './componenet/dashboard/index';
import ClientTable from './componenet/dashboard/Client/clients'
import ArchiveManagement from './componenet/dashboard/archiveManagement';
function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/dashboard" element={<Dashboard />} />/ */}
          <Route path="/clients" element={<ClientTable/>} />
          <Route path="/archives" element={<ArchiveManagement/>} />
          
      
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

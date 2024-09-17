import React from 'react';
import { NavLink } from 'react-router-dom'; 
import './dash styl/sidebar.css'; 

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        <h2>Archive Bank</h2>
      </div>
      
      <ul className="sidebar__nav">
        <li>
          <NavLink to="/clients" className={({ isActive }) => (isActive ? 'active' : '')}>
            <i className="fas fa-home"></i>
            <span>Dashboard</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/archives" className={({ isActive }) => (isActive ? 'active' : '')}>
            <i className="fas fa-folder"></i>
            <span>Archives Management</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

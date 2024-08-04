import React, { useState } from 'react';
import './AdminPanel.css';
import { IoMdCloseCircle } from "react-icons/io";
import { ImMenu } from "react-icons/im";
import { Link, Outlet } from 'react-router-dom';
import withAuthorization from '../../utils/withAuthorization';
import { Permissions } from '../../utils/roles';

const AdminPanel = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className='admin-panel'>
            <div className='admin-sidebar' style={{ width: isSidebarOpen ? '20vw' : '4vw' }}>
                {isSidebarOpen ? (
                    <div className="sidebar">
                        <div className='sidebar-header'>
                            <div>Menus</div>
                            <IoMdCloseCircle className='close-button' onClick={toggleSidebar} />
                        </div>
                        <Link to="/chat" className="menu-item" >Chat</Link>
                        <Link to="/login" className="menu-item" >Login</Link>
                        <Link to="/register" className="menu-item" >Register</Link>
                        <Link to="/admin/users" className="menu-item" >Users</Link>
                        <Link to="/admin/coupons" className="menu-item" >Coupons</Link>
                        <Link to="/admin/sessions" className="menu-item" >Sessions</Link>
                    </div>
                ) : (
                    <div className='menu-button-container'>
                        <ImMenu className='menu-button' onClick={toggleSidebar} />
                    </div>
                )}
            </div>
            <div className='admin-container' style={{ width: isSidebarOpen ? '80vw' : '96vw' }}>
                <Outlet />
            </div>
        </div>
    );
};

export default withAuthorization(Permissions.Admin_Access)(AdminPanel);
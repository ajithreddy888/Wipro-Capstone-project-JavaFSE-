import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev);
    };

    return (
        <div style={styles.container}>
            <Navbar toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={sidebarOpen} />
            <div style={{
                ...styles.content,
                marginLeft: sidebarOpen ? '260px' : '0px',
                transition: 'margin-left 0.3s ease',
            }}>
                {children}
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        background: '#F0F2FF',
    },
    content: {
        paddingTop: '64px',
        minHeight: '100vh',
        padding: '84px 24px 24px',
    },
};

export default Layout;
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const userMenus = [
        { label: '🏪 Marketplace', path: '/marketplace' },
    ];

    const developerMenus = [
        { label: '📊 Dashboard', path: '/developer/dashboard' },
        { label: '📱 My Apps', path: '/developer/apps' },
        { label: '➕ Publish App', path: '/developer/create' },
    ];

    const adminMenus = [
        { label: '📊 Dashboard', path: '/admin/dashboard' },
        { label: '🏪 Marketplace', path: '/marketplace' },
    ];

    const getMenus = () => {
        if (user?.role === 'USER') return userMenus;
        if (user?.role === 'DEVELOPER') return developerMenus;
        if (user?.role === 'ADMIN') return adminMenus;
        return [];
    };

    return (
        <div style={{ ...styles.sidebar, left: isOpen ? '0' : '-260px' }}>
            <div style={styles.profile}>
                <div style={styles.avatar}>
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <div style={styles.profileName}>{user?.name}</div>
                    <div style={styles.profileRole}>{user?.role}</div>
                </div>
            </div>

            <div style={styles.divider} />

            <nav>
                {getMenus().map((menu) => {
                    const isActive = location.pathname === menu.path;
                    return (
                        <div
                            key={menu.path}
                            style={isActive ? styles.menuItemActive : styles.menuItem}
                            onClick={() => navigate(menu.path)}
                        >
                            {menu.label}
                        </div>
                    );
                })}
            </nav>
        </div>
    );
};

const styles = {
    sidebar: {
        width: '260px',
        background: '#1E1E2F',
        height: '100vh',
        position: 'fixed',
        top: 0,
        transition: 'left 0.3s ease',
        zIndex: 99,
        paddingTop: '80px',
        overflowY: 'auto',
    },
    profile: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '20px',
        marginBottom: '8px',
    },
    avatar: {
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: '700',
        fontSize: '18px',
        flexShrink: 0,
    },
    profileName: { color: '#fff', fontWeight: '600', fontSize: '14px' },
    profileRole: { color: '#6C63FF', fontSize: '12px', fontWeight: '500', marginTop: '2px' },
    divider: { height: '1px', background: 'rgba(255,255,255,0.08)', margin: '0 20px 16px' },
    menuItem: {
        padding: '12px 20px',
        color: '#aaa',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        borderRadius: '10px',
        margin: '2px 10px',
    },
    menuItemActive: {
        padding: '12px 20px',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        borderRadius: '10px',
        margin: '2px 10px',
        background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
    },
};

export default Sidebar;
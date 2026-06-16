import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={styles.navbar}>
            <div style={styles.left}>
                <button style={styles.menuBtn} onClick={toggleSidebar}>☰</button>
                <span style={styles.brand}>⚡ AppVerse</span>
            </div>
            <div style={styles.right}>
                <span style={styles.welcome}>👋 {user?.name}</span>
                <span style={styles.role}>{user?.role}</span>
                <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

const styles = {
    navbar: {
        height: '64px',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        boxShadow: '0 2px 12px rgba(108,99,255,0.08)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
    },
    left: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    menuBtn: {
        background: 'none',
        border: 'none',
        fontSize: '22px',
        cursor: 'pointer',
        color: '#6C63FF',
        padding: '4px 8px',
        borderRadius: '8px',
    },
    brand: {
        fontSize: '20px',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    right: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    welcome: {
        fontSize: '14px',
        color: '#2D2D2D',
        fontWeight: '600',
    },
    role: {
        fontSize: '12px',
        background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
        color: '#fff',
        padding: '4px 12px',
        borderRadius: '20px',
        fontWeight: '600',
    },
    logoutBtn: {
        background: '#FFE8EC',
        color: '#FF6584',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '10px',
        fontWeight: '600',
        fontSize: '13px',
        cursor: 'pointer',
    },
};

export default Navbar;
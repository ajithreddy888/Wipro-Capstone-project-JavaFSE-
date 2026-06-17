// Import React to create the component
import React from 'react';

// Import the custom authentication context.
// It provides logged-in user details and logout functionality.
import { useAuth } from '../context/AuthContext';

// Import useNavigate hook for programmatic navigation between pages.
import { useNavigate } from 'react-router-dom';

// Navbar component receives toggleSidebar function as a prop
// from the Layout component.
const Navbar = ({ toggleSidebar }) => {

    // Get the logged-in user details and logout function
    // from the AuthContext.
    const { user, logout } = useAuth();

    // Hook used to navigate to different routes.
    const navigate = useNavigate();

    // Function that runs when the Logout button is clicked.
    const handleLogout = () => {

        // Remove user information and token from storage.
        logout();

        // Redirect the user to the login page.
        navigate('/login');
    };

    return (

        // Main navigation bar container.
        <div style={styles.navbar}>

            {/* Left side of the navbar */}
            <div style={styles.left}>

                {/* Sidebar toggle button.
                    Clicking this button opens/closes the sidebar. */}
                <button
                    style={styles.menuBtn}
                    onClick={toggleSidebar}
                >
                    ☰
                </button>

                {/* Application logo/brand name */}
                <span style={styles.brand}>
                    ⚡ AppVerse
                </span>
            </div>

            {/* Right side of the navbar */}
            <div style={styles.right}>

                {/* Display logged-in user's name.
                    Optional chaining (?) prevents errors if user is null. */}
                <span style={styles.welcome}>
                    👋 {user?.name}
                </span>

                {/* Display logged-in user's role */}
                <span style={styles.role}>
                    {user?.role}
                </span>

                {/* Logout button */}
                <button
                    style={styles.logoutBtn}
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>
        </div>
    );
};

// CSS styles written as a JavaScript object.
const styles = {

    // Main navbar styling.
    navbar: {
        height: '64px',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',

        // Adds a light shadow below the navbar.
        boxShadow: '0 2px 12px rgba(108,99,255,0.08)',

        // Keeps navbar fixed at the top while scrolling.
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,

        // Ensures navbar stays above other components.
        zIndex: 100,
    },

    // Left section styling.
    left: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },

    // Sidebar menu button styling.
    menuBtn: {
        background: 'none',
        border: 'none',
        fontSize: '22px',
        cursor: 'pointer',
        color: '#6C63FF',
        padding: '4px 8px',
        borderRadius: '8px',
    },

    // Application logo styling.
    brand: {
        fontSize: '20px',
        fontWeight: '800',

        // Gradient text effect.
        background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },

    // Right section styling.
    right: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },

    // Logged-in user's name styling.
    welcome: {
        fontSize: '14px',
        color: '#2D2D2D',
        fontWeight: '600',
    },

    // User role badge styling.
    role: {
        fontSize: '12px',

        // Gradient background for role badge.
        background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
        color: '#fff',
        padding: '4px 12px',
        borderRadius: '20px',
        fontWeight: '600',
    },

    // Logout button styling.
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

// Export Navbar component so it can be used in Layout or other components.
export default Navbar;
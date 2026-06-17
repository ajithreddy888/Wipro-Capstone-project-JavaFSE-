// Import React to create the component.
import React from 'react';

// Import hooks from React Router.
// useNavigate is used to navigate between pages.
// useLocation is used to know the current URL/path.
import { useNavigate, useLocation } from 'react-router-dom';

// Import custom authentication context.
// It provides details of the currently logged-in user.
import { useAuth } from '../context/AuthContext';

// Sidebar component receives 'isOpen' as a prop from the Layout component.
// It controls whether the sidebar is visible or hidden.
const Sidebar = ({ isOpen }) => {

    // Get logged-in user information.
    const { user } = useAuth();

    // Hook used to navigate to different pages.
    const navigate = useNavigate();

    // Hook used to identify the current page URL.
    // This helps highlight the active menu.
    const location = useLocation();

    // Menu items available for normal users.
    const userMenus = [
        { label: '🏪 Marketplace', path: '/marketplace' },
    ];

    // Menu items available for developers.
    const developerMenus = [
        { label: '📊 Dashboard', path: '/developer/dashboard' },
        { label: '📱 My Apps', path: '/developer/apps' },
        { label: '➕ Publish App', path: '/developer/create' },
    ];

    // Menu items available for administrators.
    const adminMenus = [
        { label: '📊 Dashboard', path: '/admin/dashboard' },
        { label: '🏪 Marketplace', path: '/marketplace' },
    ];

    // This function returns menu items based on the user's role.
    const getMenus = () => {

        // If logged-in user is USER
        if (user?.role === 'USER') return userMenus;

        // If logged-in user is DEVELOPER
        if (user?.role === 'DEVELOPER') return developerMenus;

        // If logged-in user is ADMIN
        if (user?.role === 'ADMIN') return adminMenus;

        // If no user exists, return an empty menu.
        return [];
    };

    return (

        // Sidebar container.
        // If isOpen is true → sidebar is visible.
        // If false → sidebar moves outside the screen.
        <div
            style={{
                ...styles.sidebar,
                left: isOpen ? '0' : '-260px'
            }}
        >

            {/* User profile section */}
            <div style={styles.profile}>

                {/* Circular avatar displaying the first letter of the user's name */}
                <div style={styles.avatar}>
                    {user?.name?.charAt(0).toUpperCase()}
                </div>

                {/* User information */}
                <div>

                    {/* Display user's full name */}
                    <div style={styles.profileName}>
                        {user?.name}
                    </div>

                    {/* Display user's role */}
                    <div style={styles.profileRole}>
                        {user?.role}
                    </div>

                </div>
            </div>

            {/* Horizontal separator line */}
            <div style={styles.divider} />

            {/* Navigation menu */}
            <nav>

                {/* Loop through the menu items returned by getMenus() */}
                {getMenus().map((menu) => {

                    // Check whether the current page matches this menu.
                    // Used to highlight the active menu.
                    const isActive = location.pathname === menu.path;

                    return (

                        <div
                            key={menu.path}

                            // Apply different styles for active and inactive menu.
                            style={
                                isActive
                                    ? styles.menuItemActive
                                    : styles.menuItem
                            }

                            // Navigate to the selected page when clicked.
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

// CSS styles stored inside a JavaScript object.
const styles = {

    // Sidebar container styling.
    sidebar: {
        width: '260px',
        background: '#1E1E2F',

        // Sidebar occupies the full screen height.
        height: '100vh',

        // Fixed position keeps the sidebar visible while scrolling.
        position: 'fixed',

        top: 0,

        // Smooth animation while opening and closing.
        transition: 'left 0.3s ease',

        // Places sidebar below the navbar.
        zIndex: 99,

        // Space at the top for the fixed navbar.
        paddingTop: '80px',

        // Enables scrolling if menu items exceed screen height.
        overflowY: 'auto',
    },

    // User profile section.
    profile: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '20px',
        marginBottom: '8px',
    },

    // Circular avatar styling.
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

        // Prevents avatar from shrinking.
        flexShrink: 0,
    },

    // User name styling.
    profileName: {
        color: '#fff',
        fontWeight: '600',
        fontSize: '14px'
    },

    // User role styling.
    profileRole: {
        color: '#6C63FF',
        fontSize: '12px',
        fontWeight: '500',
        marginTop: '2px'
    },

    // Divider line.
    divider: {
        height: '1px',
        background: 'rgba(255,255,255,0.08)',
        margin: '0 20px 16px'
    },

    // Normal menu styling.
    menuItem: {
        padding: '12px 20px',
        color: '#aaa',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        borderRadius: '10px',
        margin: '2px 10px',
    },

    // Active menu styling.
    menuItemActive: {
        padding: '12px 20px',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        borderRadius: '10px',
        margin: '2px 10px',

        // Highlight active menu using a gradient.
        background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
    },
};

// Export Sidebar component.
export default Sidebar;
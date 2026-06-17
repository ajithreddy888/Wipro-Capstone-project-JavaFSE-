// Import React and the useState hook
// useState is used to store and update component data.
import React, { useState } from 'react';

// Import the Navbar component
import Navbar from './Navbar';

// Import the Sidebar component
import Sidebar from './Sidebar';

// Layout component is a common wrapper for all pages.
// The 'children' prop represents the page content that will be displayed inside this layout.
const Layout = ({ children }) => {

    // State variable to track whether the sidebar is open or closed.
    // Initially it is set to true, so the sidebar is visible.
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Function to toggle (open/close) the sidebar.
    // 'prev' stores the previous state value.
    // If it was true, it becomes false and vice versa.
    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev);
    };

    return (
        // Main container that holds Navbar, Sidebar, and page content.
        <div style={styles.container}>

            {/* Navbar component.
                Passing toggleSidebar function as a prop so Navbar can open/close the sidebar. */}
            <Navbar toggleSidebar={toggleSidebar} />

            {/* Sidebar component.
                Passing sidebarOpen state so Sidebar knows whether it should be visible. */}
            <Sidebar isOpen={sidebarOpen} />

            {/* Main content area where different pages are displayed. */}
            <div
                style={{
                    ...styles.content,

                    // If sidebar is open, leave space for it.
                    // Otherwise remove the left margin so content uses the full screen.
                    marginLeft: sidebarOpen ? '260px' : '0px',

                    // Smooth animation while opening and closing the sidebar.
                    transition: 'margin-left 0.3s ease',
                }}
            >
                {/* Render the page content inside the layout. */}
                {children}
            </div>
        </div>
    );
};

// CSS styles stored as a JavaScript object.
const styles = {

    // Main container styling.
    container: {
        // Makes the layout cover the full screen height.
        minHeight: '100vh',

        // Light background color.
        background: '#F0F2FF',
    },

    // Styling for the page content section.
    content: {
        // Space at the top for the fixed Navbar.
        paddingTop: '64px',

        // Full screen height.
        minHeight: '100vh',

        // Top, Right, Bottom, Left padding.
        padding: '84px 24px 24px',
    },
};

// Export Layout component so it can be used in other files.
export default Layout;
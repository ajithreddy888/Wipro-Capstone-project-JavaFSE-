// Import React and required hooks.
// createContext - Creates a global context.
// useState - Stores and updates state.
// useContext - Used to access context data in other components.
import React, { createContext, useState, useContext } from 'react';

// Create a new Authentication Context.
// This context will store user information and authentication functions.
const AuthContext = createContext();

// AuthProvider component wraps the entire application.
// It provides authentication data (user, login, logout) to all child components.
export const AuthProvider = ({ children }) => {

    // Store logged-in user information.
    // useState receives a function so it executes only once when the app loads.
    const [user, setUser] = useState(() => {

        // Check whether user details already exist in localStorage.
        const stored = localStorage.getItem('user');

        // If user data exists, convert JSON string into an object.
        // Otherwise return null (no user logged in).
        return stored ? JSON.parse(stored) : null;
    });

    // Login function.
    // This function is called after successful login.
    const login = (userData) => {

        // Save JWT token in browser localStorage.
        // This token is used for authenticated API requests.
        localStorage.setItem('token', userData.token);

        // Save complete user details in localStorage.
        localStorage.setItem('user', JSON.stringify(userData));

        // Update React state with logged-in user information.
        setUser(userData);
    };

    // Logout function.
    const logout = () => {

        // Remove JWT token from localStorage.
        localStorage.removeItem('token');

        // Remove stored user details.
        localStorage.removeItem('user');

        // Clear the user state.
        setUser(null);
    };

    return (

        // AuthContext.Provider shares authentication data
        // with every component inside the application.
        <AuthContext.Provider value={{ user, login, logout }}>

            {/* Render all child components wrapped inside AuthProvider */}
            {children}

        </AuthContext.Provider>
    );
};

// Custom hook.
// Instead of writing useContext(AuthContext) everywhere,
// components can simply call useAuth().
export const useAuth = () => useContext(AuthContext);
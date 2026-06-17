// Import React to create the component.
import React from 'react';

// Import Navigate component from React Router.
// Navigate is used to redirect the user to another page.
import { Navigate } from 'react-router-dom';

// Import custom authentication context.
// It provides the currently logged-in user information.
import { useAuth } from '../context/AuthContext';

// ProtectedRoute component is used to protect routes/pages.
// Only authenticated users with the required roles can access the page.
const ProtectedRoute = ({ children, allowedRoles }) => {

    // Get the logged-in user details from AuthContext.
    const { user } = useAuth();

    // If no user is logged in,
    // redirect the user to the Login page.
    if (!user)
        return <Navigate to="/login" />;

    // Check whether the user's role is allowed to access this page.
    // Example:
    // allowedRoles = ["ADMIN", "DEVELOPER"]
    // If the user's role is not in this list,
    // redirect them to the Login page.
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/login" />;
    }

    // If the user is authenticated and has the required role,
    // display the requested page/component.
    return children;
};

// Export ProtectedRoute so it can be used while defining routes.
export default ProtectedRoute;
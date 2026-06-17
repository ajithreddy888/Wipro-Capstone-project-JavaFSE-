// Import the Axios library to make HTTP requests (GET, POST, PUT, DELETE)
import axios from 'axios';

// Create a reusable Axios instance
// This avoids writing the full backend URL in every API call.
const API = axios.create({
    // Base URL of the Spring Boot backend
    baseURL: 'http://localhost:8080',
});

// Axios interceptor runs automatically before every request.
// It is mainly used to attach the JWT token to protected API requests.
API.interceptors.request.use((config) => {

    // Get the JWT token stored in the browser's local storage after login
    const token = localStorage.getItem('token');

    // If the token exists, add it to the Authorization header
    // Backend will verify this token before allowing access.
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Return the updated request configuration
    return config;
});

// Export this Axios instance so it can be imported and used in any component
export default API;
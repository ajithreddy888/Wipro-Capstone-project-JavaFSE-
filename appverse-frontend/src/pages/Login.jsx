import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await API.post('/api/users/login', { email, password });
            const data = response.data;
            login(data);

            if (data.role === 'USER') navigate('/marketplace');
            else if (data.role === 'DEVELOPER') navigate('/developer/dashboard');
            else if (data.role === 'ADMIN') navigate('/admin/dashboard');

        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.logoSection}>
                    <div style={styles.logo}>⚡</div>
                    <h1 style={styles.appName}>AppVerse</h1>
                    <p style={styles.tagline}>Smart App Marketplace</p>
                </div>

                <h2 style={styles.title}>Welcome Back</h2>
                <p style={styles.subtitle}>Sign in to your account</p>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleLogin}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        style={loading ? styles.buttonDisabled : styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p style={styles.registerText}>
                    Don't have an account?{' '}
                    <Link to="/register" style={styles.link}>Register here</Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #6C63FF 0%, #FF6584 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
    },
    card: {
        background: '#ffffff',
        borderRadius: '24px',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    },
    logoSection: {
        textAlign: 'center',
        marginBottom: '32px',
    },
    logo: {
        fontSize: '48px',
        marginBottom: '8px',
    },
    appName: {
        fontSize: '28px',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        margin: '0',
    },
    tagline: {
        color: '#888',
        fontSize: '14px',
        marginTop: '4px',
    },
    title: {
        fontSize: '22px',
        fontWeight: '700',
        color: '#2D2D2D',
        marginBottom: '4px',
    },
    subtitle: {
        color: '#888',
        fontSize: '14px',
        marginBottom: '28px',
    },
    error: {
        background: '#FFE8EC',
        color: '#FF6584',
        padding: '12px 16px',
        borderRadius: '10px',
        fontSize: '14px',
        marginBottom: '20px',
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        fontSize: '13px',
        fontWeight: '600',
        color: '#555',
        marginBottom: '8px',
    },
    input: {
        width: '100%',
        padding: '14px 16px',
        borderRadius: '12px',
        border: '2px solid #E8E8FF',
        fontSize: '14px',
        color: '#2D2D2D',
        background: '#F8F8FF',
        transition: 'border 0.2s',
        boxSizing: 'border-box',
    },
    button: {
        width: '100%',
        padding: '14px',
        background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
        color: '#fff',
        fontSize: '16px',
        fontWeight: '700',
        borderRadius: '12px',
        border: 'none',
        cursor: 'pointer',
        marginTop: '8px',
        transition: 'opacity 0.2s',
    },
    buttonDisabled: {
        width: '100%',
        padding: '14px',
        background: '#ccc',
        color: '#fff',
        fontSize: '16px',
        fontWeight: '700',
        borderRadius: '12px',
        border: 'none',
        cursor: 'not-allowed',
        marginTop: '8px',
    },
    registerText: {
        textAlign: 'center',
        marginTop: '24px',
        fontSize: '14px',
        color: '#888',
    },
    link: {
        color: '#6C63FF',
        fontWeight: '600',
        textDecoration: 'none',
    },
};

export default Login;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const Register = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'USER'
    });
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => ({
        ...prev,
        [name]: value
    }));

    setErrors(prev => ({
        ...prev,
        [name]: ""
    }));
};

    const handleRegister = async (e) => {
    e.preventDefault();

    const validationErrors = {};

    // Name validation
    if (form.name.trim().length < 3) {
        validationErrors.name = "Name must be at least 3 characters.";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email)) {
        validationErrors.email = "Please enter a valid email address.";
    }

    // Password validation
    if (form.password.length < 3) {
        validationErrors.password = "Password must be at least 3 characters.";
    }

    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
    }

    setErrors({});
    setLoading(true);
    setError('');

    try {
        await API.post('/api/users/register', form);
        navigate('/login');
    } catch (err) {
        setError(err.response?.data?.error || 'Registration failed');
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

                <h2 style={styles.title}>Create Account</h2>
                <p style={styles.subtitle}>Join AppVerse today</p>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleRegister}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            value={form.name}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                        
                        {errors.name && (
                           <div style={{
                              color: '#FF6584',
                              fontSize: '12px',
                               marginTop: '6px'
                               }}> 
                            {errors.name}
                            </div>)}
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                        {errors.email && (
                            <div style={{
                                color: '#FF6584',
                                fontSize: '12px',
                                marginTop: '6px'
                                }}>
                                    {errors.email}
                            </div>
                                )}
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            value={form.password}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                        {errors.password && (
                             <div style={{
                                color: '#FF6584',
                                fontSize: '12px',
                                marginTop: '6px'
                         }}>
                        {errors.password}
                       </div>)}




                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Register As</label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            style={styles.select}
                        >
                            <option value="USER">User</option>
                            <option value="DEVELOPER">Developer</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        style={loading ? styles.buttonDisabled : styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p style={styles.loginText}>
                    Already have an account?{' '}
                    <Link to="/login" style={styles.link}>Sign in here</Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #43E97B 0%, #6C63FF 100%)',
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
        background: 'linear-gradient(135deg, #43E97B, #6C63FF)',
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
        boxSizing: 'border-box',
    },
    select: {
        width: '100%',
        padding: '14px 16px',
        borderRadius: '12px',
        border: '2px solid #E8E8FF',
        fontSize: '14px',
        color: '#2D2D2D',
        background: '#F8F8FF',
        boxSizing: 'border-box',
        cursor: 'pointer',
    },
    button: {
        width: '100%',
        padding: '14px',
        background: 'linear-gradient(135deg, #43E97B, #6C63FF)',
        color: '#fff',
        fontSize: '16px',
        fontWeight: '700',
        borderRadius: '12px',
        border: 'none',
        cursor: 'pointer',
        marginTop: '8px',
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
    loginText: {
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

export default Register;
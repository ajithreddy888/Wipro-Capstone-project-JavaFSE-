import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';

const CreateApp = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        description: '',
        category: 'Productivity',
        currentVersion: '1.0.0',
        releaseNotes: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const categories = ['Productivity', 'Photography', 'Music', 'Health', 'Education', 'Finance', 'Entertainment'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (!form.name || !form.description) {
            setError('Name and description are required');
            return;
        }
        setLoading(true);
        setError('');

        API.post('/api/developer/apps/create', {
            ...form,
            developerName: user?.name,
        })
            .then(() => navigate('/developer/apps'))
            .catch(err => {
                setError(err.response?.data?.error || 'Failed to create app');
                setLoading(false);
            });
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 14px',
        borderRadius: '10px',
        border: '2px solid #E8E8FF',
        fontSize: '14px',
        background: '#F8F8FF',
        boxSizing: 'border-box',
        marginTop: '6px',
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>Publish New App</h2>
            <p style={{ color: '#888', marginBottom: '24px' }}>Fill in the details to publish your app</p>

            <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 20px rgba(108,99,255,0.08)' }}>
                {error && (
                    <div style={{ background: '#FFE8EC', color: '#FF6584', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px' }}>
                        {error}
                    </div>
                )}

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>App Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Enter app name" style={inputStyle} />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>Description *</label>
                    <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe your app..." rows={4} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>Category</label>
                    <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>Version</label>
                    <input name="currentVersion" value={form.currentVersion} onChange={handleChange} placeholder="1.0.0" style={inputStyle} />
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>Release Notes</label>
                    <textarea name="releaseNotes" value={form.releaseNotes} onChange={handleChange} placeholder="What's new in this version..." rows={3} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => navigate('/developer/apps')}
                        style={{ flex: 1, padding: '12px', background: '#F0F2FF', color: '#6C63FF', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #6C63FF, #FF6584)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}
                    >
                        {loading ? 'Publishing...' : '🚀 Publish App'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateApp;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

const MyApps = () => {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loadApps = () => {
        API.get('/api/developer/apps/my')
            .then(res => {
                setApps(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        loadApps();
    }, []);

const handleSubmit = (id) => {
    API.put(`/api/developer/apps/${id}/submit`)
        .then(loadApps)
        .catch(() => alert('Failed to submit'));
};

    const handleUnpublish = (id) => {
        API.put(`/api/developer/apps/${id}/unpublish`)
            .then(loadApps)
            .catch(() => alert('Failed to unpublish'));
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ margin: 0 }}>My Apps</h2>
                    <p style={{ color: '#888', margin: '4px 0 0' }}>Manage your published apps</p>
                </div>
                <button
                    onClick={() => navigate('/developer/create')}
                    style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #6C63FF, #FF6584)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}
                >
                    ➕ New App
                </button>
            </div>

            {apps.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '16px', color: '#888' }}>
                    <div style={{ fontSize: '48px' }}>📭</div>
                    <p>No apps yet. Start publishing!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {apps.map(app => (
                        <div key={app.id} style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 20px rgba(108,99,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #6C63FF, #FF6584)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '20px' }}>
                                    {app.name.charAt(0)}
                                </div>
                                <div>
                                    <div style={{ fontWeight: '700', color: '#2D2D2D', fontSize: '15px' }}>{app.name}</div>
                                    <div style={{ color: '#888', fontSize: '12px' }}>{app.category} • v{app.currentVersion}</div>
                                    <div style={{ color: '#888', fontSize: '12px' }}>⬇️ {app.totalDownloads} downloads</div>
                                </div>
                            </div>
<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <span style={{
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        background: app.status === 'PUBLISHED' ? '#E8FFF3' :
                    app.status === 'DRAFT' ? '#F0F2FF' :
                    app.status === 'PENDING' ? '#FFF8E1' :
                    app.status === 'BLOCKED' ? '#FFE8EC' : '#F0F2FF',
        color: app.status === 'PUBLISHED' ? '#43E97B' :
               app.status === 'DRAFT' ? '#6C63FF' :
               app.status === 'PENDING' ? '#FFD700' :
               app.status === 'BLOCKED' ? '#FF6584' : '#6C63FF',
    }}>
        {app.status}
    </span>

    {app.status === 'DRAFT' && (
        <button
            onClick={() => handleSubmit(app.id)}
            style={{ padding: '8px 16px', background: '#6C63FF', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
        >
            Submit for Review
        </button>
    )}
    {app.status === 'PENDING' && (
        <button disabled style={{ padding: '8px 16px', background: '#FFF8E1', color: '#FFD700', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'not-allowed' }}>
            ⏳ Pending Review
        </button>
    )}
    {app.status === 'PUBLISHED' && (
        <button disabled style={{ padding: '8px 16px', background: '#E8FFF3', color: '#43E97B', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'not-allowed' }}>
            ✅ Published
        </button>
    )}
    {app.status === 'BLOCKED' && (
        <button disabled style={{ padding: '8px 16px', background: '#FFE8EC', color: '#FF6584', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'not-allowed' }}>
            🚫 Blocked by Admin
        </button>
    )}
</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyApps;
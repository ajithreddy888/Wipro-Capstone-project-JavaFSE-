import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';

const DevDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get('/api/developer/apps/my')
            .then(res => {
                setApps(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const totalDownloads = apps.reduce((sum, app) => sum + app.totalDownloads, 0);
    const published = apps.filter(a => a.status === 'PUBLISHED').length;
    const drafts = apps.filter(a => a.status === 'DRAFT').length;

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Welcome, {user?.name} 👋</h2>
            <p style={{ color: '#888' }}>Developer Dashboard</p>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '16px', margin: '24px 0', flexWrap: 'wrap' }}>
                {[
                    { label: 'Total Apps', value: apps.length, icon: '📱', color: '#6C63FF' },
                    { label: 'Published', value: published, icon: '✅', color: '#43E97B' },
                    { label: 'Drafts', value: drafts, icon: '📝', color: '#FF6584' },
                    { label: 'Total Downloads', value: totalDownloads, icon: '⬇️', color: '#FFD700' },
                ].map(stat => (
                    <div key={stat.label} style={{
                        background: '#fff',
                        borderRadius: '16px',
                        padding: '20px 28px',
                        boxShadow: '0 4px 20px rgba(108,99,255,0.08)',
                        minWidth: '160px',
                        flex: 1,
                    }}>
                        <div style={{ fontSize: '28px' }}>{stat.icon}</div>
                        <div style={{ fontSize: '28px', fontWeight: '800', color: stat.color }}>{stat.value}</div>
                        <div style={{ fontSize: '13px', color: '#888' }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(108,99,255,0.08)', marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '16px' }}>Quick Actions</h3>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => navigate('/developer/create')}
                        style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #6C63FF, #FF6584)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}
                    >
                        ➕ Publish New App
                    </button>
                    <button
                        onClick={() => navigate('/developer/apps')}
                        style={{ padding: '10px 20px', background: '#F0F2FF', color: '#6C63FF', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}
                    >
                        📱 Manage My Apps
                    </button>
                </div>
            </div>

            {/* Recent Apps */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(108,99,255,0.08)' }}>
                <h3 style={{ marginBottom: '16px' }}>My Apps</h3>
                {apps.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                        <div style={{ fontSize: '40px' }}>📭</div>
                        <p>No apps yet. Publish your first app!</p>
                        <button
                            onClick={() => navigate('/developer/create')}
                            style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #6C63FF, #FF6584)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', marginTop: '12px' }}
                        >
                            ➕ Publish App
                        </button>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #F0F2FF' }}>
                                <th style={{ textAlign: 'left', padding: '10px', color: '#888', fontWeight: '600', fontSize: '13px' }}>App Name</th>
                                <th style={{ textAlign: 'left', padding: '10px', color: '#888', fontWeight: '600', fontSize: '13px' }}>Category</th>
                                <th style={{ textAlign: 'left', padding: '10px', color: '#888', fontWeight: '600', fontSize: '13px' }}>Version</th>
                                <th style={{ textAlign: 'left', padding: '10px', color: '#888', fontWeight: '600', fontSize: '13px' }}>Status</th>
                                <th style={{ textAlign: 'left', padding: '10px', color: '#888', fontWeight: '600', fontSize: '13px' }}>Downloads</th>
                            </tr>
                        </thead>
                        <tbody>
                            {apps.map(app => (
                                <tr key={app.id} style={{ borderBottom: '1px solid #F0F2FF' }}>
                                    <td style={{ padding: '12px 10px', fontWeight: '600', color: '#2D2D2D' }}>{app.name}</td>
                                    <td style={{ padding: '12px 10px', color: '#888', fontSize: '13px' }}>{app.category}</td>
                                    <td style={{ padding: '12px 10px', color: '#888', fontSize: '13px' }}>{app.currentVersion}</td>
                                    <td style={{ padding: '12px 10px' }}>
                                        <span style={{
                                            padding: '3px 10px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            background: app.status === 'PUBLISHED' ? '#E8FFF3' : app.status === 'DRAFT' ? '#F0F2FF' : '#FFE8EC',
                                            color: app.status === 'PUBLISHED' ? '#43E97B' : app.status === 'DRAFT' ? '#6C63FF' : '#FF6584',
                                        }}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 10px', color: '#888', fontSize: '13px' }}>{app.totalDownloads}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default DevDashboard;
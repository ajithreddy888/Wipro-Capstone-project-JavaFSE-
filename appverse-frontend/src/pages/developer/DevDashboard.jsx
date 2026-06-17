// =============================================
// DevDashboard.jsx
// Beginner-friendly commented version.
// Only comments have been added.
// =============================================

// Imports React and required hooks/components.

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';

// Main component declaration.
const DevDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [devApps, setDevApps] = useState([]);
    const [marketplaceApps, setMarketplaceApps] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = () => {
        // Load from developer-service — for status, version info
        API.get('/api/developer/apps/my')
            .then(res => {
                setDevApps(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));

        // Load from app-service — for real download counts
        if (user?.userId) {
            API.get(`/api/apps/developer/${user.userId}`)
                .then(res => setMarketplaceApps(res.data))
                .catch(() => {});
        }
    };

    // Runs when component is mounted.
    useEffect(() => {
        loadData();
    }, []);

    // Get real download count from app_db for an app by name
    const getRealDownloads = (appName) => {
        const found = marketplaceApps.find(a =>
            a.name.toLowerCase() === appName.toLowerCase()
        );
        return found ? found.totalDownloads : 0;
    };

    const totalDownloads = devApps.reduce((sum, app) =>
        sum + getRealDownloads(app.name), 0);
    const published = devApps.filter(a => a.status === 'PUBLISHED').length;
    const pending = devApps.filter(a => a.status === 'PENDING').length;
    const drafts = devApps.filter(a => a.status === 'DRAFT').length;
    const blocked = devApps.filter(a => a.status === 'BLOCKED').length;

    if (loading) return <div>Loading...</div>;

    // JSX returned to the browser.
    return (
        <div>
            <h2>Welcome, {user?.name} 👋</h2>
            <p style={{ color: '#888' }}>Developer Dashboard</p>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '16px', margin: '24px 0', flexWrap: 'wrap' }}>
                {[
                    { label: 'Total Apps', value: devApps.length, icon: '📱', color: '#6C63FF' },
                    { label: 'Published', value: published, icon: '✅', color: '#43E97B' },
                    { label: 'Pending Review', value: pending, icon: '⏳', color: '#FFD700' },
                    { label: 'Drafts', value: drafts, icon: '📝', color: '#888' },
                    { label: 'Blocked', value: blocked, icon: '🚫', color: '#FF6584' },
                    { label: 'Total Downloads', value: totalDownloads, icon: '⬇️', color: '#6C63FF' },
                ].map(stat => (
                    <div key={stat.label} style={{
                        background: '#fff', borderRadius: '16px', padding: '20px 24px',
                        boxShadow: '0 4px 20px rgba(108,99,255,0.08)', minWidth: '140px', flex: 1,
                    }}>
                        <div style={{ fontSize: '24px' }}>{stat.icon}</div>
                        <div style={{ fontSize: '26px', fontWeight: '800', color: stat.color }}>{stat.value}</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(108,99,255,0.08)', marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '16px' }}>Quick Actions</h3>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button onClick={() => navigate('/developer/create')}
                        style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #6C63FF, #FF6584)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}>
                        ➕ Create New App
                    </button>
                    <button onClick={() => navigate('/developer/apps')}
                        style={{ padding: '10px 20px', background: '#F0F2FF', color: '#6C63FF', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}>
                        📱 Manage Apps
                    </button>
                </div>
            </div>

            {/* Apps Table with real download counts */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(108,99,255,0.08)' }}>
                <h3 style={{ marginBottom: '16px' }}>My Apps Overview</h3>
                {devApps.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                        <div style={{ fontSize: '40px' }}>📭</div>
                        <p>No apps yet.</p>
                        <button onClick={() => navigate('/developer/create')}
                            style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #6C63FF, #FF6584)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', marginTop: '12px' }}>
                            ➕ Create App
                        </button>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #F0F2FF' }}>
                                {['App Name', 'Category', 'Version', 'Status', 'Downloads'].map(h => (
                                    <th key={h} style={{ textAlign: 'left', padding: '10px', color: '#888', fontWeight: '600', fontSize: '13px' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {devApps.map(app => (
                                <tr key={app.id} style={{ borderBottom: '1px solid #F0F2FF' }}>
                                    <td style={{ padding: '12px 10px', fontWeight: '600', color: '#2D2D2D' }}>{app.name}</td>
                                    <td style={{ padding: '12px 10px', color: '#888', fontSize: '13px' }}>{app.category}</td>
                                    <td style={{ padding: '12px 10px', color: '#6C63FF', fontSize: '13px', fontWeight: '600' }}>v{app.currentVersion}</td>
                                    <td style={{ padding: '12px 10px' }}>
                                        <span style={{
                                            padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                                            background: app.status === 'PUBLISHED' ? '#E8FFF3' :
                                                        app.status === 'PENDING' ? '#FFF8E1' :
                                                        app.status === 'BLOCKED' ? '#FFE8EC' : '#F0F2FF',
                                            color: app.status === 'PUBLISHED' ? '#43E97B' :
                                                   app.status === 'PENDING' ? '#FFD700' :
                                                   app.status === 'BLOCKED' ? '#FF6584' : '#6C63FF',
                                        }}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 10px', color: '#2D2D2D', fontSize: '13px', fontWeight: '600' }}>
                                        ⬇️ {getRealDownloads(app.name)}
                                    </td>
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
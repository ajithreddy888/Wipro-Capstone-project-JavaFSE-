// useState -> Stores component state.
// useEffect -> Executes code when component loads.

import React, { useState, useEffect } from 'react';
// Import the reusable Axios instance for backend API calls.
import API from '../../api/axios';

// Admin dashboard component.
// Displays statistics, pending approvals and all marketplace apps.
const AdminDashboard = () => {
    // Stores all applications available in the marketplace.
    const [apps, setApps] = useState([]);
    // Stores applications waiting for admin approval.
    const [pendingApps, setPendingApps] = useState([]);
    // Controls loading indicator while data is fetched.
    const [loading, setLoading] = useState(true);

    // Fetch dashboard data from the backend.
    const loadData = () => {
        API.get('/api/apps/all')
            .then(res => {
                setApps(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));

        API.get('/api/developer/admin/apps/pending')
            .then(res => setPendingApps(res.data))
            .catch(() => {});
    };

    // Runs only once when the component is first rendered.
    useEffect(() => {
        loadData();
    }, []);

    // Approve a pending application.
    const handleApprove = (id) => {
        API.put(`/api/developer/admin/apps/${id}/approve`)
            .then(loadData)
            .catch(() => alert('Failed to approve'));
    };

    // Block/reject a pending application.
    const handleBlock = (id) => {
        API.put(`/api/developer/admin/apps/${id}/block`)
            .then(loadData)
            .catch(() => alert('Failed to block'));
    };

    // Calculate total downloads across all apps.
    const totalDownloads = apps.reduce((sum, app) => sum + app.totalDownloads, 0);
    // Calculate average rating of all applications.
    const avgRating = apps.length > 0
        ? (apps.reduce((sum, app) => sum + app.averageRating, 0) / apps.length).toFixed(1)
        : 0;

    // Show loading message until API calls finish.
    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <p style={{ color: '#888', marginBottom: '24px' }}>Platform overview and management</p>

            {/* Dashboard statistic cards */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {[
                    { label: 'Total Apps', value: apps.length, icon: '📱', color: '#6C63FF' },
                    { label: 'Total Downloads', value: totalDownloads, icon: '⬇️', color: '#43E97B' },
                    { label: 'Avg Rating', value: avgRating, icon: '⭐', color: '#FFD700' },
                    { label: 'Pending Review', value: pendingApps.length, icon: '⏳', color: '#FF6584' },
                ].map(stat => (
                    <div key={stat.label} style={{
                        background: '#fff', borderRadius: '16px', padding: '20px 28px',
                        boxShadow: '0 4px 20px rgba(108,99,255,0.08)', flex: 1, minWidth: '150px',
                    }}>
                        <div style={{ fontSize: '28px' }}>{stat.icon}</div>
                        <div style={{ fontSize: '28px', fontWeight: '800', color: stat.color }}>{stat.value}</div>
                        <div style={{ fontSize: '13px', color: '#888' }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* List of apps waiting for admin approval */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(108,99,255,0.08)', marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '16px' }}>⏳ Pending Approvals ({pendingApps.length})</h3>
                {pendingApps.length === 0 ? (
                    <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>No apps pending review</p>
                ) : (
                    pendingApps.map(app => (
                        <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #F0F2FF', borderRadius: '12px', marginBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
                            <div>
                                <div style={{ fontWeight: '700', color: '#2D2D2D' }}>
                                    {app.name}
                                    <span style={{ marginLeft: '8px', fontSize: '12px', background: '#F0F2FF', color: '#6C63FF', padding: '2px 8px', borderRadius: '10px' }}>
                                        v{app.currentVersion}
                                    </span>
                                </div>
                                <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
                                    by {app.developerName} • {app.category}
                                </div>
                                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                    {app.description?.substring(0, 100)}...
                                </div>
                                {app.releaseNotes && (
                                    <div style={{ fontSize: '12px', color: '#43E97B', marginTop: '4px', fontWeight: '600' }}>
                                        📝 Release Notes: {app.releaseNotes}
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => handleApprove(app.id)}
                                    style={{ padding: '8px 16px', background: '#43E97B', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                                    ✅ Approve
                                </button>
                                <button onClick={() => handleBlock(app.id)}
                                    style={{ padding: '8px 16px', background: '#FF6584', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                                    🚫 Block
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Table showing all marketplace applications */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(108,99,255,0.08)' }}>
                <h3 style={{ marginBottom: '16px' }}>All Marketplace Apps</h3>
                {apps.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                        <div style={{ fontSize: '40px' }}>📭</div>
                        <p>No apps in marketplace yet</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #F0F2FF' }}>
                                {['App Name', 'Developer', 'Category', 'Rating', 'Downloads', 'Status'].map(h => (
                                    <th key={h} style={{ textAlign: 'left', padding: '10px', color: '#888', fontWeight: '600', fontSize: '13px' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {apps.map(app => (
                                <tr key={app.id} style={{ borderBottom: '1px solid #F0F2FF' }}>
                                    <td style={{ padding: '12px 10px', fontWeight: '600', color: '#2D2D2D' }}>{app.name}</td>
                                    <td style={{ padding: '12px 10px', color: '#888', fontSize: '13px' }}>{app.developerName}</td>
                                    <td style={{ padding: '12px 10px', color: '#888', fontSize: '13px' }}>{app.category}</td>
                                    <td style={{ padding: '12px 10px', color: '#888', fontSize: '13px' }}>
                                        ⭐ {app.averageRating > 0 ? app.averageRating.toFixed(1) : 'N/A'}
                                    </td>
                                    <td style={{ padding: '12px 10px', color: '#888', fontSize: '13px' }}>{app.totalDownloads}</td>
                                    <td style={{ padding: '12px 10px' }}>
                                        <span style={{
                                            padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                                            background: app.status === 'ACTIVE' ? '#E8FFF3' : '#FFE8EC',
                                            color: app.status === 'ACTIVE' ? '#43E97B' : '#FF6584',
                                        }}>
                                            {app.status}
                                        </span>
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


export default AdminDashboard;
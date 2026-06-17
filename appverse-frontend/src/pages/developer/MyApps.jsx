// =============================================
// MyApps.jsx
// Beginner-friendly commented version.
// Only comments have been added.
// =============================================

// Imports React and required hooks/components.

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

// Main component declaration.
const MyApps = () => {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingApp, setEditingApp] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [versioningApp, setVersioningApp] = useState(null);
    const [versionForm, setVersionForm] = useState({ newVersion: '', releaseNotes: '' });
    const [viewingVersions, setViewingVersions] = useState(null);
    const [versions, setVersions] = useState([]);
    const navigate = useNavigate();
    const { user } = useAuth();
const [marketplaceApps, setMarketplaceApps] = useState([]);

    const categories = ['Productivity', 'Photography', 'Music',
        'Health', 'Education', 'Finance', 'Entertainment'];

const loadApps = () => {
    API.get('/api/developer/apps/my')
        .then(res => {
            setApps(res.data);
            setLoading(false);
        })
        .catch(() => setLoading(false));

    if (user?.userId) {
        API.get(`/api/apps/developer/${user.userId}`)
            .then(res => setMarketplaceApps(res.data))
            .catch(() => {});
    }
};

    // Runs when component is mounted.
    useEffect(() => {
        loadApps();
    }, []);
const getRealDownloads = (appName) => {
    const found = marketplaceApps.find(a =>
        a.name.toLowerCase() === appName.toLowerCase()
    );
    return found ? found.totalDownloads : 0;
};
    const handleSubmit = (id) => {
        API.put(`/api/developer/apps/${id}/submit`)
            .then(loadApps)
            .catch(() => alert('Failed to submit'));
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
            API.delete(`/api/developer/apps/${id}/delete`)
                .then(loadApps)
                .catch(() => alert('Failed to delete'));
        }
    };

    const handleEditClick = (app) => {
        setEditingApp(app.id);
        setVersioningApp(null);
        setViewingVersions(null);
        setEditForm({
            name: app.name,
            description: app.description,
            category: app.category,
            currentVersion: app.currentVersion,
            releaseNotes: app.releaseNotes,
            developerName: app.developerName,
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSave = (id) => {
        API.put(`/api/developer/apps/${id}/update`, editForm)
            .then(() => {
                setEditingApp(null);
                loadApps();
            })
            .catch(() => alert('Failed to update'));
    };

    const handleVersionClick = (app) => {
        setVersioningApp(app.id);
        setEditingApp(null);
        setViewingVersions(null);
        setVersionForm({ newVersion: '', releaseNotes: '' });
    };

    const handleVersionChange = (e) => {
        const { name, value } = e.target;
        setVersionForm(prev => ({ ...prev, [name]: value }));
    };

    const handleVersionRelease = (id) => {
        if (!versionForm.newVersion) {
            alert('Please enter a version number');
            return;
        }
        API.put(`/api/developer/apps/${id}/new-version`, null, {
            params: {
                newVersion: versionForm.newVersion,
                releaseNotes: versionForm.releaseNotes
            }
        })
            .then(() => {
                setVersioningApp(null);
                loadApps();
                alert('New version submitted for review!');
            })
            .catch(() => alert('Failed to release version'));
    };

    const handleViewVersions = (id) => {
        setViewingVersions(id);
        setEditingApp(null);
        setVersioningApp(null);
        API.get(`/api/developer/apps/${id}/versions`)
            .then(res => setVersions(res.data))
            .catch(() => setVersions([]));
    };

    const inputStyle = {
        width: '100%', padding: '8px 12px', borderRadius: '8px',
        border: '1.5px solid #E8E8FF', fontSize: '13px',
        background: '#F8F8FF', boxSizing: 'border-box', marginBottom: '8px',
        fontFamily: 'inherit',
    };

    const statusStyle = (status) => ({
        padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
        background: status === 'PUBLISHED' ? '#E8FFF3' :
                    status === 'PENDING' ? '#FFF8E1' :
                    status === 'BLOCKED' ? '#FFE8EC' :
                    status === 'UNPUBLISHED' ? '#F5F5F5' : '#F0F2FF',
        color: status === 'PUBLISHED' ? '#43E97B' :
               status === 'PENDING' ? '#FFD700' :
               status === 'BLOCKED' ? '#FF6584' :
               status === 'UNPUBLISHED' ? '#888' : '#6C63FF',
    });

    if (loading) return <div>Loading...</div>;

    // JSX returned to the browser.
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ margin: 0 }}>My Apps</h2>
                    <p style={{ color: '#888', margin: '4px 0 0' }}>{apps.length} apps total</p>
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
                        <div key={app.id} style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 20px rgba(108,99,255,0.08)' }}>

                            {/* App Info Row */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                    <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #6C63FF, #FF6584)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '20px' }}>
                                        {app.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '700', color: '#2D2D2D', fontSize: '15px' }}>{app.name}</div>
                                        <div style={{ color: '#888', fontSize: '12px' }}>{app.category} • v{app.currentVersion}</div>
                                        <div style={{ color: '#888', fontSize: '12px' }}>
    ⬇️ {getRealDownloads(app.name)} downloads
</div>
</div>
                                </div>

                                {/* Buttons */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    <span style={statusStyle(app.status)}>{app.status}</span>

                                    {app.status === 'DRAFT' && (
                                        <button onClick={() => handleSubmit(app.id)}
                                            style={{ padding: '7px 12px', background: '#6C63FF', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}>
                                            📤 Submit
                                        </button>
                                    )}
                                    {app.status === 'PENDING' && (
                                        <span style={{ fontSize: '12px', color: '#FFD700', fontWeight: '600' }}>⏳ Under Review</span>
                                    )}
                                    {app.status === 'PUBLISHED' && (
                                        <button onClick={() => handleVersionClick(app)}
                                            style={{ padding: '7px 12px', background: '#43E97B', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}>
                                            🚀 New Version
                                        </button>
                                    )}
                                    {app.status === 'BLOCKED' && (
                                        <span style={{ fontSize: '12px', color: '#FF6584', fontWeight: '600' }}>🚫 Blocked</span>
                                    )}

                                    {/* View Versions */}
                                    <button
                                        onClick={() => viewingVersions === app.id ? setViewingVersions(null) : handleViewVersions(app.id)}
                                        style={{ padding: '7px 12px', background: '#F0F2FF', color: '#6C63FF', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}
                                    >
                                        📋 Versions
                                    </button>

                                    {/* Edit */}
                                    <button
                                        onClick={() => editingApp === app.id ? setEditingApp(null) : handleEditClick(app)}
                                        style={{ padding: '7px 12px', background: '#F0F2FF', color: '#6C63FF', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}
                                    >
                                        ✏️ Edit
                                    </button>

                                    {/* Delete */}
                                    <button
                                        onClick={() => handleDelete(app.id, app.name)}
                                        style={{ padding: '7px 12px', background: '#FFE8EC', color: '#FF6584', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>

                            {/* Edit Form */}
                            {editingApp === app.id && (
                                <div style={{ marginTop: '16px', padding: '16px', background: '#F8F8FF', borderRadius: '12px', border: '1.5px solid #E8E8FF' }}>
                                    <h4 style={{ margin: '0 0 12px', color: '#6C63FF' }}>✏️ Edit App Details</h4>
                                    <input name="name" value={editForm.name}
                                        onChange={handleEditChange} placeholder="App Name" style={inputStyle} />
                                    <textarea name="description" value={editForm.description}
                                        onChange={handleEditChange} placeholder="Description"
                                        rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                                    <select name="category" value={editForm.category}
                                        onChange={handleEditChange} style={inputStyle}>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <textarea name="releaseNotes" value={editForm.releaseNotes}
                                        onChange={handleEditChange} placeholder="Release Notes"
                                        rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                        <button onClick={() => handleEditSave(app.id)}
                                            style={{ flex: 1, padding: '10px', background: 'linear-gradient(135deg, #6C63FF, #FF6584)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                                            💾 Save Changes
                                        </button>
                                        <button onClick={() => setEditingApp(null)}
                                            style={{ flex: 1, padding: '10px', background: '#F0F2FF', color: '#6C63FF', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* New Version Form */}
                            {versioningApp === app.id && (
                                <div style={{ marginTop: '16px', padding: '16px', background: '#E8FFF3', borderRadius: '12px', border: '1.5px solid #43E97B' }}>
                                    <h4 style={{ margin: '0 0 12px', color: '#43E97B' }}>🚀 Release New Version</h4>
                                    <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                                        Current version: <strong>v{app.currentVersion}</strong> — New version will be submitted for admin review.
                                    </p>
                                    <input name="newVersion" value={versionForm.newVersion}
                                        onChange={handleVersionChange}
                                        placeholder="New Version (e.g. 2.0.0)" style={inputStyle} />
                                    <textarea name="releaseNotes" value={versionForm.releaseNotes}
                                        onChange={handleVersionChange}
                                        placeholder="What's new in this version?"
                                        rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                        <button onClick={() => handleVersionRelease(app.id)}
                                            style={{ flex: 1, padding: '10px', background: '#43E97B', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                                            🚀 Release Version
                                        </button>
                                        <button onClick={() => setVersioningApp(null)}
                                            style={{ flex: 1, padding: '10px', background: '#F0F2FF', color: '#6C63FF', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Version History */}
                            {viewingVersions === app.id && (
                                <div style={{ marginTop: '16px', padding: '16px', background: '#F8F8FF', borderRadius: '12px', border: '1.5px solid #E8E8FF' }}>
                                    <h4 style={{ margin: '0 0 12px', color: '#2D2D2D' }}>📋 Version History</h4>
                                    {versions.length === 0 ? (
                                        <p style={{ color: '#888', fontSize: '13px' }}>No version history yet.</p>
                                    ) : (
                                        versions.map((v, index) => (
                                            <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#fff', borderRadius: '8px', marginBottom: '8px', border: '1px solid #E8E8FF' }}>
                                                <div>
                                                    <span style={{ fontWeight: '700', color: '#6C63FF', fontSize: '13px' }}>v{v.version}</span>
                                                    {index === 0 && <span style={{ marginLeft: '8px', fontSize: '10px', background: '#E8FFF3', color: '#43E97B', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>Latest</span>}
                                                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#666' }}>{v.releaseNotes || 'No release notes'}</p>
                                                </div>
                                                <div style={{ fontSize: '11px', color: '#aaa' }}>
                                                    {v.releasedAt ? new Date(v.releasedAt).toLocaleDateString() : ''}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    <button onClick={() => setViewingVersions(null)}
                                        style={{ marginTop: '8px', padding: '8px 16px', background: '#F0F2FF', color: '#6C63FF', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}>
                                        Close
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


export default MyApps;
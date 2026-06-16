import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [allApps, setAllApps] = useState([]);
    const [loading, setLoading] = useState(false);
    const [generated, setGenerated] = useState(false);
    const navigate = useNavigate();

    const loadAllApps = () => {
        API.get('/api/apps/all')
            .then(res => setAllApps(res.data))
            .catch(() => {});
    };

    useEffect(() => {
        loadAllApps();
    }, []);

    const getRecommendations = () => {
        setLoading(true);

        const downloadedApps = allApps.slice(0, 2).map(a => a.name);
        const availableApps = allApps.map(a => a.name);

        API.post('/api/ai/recommend', {
            downloadedApps: downloadedApps.length > 0 ? downloadedApps : ['Productivity App'],
            availableApps: availableApps.length > 0 ? availableApps : ['Sample App'],
        })
            .then(res => {
                setRecommendations(res.data.recommendedApps);
                setGenerated(true);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const handleViewApp = (appName) => {
        const app = allApps.find(a => a.name === appName);
        if (app) navigate(`/app/${app.id}`);
    };

    const colors = [
        'linear-gradient(135deg, #6C63FF, #FF6584)',
        'linear-gradient(135deg, #43E97B, #6C63FF)',
        'linear-gradient(135deg, #FF6584, #FFD700)',
        'linear-gradient(135deg, #6C63FF, #43E97B)',
        'linear-gradient(135deg, #FFD700, #FF6584)',
    ];

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>AI Recommendations</h1>
                <p style={styles.subtitle}>Personalized app suggestions powered by AI</p>
            </div>

            {/* Hero Banner */}
            <div style={styles.heroBanner}>
                <div style={styles.heroContent}>
                    <div style={styles.heroIcon}>🤖</div>
                    <h2 style={styles.heroTitle}>Discover Apps Made for You</h2>
                    <p style={styles.heroText}>
                        Our AI analyzes your interests and suggests the most relevant apps
                        from our marketplace just for you.
                    </p>
                    <button
                        style={loading ? styles.heroBtnDisabled : styles.heroBtn}
                        onClick={getRecommendations}
                        disabled={loading}
                    >
                        {loading ? '🤖 Analyzing...' : '✨ Get My Recommendations'}
                    </button>
                </div>
            </div>

            {/* Results */}
            {generated && (
                <div style={styles.resultsSection}>
                    <h2 style={styles.resultsTitle}>
                        🎯 Your Personalized Picks
                    </h2>
                    {recommendations.length === 0 ? (
                        <div style={styles.empty}>
                            <p>No recommendations available. Try adding more apps to the marketplace!</p>
                        </div>
                    ) : (
                        <div style={styles.grid}>
                            {recommendations.map((appName, index) => {
                                const app = allApps.find(a => a.name === appName);
                                return (
                                    <div key={index} style={styles.card}>
                                        <div style={{
                                            ...styles.cardIcon,
                                            background: colors[index % colors.length]
                                        }}>
                                            {appName.charAt(0).toUpperCase()}
                                        </div>
                                        <div style={styles.rankBadge}>#{index + 1}</div>
                                        <h3 style={styles.appName}>{appName}</h3>
                                        {app && (
                                            <>
                                                <p style={styles.developer}>by {app.developerName}</p>
                                                <span style={styles.categoryBadge}>{app.category}</span>
                                                <p style={styles.description}>
                                                    {app.description?.substring(0, 70)}...
                                                </p>
                                            </>
                                        )}
                                        <div style={styles.aiTag}>🤖 AI Recommended</div>
                                        {app && (
                                            <button
                                                style={styles.viewBtn}
                                                onClick={() => handleViewApp(appName)}
                                            >
                                                View App
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
    },
    header: {
        marginBottom: '24px',
    },
    title: {
        fontSize: '28px',
        fontWeight: '800',
        color: '#2D2D2D',
        margin: '0',
    },
    subtitle: {
        color: '#888',
        fontSize: '14px',
        marginTop: '4px',
    },
    heroBanner: {
        background: 'linear-gradient(135deg, #1E1E2F 0%, #6C63FF 100%)',
        borderRadius: '24px',
        padding: '48px',
        marginBottom: '32px',
        textAlign: 'center',
    },
    heroContent: {},
    heroIcon: {
        fontSize: '64px',
        marginBottom: '16px',
    },
    heroTitle: {
        fontSize: '28px',
        fontWeight: '800',
        color: '#fff',
        margin: '0 0 12px',
    },
    heroText: {
        fontSize: '15px',
        color: 'rgba(255,255,255,0.7)',
        maxWidth: '500px',
        margin: '0 auto 28px',
        lineHeight: '1.6',
    },
    heroBtn: {
        padding: '14px 36px',
        background: 'linear-gradient(135deg, #43E97B, #6C63FF)',
        color: '#fff',
        border: 'none',
        borderRadius: '14px',
        fontWeight: '700',
        fontSize: '16px',
        cursor: 'pointer',
        boxShadow: '0 8px 24px rgba(67,233,123,0.3)',
    },
    heroBtnDisabled: {
        padding: '14px 36px',
        background: '#555',
        color: '#fff',
        border: 'none',
        borderRadius: '14px',
        fontWeight: '700',
        fontSize: '16px',
        cursor: 'not-allowed',
    },
    resultsSection: {
        marginTop: '8px',
    },
    resultsTitle: {
        fontSize: '22px',
        fontWeight: '700',
        color: '#2D2D2D',
        marginBottom: '20px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '20px',
    },
    card: {
        background: '#fff',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(108,99,255,0.08)',
        position: 'relative',
        textAlign: 'center',
    },
    cardIcon: {
        width: '64px',
        height: '64px',
        borderRadius: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: '800',
        fontSize: '26px',
        margin: '0 auto 12px',
    },
    rankBadge: {
        position: 'absolute',
        top: '16px',
        right: '16px',
        background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
        color: '#fff',
        fontSize: '12px',
        fontWeight: '700',
        padding: '3px 10px',
        borderRadius: '20px',
    },
    appName: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#2D2D2D',
        margin: '0 0 4px',
    },
    developer: {
        fontSize: '12px',
        color: '#888',
        margin: '0 0 8px',
    },
    categoryBadge: {
        display: 'inline-block',
        background: '#F0F2FF',
        color: '#6C63FF',
        fontSize: '11px',
        fontWeight: '600',
        padding: '3px 10px',
        borderRadius: '20px',
        marginBottom: '8px',
    },
    description: {
        fontSize: '12px',
        color: '#666',
        lineHeight: '1.5',
        marginBottom: '12px',
    },
    aiTag: {
        fontSize: '11px',
        color: '#43E97B',
        fontWeight: '600',
        marginBottom: '12px',
    },
    viewBtn: {
        width: '100%',
        padding: '10px',
        background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        fontWeight: '600',
        fontSize: '13px',
        cursor: 'pointer',
    },
    empty: {
        textAlign: 'center',
        padding: '40px',
        color: '#888',
        background: '#fff',
        borderRadius: '16px',
    },
};

export default Recommendations;
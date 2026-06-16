import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

const Marketplace = () => {
    const [apps, setApps] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [downloadedAppIds, setDownloadedAppIds] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [recLoading, setRecLoading] = useState(false);
    const [recFetched, setRecFetched] = useState(false);
    const navigate = useNavigate();

    const categories = ['All', 'Productivity', 'Photography', 'Music', 'Health', 'Education', 'Finance', 'Entertainment'];

    const loadDownloadedIds = () => {
        API.get('/api/apps/my-download-ids')
            .then(res => setDownloadedAppIds(res.data))
            .catch(() => {});
    };

    const loadApps = (withRecommendations = false) => {
        API.get('/api/apps/all')
            .then(res => {
                setApps(res.data);
                setFiltered(res.data);
                setLoading(false);
                if (withRecommendations && !recFetched) {
                    fetchRecommendations(res.data);
                    setRecFetched(true);
                }
            })
            .catch(() => setLoading(false));

        loadDownloadedIds();
    };

    const fetchRecommendations = (allApps) => {
        setRecLoading(true);

        API.get('/api/apps/my-downloads')
            .then(res => {
                if (res.data.length === 0) {
                    setRecommendations([]);
                    setRecLoading(false);
                    return null;
                }
                const downloadedApps = res.data;
                const availableApps = allApps.map(a => a.name);
                return API.post('/api/ai/recommend', { downloadedApps, availableApps });
            })
            .then(res => {
                if (!res) return;
                const recNames = res.data.recommendedApps;
                const recApps = allApps.filter(a => recNames.includes(a.name));
                setRecommendations(recApps);
                setRecLoading(false);
            })
            .catch(() => setRecLoading(false));
    };

    useEffect(() => {
        loadApps(true);
    }, []);

    const handleSearch = (value) => {
        setSearch(value);
        applyFilters(value, category);
    };

    const handleCategory = (cat) => {
        setCategory(cat);
        applyFilters(search, cat);
    };

    const applyFilters = (searchVal, categoryVal) => {
        let result = apps;
        if (searchVal) {
            result = result.filter(app =>
                app.name.toLowerCase().includes(searchVal.toLowerCase())
            );
        }
        if (categoryVal !== 'All') {
            result = result.filter(app => app.category === categoryVal);
        }
        setFiltered(result);
    };

    const handleDownload = (appId, appName) => {
        API.get(`/api/apps/download/${appId}`, { responseType: 'blob' })
            .then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${appName}.apk`);
                document.body.appendChild(link);
                link.click();
                link.remove();

                // Only refresh app counts and downloaded IDs — no AI call
                loadApps(false);
            })
            .catch(() => alert('Download failed'));
    };

    const handleViewDetails = (id) => {
        navigate(`/app/${id}`);
    };

    const renderStars = (rating) => {
        return [1, 2, 3, 4, 5].map(i => (
            <span key={i} style={{ color: i <= rating ? '#FFD700' : '#ddd', fontSize: '14px' }}>★</span>
        ));
    };

    const AppCard = ({ app, isRecommended }) => {
        const isDownloaded = downloadedAppIds.includes(app.id);

        return (
            <div style={styles.card}>
                {isDownloaded ? (
                    <div style={{ ...styles.badge, background: '#43E97B' }}>✅ Downloaded</div>
                ) : isRecommended ? (
                    <div style={{ ...styles.badge, background: 'linear-gradient(135deg, #6C63FF, #FF6584)' }}>🤖 AI Pick</div>
                ) : null}
           <div style={styles.appIcon}>
    {app.name.charAt(0).toUpperCase()}
</div>
                <h3 style={styles.appName}>{app.name}</h3>
                <p style={styles.developer}>by {app.developerName}</p>
                <span style={styles.categoryBadge}>{app.category}</span>
                <p style={styles.description}>
                    {app.description?.substring(0, 80)}...
                </p>
                <div style={styles.stats}>
                    <div style={styles.rating}>
                        {renderStars(Math.round(app.averageRating))}
                        <span style={styles.ratingNum}>
                            {app.averageRating > 0 ? app.averageRating.toFixed(1) : 'New'}
                        </span>
                    </div>
                    <span style={styles.downloads}>⬇️ {app.totalDownloads}</span>
                </div>
                <div style={styles.cardActions}>
                    <button style={styles.detailsBtn} onClick={() => handleViewDetails(app.id)}>
                        Details
                    </button>
                    {isDownloaded ? (
                        <button style={styles.downloadedBtn} disabled>
                            ✅ Downloaded
                        </button>
                    ) : (
                        <button style={styles.downloadBtn} onClick={() => handleDownload(app.id, app.name)}>
                            ⬇️ Download
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const RecCard = ({ app }) => {
        const isDownloaded = downloadedAppIds.includes(app.id);
        return (
            <div style={styles.recCard}>
                {isDownloaded && (
                    <div style={{ ...styles.recBadge, background: '#43E97B' }}>✅</div>
                )}
               <div style={{ ...styles.appIcon, width: '48px', height: '48px', fontSize: '18px' }}>
    {app.name.charAt(0).toUpperCase()}
</div>
                <div style={styles.appName}>{app.name}</div>
                <div style={styles.developer}>by {app.developerName}</div>
                <span style={styles.categoryBadge}>{app.category}</span>
                <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                    <button
                        style={{ ...styles.detailsBtn, flex: 1, fontSize: '12px', padding: '6px' }}
                        onClick={() => handleViewDetails(app.id)}
                    >
                        Details
                    </button>
                    {isDownloaded ? (
                        <button style={{ ...styles.downloadedBtn, flex: 1, fontSize: '12px', padding: '6px' }} disabled>
                            ✅
                        </button>
                    ) : (
                        <button
                            style={{ ...styles.downloadBtn, flex: 1, fontSize: '12px', padding: '6px' }}
                            onClick={() => handleDownload(app.id, app.name)}
                        >
                            ⬇️
                        </button>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loadingText}>Loading apps...</div>
            </div>
        );
    }

    const categoryGroups = {};
    apps.forEach(app => {
        if (!categoryGroups[app.category]) categoryGroups[app.category] = [];
        categoryGroups[app.category].push(app);
    });

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>App Marketplace</h1>
                <p style={styles.subtitle}>Discover and download amazing apps</p>
            </div>

            {/* AI Recommendations Row */}
            <div style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>🤖 AI Recommendations</h2>
                    <span style={styles.sectionBadge}>Personalized for you</span>
                </div>
                {recLoading ? (
                    <div style={{ color: '#6C63FF', fontWeight: '600', padding: '10px 0' }}>
                        🤖 Analyzing your interests...
                    </div>
                ) : recommendations.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                        <div style={{ fontSize: '40px', marginBottom: '8px' }}>🤔</div>
                        <p style={{ fontWeight: '600', color: '#2D2D2D' }}>No interests found yet!</p>
                        <p style={{ fontSize: '13px' }}>Download some apps and we'll personalize recommendations for you.</p>
                    </div>
                ) : (
                    <div style={styles.horizontalScroll}>
                        {recommendations.map(app => (
                            <RecCard key={app.id} app={app} />
                        ))}
                    </div>
                )}
            </div>

            {/* Search */}
            <div style={styles.searchBar}>
                <span style={styles.searchIcon}>🔍</span>
                <input
                    type="text"
                    placeholder="Search apps..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={styles.searchInput}
                />
            </div>

            {/* Categories */}
            <div style={styles.categories}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        style={category === cat ? styles.catBtnActive : styles.catBtn}
                        onClick={() => handleCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

           

            {/* All Apps Grid */}
            <div style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>
                        {category === 'All' ? '📱 All Apps' : `📱 ${category}`}
                    </h2>
                    <span style={styles.sectionBadge}>{filtered.length} apps</span>
                </div>
                {filtered.length === 0 ? (
                    <div style={styles.empty}>
                        <div style={styles.emptyIcon}>📭</div>
                        <p>No apps found</p>
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {filtered.map(app => (
                            <AppCard
                                key={app.id}
                                app={app}
                                isRecommended={recommendations.some(r => r.id === app.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: { maxWidth: '1200px', margin: '0 auto' },
    header: { marginBottom: '24px' },
    title: { fontSize: '28px', fontWeight: '800', color: '#2D2D2D', margin: '0' },
    subtitle: { color: '#888', fontSize: '14px', marginTop: '4px' },
    section: { background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 20px rgba(108,99,255,0.08)', marginBottom: '24px' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
    sectionTitle: { fontSize: '18px', fontWeight: '700', color: '#2D2D2D', margin: '0' },
    sectionBadge: { fontSize: '12px', background: '#F0F2FF', color: '#6C63FF', padding: '4px 12px', borderRadius: '20px', fontWeight: '600' },
    seeAllBtn: { fontSize: '13px', color: '#6C63FF', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' },
    horizontalScroll: { display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' },
    recCard: { minWidth: '180px', maxWidth: '180px', background: '#F8F8FF', borderRadius: '14px', padding: '16px', position: 'relative', flexShrink: 0 },
    recBadge: { position: 'absolute', top: '8px', right: '8px', fontSize: '10px', color: '#fff', padding: '2px 8px', borderRadius: '20px', fontWeight: '600' },
    badge: { position: 'absolute', top: '12px', right: '12px', fontSize: '10px', color: '#fff', padding: '3px 10px', borderRadius: '20px', fontWeight: '600' },
    searchBar: { display: 'flex', alignItems: 'center', background: '#fff', borderRadius: '14px', padding: '12px 20px', boxShadow: '0 4px 20px rgba(108,99,255,0.08)', marginBottom: '20px' },
    searchIcon: { fontSize: '18px', marginRight: '12px' },
    searchInput: { border: 'none', outline: 'none', fontSize: '15px', width: '100%', background: 'transparent', color: '#2D2D2D' },
    categories: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' },
    catBtn: { padding: '8px 18px', borderRadius: '20px', border: '2px solid #E8E8FF', background: '#fff', color: '#666', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
    catBtnActive: { padding: '8px 18px', borderRadius: '20px', border: '2px solid #6C63FF', background: 'linear-gradient(135deg, #6C63FF, #FF6584)', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
    card: { background: '#F8F8FF', borderRadius: '16px', padding: '20px', position: 'relative' },
    appIcon: { width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg, #6C63FF, #FF6584)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '22px', marginBottom: '14px' },
    appName: { fontSize: '15px', fontWeight: '700', color: '#2D2D2D', margin: '0 0 4px' },
    developer: { fontSize: '12px', color: '#888', margin: '0 0 8px' },
    categoryBadge: { display: 'inline-block', background: '#F0F2FF', color: '#6C63FF', fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px', marginBottom: '8px' },
    description: { fontSize: '13px', color: '#666', lineHeight: '1.5', marginBottom: '12px' },
    stats: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' },
    rating: { display: 'flex', alignItems: 'center', gap: '4px' },
    ratingNum: { fontSize: '12px', color: '#888', marginLeft: '4px' },
    downloads: { fontSize: '12px', color: '#888' },
    cardActions: { display: 'flex', gap: '8px' },
    detailsBtn: { flex: 1, padding: '8px', borderRadius: '10px', border: '2px solid #6C63FF', background: 'transparent', color: '#6C63FF', fontWeight: '600', fontSize: '13px', cursor: 'pointer' },
    downloadBtn: { flex: 1, padding: '8px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #6C63FF, #FF6584)', color: '#fff', fontWeight: '600', fontSize: '13px', cursor: 'pointer' },
    downloadedBtn: { flex: 1, padding: '8px', borderRadius: '10px', border: 'none', background: '#E8FFF3', color: '#43E97B', fontWeight: '600', fontSize: '13px', cursor: 'not-allowed' },
    loadingContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' },
    loadingText: { fontSize: '18px', color: '#6C63FF', fontWeight: '600' },
    empty: { textAlign: 'center', padding: '60px', color: '#888' },
    emptyIcon: { fontSize: '48px', marginBottom: '16px' },
};

export default Marketplace;

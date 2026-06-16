import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';

const AppDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [app, setApp] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewForm, setReviewForm] = useState({ comment: '', rating: 5 });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
const [isDownloaded, setIsDownloaded] = useState(false);
    const loadApp = () => {
        API.get(`/api/apps/${id}`)
            .then(res => {
                setApp(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };
    const loadDownloadedStatus = () => {
    API.get('/api/apps/my-download-ids')
        .then(res => {
            setIsDownloaded(res.data.includes(parseInt(id)));
        })
        .catch(() => {});
};

    const loadReviews = () => {
        API.get(`/api/apps/reviews/app/${id}`)
            .then(res => setReviews(res.data))
            .catch(() => {});
    };

useEffect(() => {
    loadApp();
    loadReviews();
    loadDownloadedStatus();
}, [id]);
const handleDownload = () => {
    API.get(`/api/apps/download/${id}`, { responseType: 'blob' })
        .then(res => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${app.name}.apk`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            // Refresh downloaded status and app data
            loadApp();
            loadDownloadedStatus();
        })
        .catch(() => alert('Download failed'));
};

    const handleReviewSubmit = () => {
        if (!reviewForm.comment) return;
        setSubmitting(true);

        API.post('/api/apps/reviews/add', {
            appId: parseInt(id),
            comment: reviewForm.comment,
            rating: reviewForm.rating,
        })
            .then(() => {
                setMessage('Review submitted!');
                setReviewForm({ comment: '', rating: 5 });
                loadReviews();
                setSubmitting(false);
            })
            .catch(() => {
                setMessage('Failed to submit review');
                setSubmitting(false);
            });
    };

    const renderStars = (rating) => {
        return [1, 2, 3, 4, 5].map(i => (
            <span key={i} style={{ color: i <= rating ? '#FFD700' : '#ddd', fontSize: '18px' }}>★</span>
        ));
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loadingText}>Loading...</div>
            </div>
        );
    }

    if (!app) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loadingText}>App not found</div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <button style={styles.backBtn} onClick={() => navigate('/marketplace')}>
                ← Back to Marketplace
            </button>

            {/* App Header */}
            <div style={styles.appHeader}>
                <div style={styles.appIcon}>
                    {app.name.charAt(0).toUpperCase()}
                </div>
                <div style={styles.appInfo}>
                    <h1 style={styles.appName}>{app.name}</h1>
                    <p style={styles.developer}>by {app.developerName}</p>
                    <span style={styles.categoryBadge}>{app.category}</span>
                    <div style={styles.statsRow}>
                        <div style={styles.statItem}>
                            <span style={styles.statValue}>
                                {app.averageRating > 0 ? app.averageRating.toFixed(1) : 'New'}
                            </span>
                            <span style={styles.statLabel}>Rating</span>
                        </div>
                        <div style={styles.statDivider} />
                        <div style={styles.statItem}>
                            <span style={styles.statValue}>{app.totalDownloads}</span>
                            <span style={styles.statLabel}>Downloads</span>
                        </div>
                        <div style={styles.statDivider} />
                        <div style={styles.statItem}>
                            <span style={styles.statValue}>{reviews.length}</span>
                            <span style={styles.statLabel}>Reviews</span>
                        </div>
                    </div>
{isDownloaded ? (
    <button style={{ ...styles.downloadBtn, background: '#E8FFF3', color: '#43E97B', cursor: 'not-allowed' }} disabled>
        ✅ Already Downloaded
    </button>
) : (
    <button style={styles.downloadBtn} onClick={handleDownload}>
        ⬇️ Download App
    </button>
)}
                </div>
            </div>

            {/* Description */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>About</h2>
                <p style={styles.description}>{app.description}</p>
            </div>

            {/* Write Review */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Write a Review</h2>
                <div style={styles.reviewForm}>
                    <div style={styles.ratingPicker}>
                        <label style={styles.label}>Your Rating:</label>
                        <div style={styles.stars}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <span
                                    key={star}
                                    style={{
                                        fontSize: '28px',
                                        cursor: 'pointer',
                                        color: star <= reviewForm.rating ? '#FFD700' : '#ddd',
                                    }}
                                    onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>
                    <textarea
                        placeholder="Write your review here..."
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                        style={styles.textarea}
                        rows={4}
                    />
                    {message && <p style={styles.message}>{message}</p>}
                    <button
                        style={submitting ? styles.submitBtnDisabled : styles.submitBtn}
                        onClick={handleReviewSubmit}
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </div>
            </div>

            {/* Reviews */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Reviews ({reviews.length})</h2>
                {reviews.length === 0 ? (
                    <p style={styles.noReviews}>No reviews yet. Be the first!</p>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} style={styles.reviewCard}>
                            <div style={styles.reviewHeader}>
                                <div style={styles.reviewAvatar}>
                                    {review.userName?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <div style={styles.reviewUser}>{review.userName}</div>
                                    <div style={styles.reviewStars}>
                                        {renderStars(review.rating)}
                                    </div>
                                </div>
                                <div style={styles.sentimentBadge(review.sentiment)}>
                                    {review.sentiment}
                                </div>
                            </div>
                            <p style={styles.reviewComment}>{review.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '900px',
        margin: '0 auto',
    },
    backBtn: {
        background: 'none',
        border: 'none',
        color: '#6C63FF',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        marginBottom: '24px',
        padding: '0',
    },
    appHeader: {
        background: '#fff',
        borderRadius: '20px',
        padding: '32px',
        display: 'flex',
        gap: '24px',
        boxShadow: '0 4px 20px rgba(108,99,255,0.08)',
        marginBottom: '24px',
    },
    appIcon: {
        width: '100px',
        height: '100px',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: '800',
        fontSize: '40px',
        flexShrink: 0,
    },
    appInfo: {
        flex: 1,
    },
    appName: {
        fontSize: '24px',
        fontWeight: '800',
        color: '#2D2D2D',
        margin: '0 0 4px',
    },
    developer: {
        fontSize: '14px',
        color: '#888',
        margin: '0 0 10px',
    },
    categoryBadge: {
        display: 'inline-block',
        background: '#F0F2FF',
        color: '#6C63FF',
        fontSize: '12px',
        fontWeight: '600',
        padding: '4px 12px',
        borderRadius: '20px',
        marginBottom: '16px',
    },
    statsRow: {
        display: 'flex',
        gap: '24px',
        marginBottom: '20px',
        alignItems: 'center',
    },
    statItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    statValue: {
        fontSize: '20px',
        fontWeight: '800',
        color: '#2D2D2D',
    },
    statLabel: {
        fontSize: '12px',
        color: '#888',
    },
    statDivider: {
        width: '1px',
        height: '32px',
        background: '#eee',
    },
    downloadBtn: {
        padding: '12px 28px',
        background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        fontWeight: '700',
        fontSize: '15px',
        cursor: 'pointer',
    },
    section: {
        background: '#fff',
        borderRadius: '20px',
        padding: '28px',
        boxShadow: '0 4px 20px rgba(108,99,255,0.08)',
        marginBottom: '20px',
    },
    sectionTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#2D2D2D',
        marginBottom: '16px',
    },
    description: {
        fontSize: '14px',
        color: '#555',
        lineHeight: '1.7',
    },
    reviewForm: {},
    ratingPicker: {
        marginBottom: '16px',
    },
    label: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#555',
        marginBottom: '8px',
        display: 'block',
    },
    stars: {
        display: 'flex',
        gap: '4px',
    },
    textarea: {
        width: '100%',
        padding: '14px',
        borderRadius: '12px',
        border: '2px solid #E8E8FF',
        fontSize: '14px',
        color: '#2D2D2D',
        background: '#F8F8FF',
        resize: 'vertical',
        boxSizing: 'border-box',
        marginBottom: '12px',
        fontFamily: 'inherit',
    },
    message: {
        color: '#43E97B',
        fontSize: '13px',
        marginBottom: '8px',
        fontWeight: '600',
    },
    submitBtn: {
        padding: '12px 28px',
        background: 'linear-gradient(135deg, #43E97B, #6C63FF)',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        fontWeight: '700',
        fontSize: '14px',
        cursor: 'pointer',
    },
    submitBtnDisabled: {
        padding: '12px 28px',
        background: '#ccc',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        fontWeight: '700',
        fontSize: '14px',
        cursor: 'not-allowed',
    },
    noReviews: {
        color: '#888',
        fontSize: '14px',
        textAlign: 'center',
        padding: '20px',
    },
    reviewCard: {
        border: '1px solid #F0F2FF',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '12px',
    },
    reviewHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '8px',
    },
    reviewAvatar: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: '700',
        fontSize: '14px',
        flexShrink: 0,
    },
    reviewUser: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#2D2D2D',
    },
    reviewStars: {
        display: 'flex',
    },
    sentimentBadge: (sentiment) => ({
        marginLeft: 'auto',
        padding: '3px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '600',
        background: sentiment === 'POSITIVE' ? '#E8FFF3' :
                    sentiment === 'NEGATIVE' ? '#FFE8EC' : '#F0F2FF',
        color: sentiment === 'POSITIVE' ? '#43E97B' :
               sentiment === 'NEGATIVE' ? '#FF6584' : '#6C63FF',
    }),
    reviewComment: {
        fontSize: '13px',
        color: '#555',
        lineHeight: '1.6',
        margin: '0',
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
    },
    loadingText: {
        fontSize: '18px',
        color: '#6C63FF',
        fontWeight: '600',
    },
};

export default AppDetails;
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const categories = [
        {
            id: '2nd_year',
            title: '2nd Year Students',
            description: 'View and manage coding stats for second year students',
            icon: '📘',
            className: 'year-2',
            uploaded: user?.has_uploaded_2nd_year,
        },
        {
            id: '3rd_year',
            title: '3rd Year Students',
            description: 'View and manage coding stats for third year students',
            icon: '📗',
            className: 'year-3',
            uploaded: user?.has_uploaded_3rd_year,
        },
    ];

    return (
        <div className="page-container">
            <div className="dashboard-header">
                <h1>
                    Welcome back, <span>{user?.username}</span>
                </h1>
                <p>Track coding progress across platforms for your students</p>
            </div>

            <div className="category-grid">
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        className={`category-card ${cat.className}`}
                        onClick={() => navigate(`/category/${cat.id}`)}
                    >
                        <div className="category-icon">{cat.icon}</div>
                        <h2>{cat.title}</h2>
                        <p>{cat.description}</p>

                        <div className="category-status">
                            <span className={`status-dot ${cat.uploaded ? 'active' : 'inactive'}`} />
                            <span style={{ color: cat.uploaded ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
                                {cat.uploaded ? 'Data uploaded' : 'No data — click to upload'}
                            </span>
                        </div>

                        <div className="category-arrow">→</div>
                    </div>
                ))}
            </div>

            <div className="card" style={{ marginTop: '1rem' }}>
                <div className="card-header">
                    <h3 className="card-title">📊 Quick Overview</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>Platform</div>
                        <div style={{ fontSize: '1rem', fontWeight: '600' }}>🟡 LeetCode + 🟢 HackerRank</div>
                    </div>
                    <div style={{ padding: '1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>Tracked Skills</div>
                        <div style={{ fontSize: '1rem', fontWeight: '600' }}>Java · Python · C · SQL</div>
                    </div>
                    <div style={{ padding: '1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>Data Source</div>
                        <div style={{ fontSize: '1rem', fontWeight: '600' }}>📄 Excel Upload + 🌐 Web Scraping</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

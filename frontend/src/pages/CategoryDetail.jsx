import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DataTable from '../components/DataTable';
import FileUpload from '../components/FileUpload';

export default function CategoryDetail() {
    const { category } = useParams();
    const navigate = useNavigate();
    const { token, API_URL, refreshProfile } = useAuth();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0, studentName: '' });
    const [error, setError] = useState('');

    const categoryLabel = category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

    useEffect(() => {
        fetchStudents();
    }, [category]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/students/${category}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to fetch students');
            const data = await res.json();
            setStudents(data.students);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRefreshAll = async () => {
        if (!students.length) return;
        if (!window.confirm(`Fetching data from LeetCode and HackerRank for all ${students.length} students might take several minutes. Proceed?`)) return;

        setFetchLoading(true);
        setProgress({ current: 0, total: students.length, studentName: students[0].name });

        try {
            const updatedStudents = [...students];

            for (let i = 0; i < students.length; i++) {
                const student = students[i];
                setProgress(prev => ({ ...prev, current: i, studentName: student.name }));

                const res = await fetch(`${API_URL}/students/fetch-single/${student.id}`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.ok) {
                    const updated = await res.json();
                    updatedStudents[i] = updated;
                    setStudents([...updatedStudents]);
                }
            }
            setProgress(prev => ({ ...prev, current: students.length, studentName: 'Completed!' }));
            setTimeout(() => setFetchLoading(false), 1500);
        } catch (err) {
            alert('Error fetching data: ' + err.message);
            setFetchLoading(false);
        }
    };

    const handleRefreshSingle = async (studentId) => {
        setFetchLoading(true);
        try {
            const res = await fetch(`${API_URL}/students/fetch-single/${studentId}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Fetching failed');
            const updatedStudent = await res.json();
            setStudents(students.map(s => s.id === studentId ? updatedStudent : s));
        } catch (err) {
            alert('Error fetching data: ' + err.message);
        } finally {
            setFetchLoading(false);
        }
    };

    const handleExport = async (filters = {}) => {
        try {
            let urlStr = `${API_URL}/export/${category}?`;
            if (filters.min_lc) urlStr += `min_lc=${filters.min_lc}&`;
            if (filters.min_java) urlStr += `min_java=${filters.min_java}&`;
            if (filters.min_python) urlStr += `min_python=${filters.min_python}&`;
            if (filters.min_c) urlStr += `min_c=${filters.min_c}&`;
            if (filters.min_sql) urlStr += `min_sql=${filters.min_sql}&`;

            const res = await fetch(urlStr, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Export failed');

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${category}_data.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert('Error exporting data: ' + err.message);
        }
    };

    const handleDeleteAll = async () => {
        if (!window.confirm(`Are you sure you want to delete all data for ${categoryLabel}? This cannot be undone.`)) return;

        try {
            const res = await fetch(`${API_URL}/students/${category}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Delete failed');
            setStudents([]);
            await refreshProfile();
        } catch (err) {
            alert('Error deleting data: ' + err.message);
        }
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading-overlay">
                    <div className="spinner"></div>
                    <p>Loading students...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="dashboard-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate('/dashboard')}>
                        ← Back
                    </button>
                    <h1 style={{ margin: 0 }}>{categoryLabel} <span>Dashboard</span></h1>
                </div>
                <p>Analyze and manage coding performance stats</p>
            </div>

            {students.length === 0 ? (
                <div className="card">
                    <FileUpload
                        category={category}
                        onSuccess={() => {
                            fetchStudents();
                            refreshProfile();
                        }}
                    />
                </div>
            ) : (
                <div className="fade-in">
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                        <button className="btn btn-danger btn-sm" onClick={handleDeleteAll}>
                            🗑️ Clear Category Data
                        </button>
                    </div>
                    <DataTable
                        students={students}
                        loading={fetchLoading}
                        onRefreshAll={handleRefreshAll}
                        onRefreshSingle={handleRefreshSingle}
                        onExport={handleExport}
                    />
                </div>
            )}

            {/* Mesmerizing Progress Modal */}
            {fetchLoading && progress.total > 0 && (
                <div className="progress-modal-backdrop">
                    <div className="progress-card">
                        <div className="progress-title">Data Retrieval in Progress</div>
                        <p className="progress-subtitle">Fetching latest stats from coding platforms</p>

                        <div className="progress-visual">
                            <div className="progress-bar-container-large">
                                <div
                                    className="progress-bar-fill"
                                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                                ></div>
                            </div>
                            <div className="progress-stats">
                                <div className="progress-percent">
                                    {Math.round((progress.current / progress.total) * 100)}%
                                </div>
                                <div className="progress-count">
                                    {progress.current} / {progress.total} Students
                                </div>
                            </div>
                        </div>

                        <div className="current-student-card">
                            <div className="current-student-avatar">
                                {progress.current === progress.total ? '✅' : '🔍'}
                            </div>
                            <div className="current-student-info">
                                <h4>{progress.studentName}</h4>
                                <p className={progress.current === progress.total ? '' : 'loading-dots'}>
                                    {progress.current === progress.total ? 'All data points retrieved successfully' : 'Analyzing profiles'}
                                </p>
                            </div>
                        </div>

                        <p style={{ marginTop: '2rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Please do not close this window while the retrieval is active.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

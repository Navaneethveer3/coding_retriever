import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export default function FileUpload({ category, onSuccess }) {
    const { token, API_URL } = useAuth();
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileRef = useRef(null);

    const categoryLabel = category === '2nd_year' ? '2nd Year' : '3rd Year';

    const handleFile = async (file) => {
        if (!file) return;
        if (!file.name.match(/\.(xlsx|xls)$/i)) {
            setError('Please upload an Excel file (.xlsx or .xls)');
            return;
        }

        setUploading(true);
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${API_URL}/upload/${category}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Upload failed');

            setSuccess(data.message);
            if (onSuccess) onSuccess(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    return (
        <div className="upload-section">
            {error && <div className="alert alert-error">⚠️ {error}</div>}
            {success && <div className="alert alert-success">✅ {success}</div>}

            <div
                className={`upload-area ${dragging ? 'dragging' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileRef}
                    accept=".xlsx,.xls"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFile(e.target.files[0])}
                />

                {uploading ? (
                    <div className="loading-overlay">
                        <div className="spinner" />
                        <p className="loading-text">Uploading {categoryLabel} data...</p>
                    </div>
                ) : (
                    <>
                        <div className="upload-icon">📁</div>
                        <h3>Upload {categoryLabel} Excel Sheet</h3>
                        <p>Drag & drop your Excel file here, or click to browse</p>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Required columns: Name, Roll Number, Leetcode Profile URL, HackerRank URL
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

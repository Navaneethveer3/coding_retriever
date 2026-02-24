import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
    const { user, token, API_URL } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newAccountUser, setNewAccountUser] = useState('');
    const [newAccountPass, setNewAccountPass] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await fetch(`${API_URL}/profile/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Failed to change password');
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setCurrentPassword('');
            setNewPassword('');
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await fetch(`${API_URL}/auth/create-account`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ username: newAccountUser, password: newAccountPass }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Failed to create account');
            setMessage({ type: 'success', text: `Account '${newAccountUser}' created successfully!` });
            setNewAccountUser('');
            setNewAccountPass('');
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container profile-page">
            <div className="profile-header">
                <h1>Account <span>Settings</span></h1>
                <p>Manage your account security and application data</p>
            </div>

            {message.text && (
                <div className={`alert alert-${message.type === 'error' ? 'error' : 'success'}`}>
                    {message.text}
                </div>
            )}

            <div className="profile-section">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">🔐 Change Password</h3>
                    </div>
                    <form onSubmit={handleChangePassword}>
                        <div className="form-group">
                            <label className="form-label">Current Password</label>
                            <input
                                type="password"
                                className="form-input"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <input
                                type="password"
                                className="form-input"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button className="btn btn-primary" type="submit" disabled={loading}>
                            Update Password
                        </button>
                    </form>
                </div>
            </div>

            {user?.is_admin && (
                <div className="profile-section">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">👤 Administrative: Create New User</h3>
                        </div>
                        <form onSubmit={handleCreateAccount}>
                            <div className="form-group">
                                <label className="form-label">Username</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={newAccountUser}
                                    onChange={(e) => setNewAccountUser(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Initial Password</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    value={newAccountPass}
                                    onChange={(e) => setNewAccountPass(e.target.value)}
                                    required
                                />
                            </div>
                            <button className="btn btn-success" type="submit" disabled={loading}>
                                Create User Account
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

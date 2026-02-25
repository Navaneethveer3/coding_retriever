import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
    const { user, token, API_URL } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newAccountUser, setNewAccountUser] = useState('');
    const [newAccountPass, setNewAccountPass] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [allUsers, setAllUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [editUsername, setEditUsername] = useState('');
    const [editPassword, setEditPassword] = useState('');

    useEffect(() => {
        if (user?.is_admin) {
            fetchUsers();
        }
    }, [user]);

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API_URL}/admin/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setAllUsers(data);
            }
        } catch (err) {
            console.error('Failed to fetch users:', err);
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/users/${editingUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    username: editUsername,
                    password: editPassword || null
                }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || 'Update failed');
            }
            setMessage({ type: 'success', text: 'User updated successfully' });
            setEditingUser(null);
            setEditUsername('');
            setEditPassword('');
            fetchUsers();
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this account?')) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setMessage({ type: 'success', text: 'User deleted' });
                fetchUsers();
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

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
                <>
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

                    <div className="profile-section">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">🛡️ Manage User Accounts</h3>
                            </div>
                            <div className="table-wrapper" style={{ marginTop: '1rem' }}>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Username</th>
                                            <th>Status</th>
                                            <th>Uploads (1/2/3/4)</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allUsers.map(u => (
                                            <tr key={u.id}>
                                                <td>
                                                    {editingUser?.id === u.id ? (
                                                        <input
                                                            className="form-input sm"
                                                            value={editUsername}
                                                            onChange={(e) => setEditUsername(e.target.value)}
                                                        />
                                                    ) : (
                                                        <strong>{u.username}</strong>
                                                    )}
                                                </td>
                                                <td>
                                                    <span className={`table-badge ${u.is_admin ? 'admin' : ''}`}>
                                                        {u.is_admin ? '🛡️ Admin' : '👤 User'}
                                                    </span>
                                                </td>
                                                <td>
                                                    {u.has_uploaded_1st_year ? '✅' : '❌'} / {u.has_uploaded_2nd_year ? '✅' : '❌'} / {u.has_uploaded_3rd_year ? '✅' : '❌'} / {u.has_uploaded_4th_year ? '✅' : '❌'}
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        {editingUser?.id === u.id ? (
                                                            <>
                                                                <button className="btn btn-success btn-sm" onClick={handleUpdateUser}>Save</button>
                                                                <button className="btn btn-secondary btn-sm" onClick={() => setEditingUser(null)}>Cancel</button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    className="btn btn-secondary btn-sm"
                                                                    onClick={() => {
                                                                        setEditingUser(u);
                                                                        setEditUsername(u.username);
                                                                        setEditPassword('');
                                                                    }}
                                                                >
                                                                    Edit
                                                                </button>
                                                                {!u.is_admin && (
                                                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(u.id)}>Delete</button>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {editingUser && (
                                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)' }}>
                                    <h4 style={{ marginBottom: '1rem' }}>Reset Password for {editingUser.username}</h4>
                                    <div className="form-group">
                                        <input
                                            type="password"
                                            className="form-input"
                                            placeholder="Leave blank to keep current password"
                                            value={editPassword}
                                            onChange={(e) => setEditPassword(e.target.value)}
                                        />
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        Updating the username or password will take effect immediately.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

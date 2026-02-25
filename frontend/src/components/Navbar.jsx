import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-brand" onClick={() => navigate('/dashboard')}>
                <div className="navbar-logo">CR</div>
                <span className="navbar-title">Coding Retriever</span>
            </div>

            <div className="navbar-nav">
                <div className="nav-user">
                    <span>{user?.username}</span>
                    {user?.is_admin && <span className="nav-user-badge">Admin</span>}
                </div>

                <button
                    className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                    onClick={() => navigate('/dashboard')}
                >
                    📊 Dashboard
                </button>

                <button
                    className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                    onClick={() => navigate('/profile')}
                >
                    ⚙️ Profile
                </button>

                <button className="nav-link logout" onClick={handleLogout}>
                    🚪 Logout
                </button>
            </div>
        </nav>
    );
}

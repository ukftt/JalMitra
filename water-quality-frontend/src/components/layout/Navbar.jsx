import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { official, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navLink = (to, label) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          active
            ? 'text-white bg-ink-700'
            : 'text-ink-700 hover:bg-ink-900/5'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-[1000] glass-panel border-b border-ink-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <circle cx="15" cy="15" r="14" fill="#0B2545" />
            <path
              d="M15 7c2.5 4 5 7.2 5 10.5a5 5 0 11-10 0C10 14.2 12.5 11 15 7z"
              fill="#3BBAB9"
            />
          </svg>
          <span className="font-display font-bold text-lg tracking-tightest text-ink-900 group-hover:text-signal-600 transition-colors">
            WATERWATCH
          </span>
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          {navLink('/', 'Map')}
          {navLink('/stats', 'Statistics')}
          {official && navLink('/dashboard', 'Dashboard')}
        </nav>

        <div className="flex items-center gap-3">
          {official ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right leading-tight">
                <p className="text-sm font-semibold text-ink-900">{official.name}</p>
                <p className="text-xs text-ink-600">{official.ward}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="text-sm font-medium text-ink-700 border border-ink-900/15 rounded-md px-3 py-1.5 hover:bg-ink-900/5 transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm font-semibold text-white bg-ink-900 rounded-md px-4 py-2 hover:bg-ink-800 transition-colors shadow-gauge"
            >
              Official Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
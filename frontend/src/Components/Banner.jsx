import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import './Banner.css';

const Banner = () => {
  const { userType, userName, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const showHackathonTitle = location.pathname.startsWith('/ideas/');
  let hackathonName = '';
  if (showHackathonTitle) {
    const pathParts = location.pathname.split('/');
    if (pathParts.length > 2) {
      hackathonName = decodeURIComponent(pathParts[2]);
    }
  }

  return (
    <nav className="banner-style">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <div className="built-by-text me-2">
            <small>built</small>
            <br />
            <small>by</small>
          </div>
          <a className="navbar-brand fw-bold text-uppercase" href="https://the-equity-ai.org" target="_blank" rel="noopener noreferrer">
            EquityAI Inc.
          </a>
        </div>
        {showHackathonTitle && (
          <div className="hackathon-title">
            Welcome to {hackathonName || "Your Hackathon"}!
          </div>
        )}
        <div className="d-flex align-items-center">
          {userType === 'Host' && (
            <Link className="nav-link" to="/approval-requests">
              Approval Requests
            </Link>
          )}
          <Link className="nav-link" to={`/ideas/${hackathonName || "Your Hackathon"}`}>
            Community
          </Link>
          {userType === 'Participant' && (
            <Link className="nav-link" to="/my-ideas">
              My Ideas
            </Link>
          )}
          {userType === 'Sponsor' && (
            <Link className="nav-link" to="/sponsors">
              Sponsors
            </Link>
          )}
          <Link className="nav-link" to="/help">
            Help
          </Link>
          <div className="user-menu">
            <button className="btn btn-link nav-link" type="button" onClick={() => setDropdownOpen(!isDropdownOpen)}>
              {userName}
            </button>
            {isDropdownOpen && (
              <div className="dropdown-menu-banner">
                <button className="dropdown-item-banner" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Banner;
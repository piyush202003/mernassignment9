import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  console.log(user);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/">
          <i className="bi bi-person-badge me-2"></i>VisitorPass
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto align-items-center">
            {isAuthenticated ? (
              <>
                {user.role === 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/dashboard">
                      Admin
                    </Link>
                  </li>
                )}
                {user.role === 'security' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/security/dashboard">
                      Security
                    </Link>
                  </li>
                )}
                {user.role === 'employee' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/employee/dashboard">
                      My Dashboard
                    </Link>
                  </li>
                )}
                {user.role === 'visitor' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard">
                      My Dashboard
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    My Profile
                  </Link>
                </li>

                <li className="nav-item mx-2 text-white small">
                  Hello, <span className="fw-semibold">{user.name}</span>
                </li>

                <li className="nav-item">
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-light btn-sm ms-2"
                  >
                    <i className="bi bi-box-arrow-right me-1"></i>Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

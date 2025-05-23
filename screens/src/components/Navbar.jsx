import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { FaUser, FaPenAlt, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import AuthModal from './AuthModal';
import "./Navbar.css";
import { useNavigate } from "react-router-dom";


const Navbar = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setShowAuthModal(false);
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    }
    setSearchQuery('');
    setSearchOpen(false);
  };


  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-brand">
          <Link to="/" className="logo">
            <span className="logo-icon">✍️</span> CreativeBlog
          </Link>

          <div className="mobile-menu-icons">
            <button
              className="search-icon-mobile"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <FaSearch />
            </button>
            <button
              className="menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="nav-primary">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/categories" onClick={() => setMobileMenuOpen(false)}>Categories</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link to="/resources" onClick={() => setMobileMenuOpen(false)}>Resources</Link>
          </div>

          <div className="nav-secondary">
            <form
              className={`search-form ${searchOpen ? 'open' : ''}`}
              onSubmit={handleSearchSubmit}
            >
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-button">
                <FaSearch />
              </button>
            </form>

            {isAdmin ? (
              <Link to="/login" className="admin-btn" onClick={() => setMobileMenuOpen(false)}>
                <FaPenAlt /> Admin Panel
              </Link>
            ) : (
              <button
                className="login-btn"
                onClick={() => setShowAuthModal(true)}
              >
                <FaUser /> Admin Login
              </button>
            )}
          </div>
        </div>
      </div>

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLoginSuccess}
        />
      )}
    </nav>
  );
};

export default Navbar;
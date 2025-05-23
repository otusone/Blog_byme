import React, { useState } from 'react';
import { FaUser, FaLock, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from './slices/authSlice';
import { baseurl } from '../baseUrl/baseUrl';
import toast from "react-hot-toast"


const AuthModal = ({ onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${baseurl}/auth/login`, {
        username,
        password,
      });

      const { token, _id, role, username: userName } = response.data;
      const userPayload = { _id, role, username: userName };

      dispatch(login({ user: userPayload, token }))

      console.log('Login successful, token stored');
      if (onLogin) onLogin();

      navigate('/admin');
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message;
      setError(errMsg);
      console.log('Login failed:', errMsg);
    }
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="close-modal" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="auth-header">
          <h2>Admin Login</h2>
          <p>Access the blogging dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><FaUser /> Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label><FaLock /> Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-submit-btn">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;

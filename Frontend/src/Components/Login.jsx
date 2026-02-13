// src/Components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthLayout from './AuthLayout';

function Login() {
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  // Input field change handler
  const handleChange = ({ target }) => {
    setFormData((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  // Submit login form using Axios
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', formData);
      const token = response.data?.token;

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('lastLogin', new Date().toLocaleString());
        navigate('/profile');
      } else {
        setError('❌ Invalid response from server. Token missing.');
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError('❌ ' + err.response.data.message);
      } else {
        setError('❌ Login failed. Please try again later.');
      }
    }
  };

  return (
    <AuthLayout title="Welcome Back" toggleText="Don't have an account?" toggleLink="/register" toggleAction="Register">
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            name="email"
            type="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            name="password"
            type="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="d-grid">
          <button type="submit" className="btn btn-campus">Login</button>
        </div>
      </form>
    </AuthLayout>
  );
}

export default Login;
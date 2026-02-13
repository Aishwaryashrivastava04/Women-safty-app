// src/Components/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthLayout from './AuthLayout';

function Register() {
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        contact: ''
    });

    const navigate = useNavigate();

    // Handles input field changes
    const handleChange = ({ target }) => {
        setFormData((prev) => ({
            ...prev,
            [target.name]: target.value,
        }));
    };

    // Handles form submission
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post(
                'http://localhost:5000/api/users/register',
                formData
            );

            if (response.data?.success) {
                alert('✅ Registered successfully! Please login.');
                navigate('/login');
            } else {
                setError('❌ ' + (response.data?.message || 'Registration failed.'));
            }
        } catch (err) {
            if (err.response?.data?.message) {
                setError('❌ ' + err.response.data.message);
            } else {
                setError('❌ Something went wrong. Please try again.');
            }
        }
    };

    return (
        <AuthLayout
            title="Create Account"
            toggleText="Already registered?"
            toggleLink="/login"
            toggleAction="Login"
        >
            <form onSubmit={handleRegister}>
                <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                        name="name"
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

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

                <div className="mb-3">
                    <label className="form-label">Contact</label>
                    <input
                        name="contact"
                        type="tel"
                        className="form-control"
                        value={formData.contact}
                        onChange={handleChange}
                        required
                    />
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <div className="d-grid">
                    <button type="submit" className="btn btn-campus">Register</button>
                </div>
            </form>
        </AuthLayout>
    );
}

export default Register;
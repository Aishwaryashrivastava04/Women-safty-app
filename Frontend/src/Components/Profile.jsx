import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Card, Button } from 'react-bootstrap';
import {
    PencilSquare,
    GraphUp,
    BoxArrowRight,
    CloudUpload,
    TelephoneFill,
    Whatsapp,
    Trash,
    LockFill,
    Instagram,
    Twitter
} from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Profile.css';

function Profile() {
    const navigate = useNavigate();
    const [name, setName] = useState('User');
    const [email, setEmail] = useState('user@example.com');
    const [image, setImage] = useState('');
    const [locationCount, setLocationCount] = useState(0);
    const [lastLogin, setLastLogin] = useState('');
    const [key, setKey] = useState('edit');

    // ✅ Updated logic: Load user profile using token
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/api/users/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.success) {
                    const user = response.data.user;
                    setName(user.name || 'User');
                    setEmail(user.email || 'user@example.com');
                    if (user.image) setImage(user.image);
                    localStorage.setItem('user', JSON.stringify(user));
                }
            } catch (error) {
                console.error('❌ Failed to fetch profile:', error);
                navigate('/login');
            }
        };

        fetchProfile();

        const history = JSON.parse(localStorage.getItem('locationHistory')) || [];
        setLocationCount(history.length);
        setLastLogin(localStorage.getItem('lastLogin') || 'Not available');
    }, [navigate]);

    const handleSave = () => {
        localStorage.setItem('username', name);
        alert("Profile updated!");
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                localStorage.setItem('profileImage', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('profileImage');
        localStorage.removeItem('user');
        localStorage.removeItem('identity');
        localStorage.removeItem('displayName');
        navigate('/login');
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure? This will remove all saved data.')) {
            localStorage.clear();
            navigate('/register');
        }
    };

    const handleChangePassword = () => {
        alert('No backend connected. Password change feature is currently unavailable.');
    };

    return (
        <div className="container py-5">
            <Card className="shadow-lg mb-4 text-center animate__animated animate__fadeIn">
                <Card.Body>
                    <img
                        src={image || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                        alt="Profile"
                        width="100"
                        className="rounded-circle mb-3"
                    />
                    <h4 className="fw-bold">{name}</h4>
                    <p className="text-muted">{email}</p>
                    <p><small>🕓 Last Login: {lastLogin}</small></p>
                </Card.Body>
            </Card>

            <Tabs
                id="profile-tabs"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3 justify-content-center"
                fill
            >
                <Tab eventKey="edit" title="📝 Edit Profile">
                    <Card className="shadow-sm p-4">
                        <div className="text-center mb-3">
                            <label className="btn btn-outline-secondary">
                                <CloudUpload className="me-1" /> Change Picture
                                <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                            </label>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <Button variant="primary" onClick={handleSave}>Save</Button>
                    </Card>
                </Tab>

                <Tab eventKey="activity" title="📊 Activity">
                    <Card className="shadow-sm p-4">
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item"><TelephoneFill className="me-2" /> Called 112 - 2 days ago</li>
                            <li className="list-group-item"><Whatsapp className="me-2" /> Shared location - 3 days ago</li>
                            <li className="list-group-item">📝 Sent feedback - 1 week ago</li>
                        </ul>
                    </Card>
                </Tab>

                <Tab eventKey="stats" title="📍 Track Me Stats">
                    <Card className="shadow-sm p-4">
                        <p>You have saved <strong>{locationCount}</strong> location points.</p>
                        {locationCount > 0 && (
                            <Button variant="outline-secondary" onClick={() => navigate('/trackme')}>View on Map</Button>
                        )}
                    </Card>
                </Tab>

                <Tab eventKey="account" title="⚙️ Account">
                    <Card className="shadow-sm p-4 text-center">
                        <Button variant="warning" className="me-2" onClick={handleChangePassword}>
                            <LockFill className="me-1" /> Change Password
                        </Button>
                        <Button variant="danger" className="me-2" onClick={handleDeleteAccount}>
                            <Trash className="me-1" /> Delete Account
                        </Button>
                        <Button variant="secondary" onClick={handleLogout}>
                            <BoxArrowRight className="me-1" /> Logout
                        </Button>
                    </Card>
                </Tab>

                <Tab eventKey="social" title="🌐 Social Links">
                    <Card className="shadow-sm p-4 text-center">
                        <a href="https://wa.me" className="btn btn-success me-2" target="_blank" rel="noreferrer">
                            <Whatsapp className="me-1" /> WhatsApp
                        </a>
                        <a href="https://twitter.com" className="btn btn-primary me-2" target="_blank" rel="noreferrer">
                            <Twitter className="me-1" /> Twitter
                        </a>
                        <a href="https://instagram.com" className="btn btn-danger" target="_blank" rel="noreferrer">
                            <Instagram className="me-1" /> Instagram
                        </a>
                    </Card>
                </Tab>
            </Tabs>
        </div>
    );
}

export default Profile;
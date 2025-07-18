import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value;

    if (isLogin) {
      // LOGIN
      try {
        const res = await fetch('http://127.0.0.1:3000/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!data.success) {
          setError("❌ " + data.message);
        } else {
          localStorage.setItem('token', data.token);
          setError('');
          navigate('/dashboard');
        }
      } catch (err) {
        setError('❌ Login failed. Please try again.');
      }
    } else {
      // REGISTER
      const name = form.name.value.trim();
      const contact = form.contact.value.trim();

      try {
        const res = await fetch('http://127.0.0.1:3000/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, contact }),
        });

        const data = await res.json();

        if (!data.success) {
          setError("❌ " + data.message);
        } else {
          setError('');
          alert("✅ Registered successfully! Please login.");
          setIsLogin(true);
          form.reset();
        }
      } catch (err) {
        setError('❌ Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card shadow" style={{ width: '600px', padding: '30px' }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4">
            {isLogin ? 'Login' : 'Register'}
          </h2>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input name="name" type="text" className="form-control" required />
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input name="email" type="email" className="form-control" required />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input name="password" type="password" className="form-control" required />
            </div>

            {!isLogin && (
              <div className="mb-3">
                <label className="form-label">Contact</label>
                <input name="contact" type="tel" className="form-control" required />
              </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                {isLogin ? 'Login' : 'Register'}
              </button>
            </div>
          </form>

          <div className="text-center mt-3">
            {isLogin ? (
              <p>
                Don't have an ID?{' '}
                <button className="btn btn-link p-0" onClick={() => setIsLogin(false)}>
                  Register
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button className="btn btn-link p-0" onClick={() => setIsLogin(true)}>
                  Login
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
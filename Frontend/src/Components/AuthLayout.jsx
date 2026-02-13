// src/Components/AuthLayout.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function AuthLayout({ title, children, toggleText, toggleLink, toggleAction }) {
    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <style>{`
        .card-campus {
          border-radius: 16px;
          border: none;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .btn-campus {
          background-color: #6a0dad;
          border: none;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
        }
        .btn-campus:hover {
          background-color: #8a2be2;
        }
        .link-campus {
          color: #6a0dad;
          font-weight: 500;
        }
        .link-campus:hover {
          color: #8a2be2;
        }
      `}</style>

            <div className="card card-campus p-4" style={{ width: '100%', maxWidth: '500px' }}>
                <div className="card-body">
                    <h2 className="card-title text-center mb-4 text-dark">{title}</h2>
                    {children}
                    <div className="text-center mt-3">
                        <p>
                            {toggleText}{' '}
                            <Link className="btn btn-link link-campus p-0" to={toggleLink}>
                                {toggleAction}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthLayout;
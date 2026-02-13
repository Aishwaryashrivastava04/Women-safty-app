import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { motion } from 'framer-motion';
import aboutImg from '../assets/women_safety_banner.svg'; // You can replace with your own image

function About() {
  return (
    <div className="container py-5">
      <motion.div 
        className="bg-light shadow p-5 rounded"
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
      >
        <h2 className="fw-bold mb-4 text-danger text-center">🔎 About the App</h2>
        <p className="lead text-secondary text-center mb-4">
          <strong>Women Safety App</strong> is designed to protect and empower users through smart safety features.
        </p>

        <div className="row align-items-center">
          {/* Features List */}
          <div className="col-md-6">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">🆘 SOS alert with location sharing</li>
              <li className="list-group-item">📩 Emergency SMS to trusted contacts</li>
              <li className="list-group-item">📍 Live location history with reverse geocoding</li>
              <li className="list-group-item">📞 National helpline integration</li>
              <li className="list-group-item">🧾 Feedback and profile management</li>
            </ul>
            <p className="text-muted mt-3">
              Our mission is to create a safer world through technology. We focus on <strong>privacy</strong>,
              <strong> security</strong>, and <strong>speed</strong> when it matters most.
            </p>
          </div>

          {/* Right Banner Image */}
          <div className="col-md-6 text-center">
            <img 
              src={aboutImg} 
              alt="Women Safety Illustration" 
              className="img-fluid rounded mt-4 mt-md-0"
              style={{ maxHeight: '300px' }}
            />
          </div>
        </div>

        {/* Testimonial or Quote Section */}
        <motion.div 
          className="mt-5 border-top pt-4 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <blockquote className="blockquote text-secondary">
            <p>"Safety is not just a right — it’s a necessity. Technology bridges the gap."</p>
            <footer className="blockquote-footer">Empowerment Initiative Team</footer>
          </blockquote>
        </motion.div>

        {/* Back Button */}
        <div className="text-center mt-4">
          <button className="btn btn-outline-danger px-4" onClick={() => window.history.back()}>
            ⬅ Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default About;
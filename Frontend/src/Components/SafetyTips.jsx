import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function SafetyTips() {
  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-danger">🔒 Women Safety Tips</h2>
        <p className="text-muted">
          Learning personal safety tips empowers individuals to take an active role in their safety and well-being. While the responsibility of preventing violence lies with society, these tips may help reduce personal risks.
        </p>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <ul className="list-group list-group-flush">
            <li className="list-group-item py-3">
              <strong>🧠 Trust Your Intuition:</strong> Listen to your gut. If something feels off, remove yourself from the situation.
            </li>
            <li className="list-group-item py-3">
              <strong>👀 Be Aware of Your Surroundings:</strong> Avoid distractions like phones in unfamiliar or isolated places.
            </li>
            <li className="list-group-item py-3">
              <strong>🤝 Develop a Safety Network:</strong> Stay connected with trusted friends, family, or coworkers.
            </li>
            <li className="list-group-item py-3">
              <strong>🥋 Learn Self-Defense Techniques:</strong> Consider taking self-defense classes to increase confidence and protection.
            </li>
            <li className="list-group-item py-3">
              <strong>📱 Use Safety Apps or Devices:</strong> Use personal safety apps or carry legal tools like alarms or pepper spray.
            </li>
            <li className="list-group-item py-3">
              <strong>🚶‍♀️ Plan Safe Transportation:</strong> Walk in well-lit, populated areas and avoid isolated shortcuts.
            </li>
            <li className="list-group-item py-3">
              <strong>🔐 Secure Your Personal Information:</strong> Be cautious online. Avoid sharing personal data with strangers.
            </li>
            <li className="list-group-item py-3">
              <strong>🚫 Assertiveness and Boundaries:</strong> Don’t hesitate to say no. Set firm boundaries and trust your comfort.
            </li>
            <li className="list-group-item py-3">
              <strong>📚 Educate Yourself on Resources:</strong> Know local helplines, emergency services, and support organizations.
            </li>
          </ul>

          <p className="mt-4 text-secondary text-center">
            🛡️ Your safety is your right. Stay informed, stay connected, and never hesitate to seek help. 💪
          </p>
        </div>
      </div>
    </div>
  );
}

export default SafetyTips;
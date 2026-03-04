import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Contacts() {
  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem('emergencyContacts');
    return saved ? JSON.parse(saved) : [];
  });

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteIndex, setDeleteIndex] = useState(null);
  const deleteModalRef = useRef(null);
  const navigate = useNavigate();

  const isValidPhone = (phone) => /^[0-9]{10}$/.test(phone);

  const isDuplicate = (name, phone) => {
    return contacts.some(
      (c) =>
        c.name.toLowerCase() === name.toLowerCase() || c.phone === phone
    );
  };

  const handleAddContact = (e) => {
    e.preventDefault();

    if (!isValidPhone(phone)) {
      setError('Phone number must be 10 digits.');
      setSuccess('');
      return;
    }

    if (isDuplicate(name, phone)) {
      setError('This contact already exists.');
      setSuccess('');
      return;
    }

    const updated = [...contacts, { name, phone, priority }]
      .sort((a, b) => {
        const order = { High: 1, Medium: 2, Low: 3 };
        return order[a.priority] - order[b.priority];
      });

    setContacts(updated);
    localStorage.setItem('emergencyContacts', JSON.stringify(updated));

    setName('');
    setPhone('');
    setError('');
    setSuccess('Contact added successfully!');
    setTimeout(() => setSuccess(''), 2500);
  };

  const showDeleteModal = (index) => {
    setDeleteIndex(index);
    const modal = new window.bootstrap.Modal(deleteModalRef.current);
    modal.show();
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      const updated = contacts.filter((_, i) => i !== deleteIndex);
      setContacts(updated);
      localStorage.setItem('emergencyContacts', JSON.stringify(updated));
      setDeleteIndex(null);

      const modal = window.bootstrap.Modal.getInstance(deleteModalRef.current);
      if (modal) modal.hide();
    }
  };

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg,#eef2ff,#fdf2f8)',
        padding: '40px 20px',
        fontFamily: 'Inter, system-ui'
      }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* HEADER */}
        <div
          style={{
            background: 'linear-gradient(135deg,#5B2EFF,#7C5CFF)',
            color: 'white',
            padding: '24px',
            borderRadius: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 15px 40px rgba(91,46,255,0.3)'
          }}
        >
          <h2 style={{ margin: 0 }}>📇 Smart Emergency Contacts</h2>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '8px 14px',
              borderRadius: '10px',
              cursor: 'pointer'
            }}
          >
            ← Back
          </button>
        </div>

        {/* ADD FORM */}
        <div
          style={{
            background: 'white',
            padding: '25px',
            borderRadius: '20px',
            marginTop: '25px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
          }}
        >
          <form onSubmit={handleAddContact}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Name"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
                style={{ flex: 1, padding: 10, borderRadius: 10 }}
              />
              <input
                type="tel"
                placeholder="Phone (10 digits)"
                value={phone}
                required
                onChange={(e) => setPhone(e.target.value)}
                style={{ flex: 1, padding: 10, borderRadius: 10 }}
              />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{ padding: 10, borderRadius: 10 }}
              >
                <option value="High">🔴 High</option>
                <option value="Medium">🟡 Medium</option>
                <option value="Low">🟢 Low</option>
              </select>
              <button
                type="submit"
                style={{
                  padding: '10px 18px',
                  background: '#5B2EFF',
                  color: 'white',
                  border: 'none',
                  borderRadius: 10
                }}
              >
                ➕ Add
              </button>
            </div>
          </form>

          {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
          {success && <p style={{ color: 'green', marginTop: 10 }}>{success}</p>}
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="🔍 Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: 12,
            borderRadius: 12,
            marginTop: 20
          }}
        />

        {contacts.length < 3 && (
          <div
            style={{
              background: '#FEF3C7',
              padding: '12px 16px',
              borderRadius: '14px',
              marginTop: 20,
              fontWeight: 600,
              color: '#92400E'
            }}
          >
            🤖 AI Suggestion: You should add at least 3 emergency contacts for better safety coverage.
          </div>
        )}

        {/* LIST */}
        <div
          style={{
            background: 'white',
            marginTop: 20,
            borderRadius: 20,
            padding: 20,
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
          }}
        >
          {filteredContacts.length === 0 ? (
            <p>No contacts found.</p>
          ) : (
            filteredContacts.map((contact, index) => (
              <div
                key={index}
                style={{
                  padding: 12,
                  borderRadius: 12,
                  background: '#EEF2FF',
                  marginBottom: 10,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <strong>{contact.name}</strong>
                  <div style={{ fontSize: 13 }}>{contact.phone}</div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>
                    {contact.priority === 'High' && '🔴 High Priority'}
                    {contact.priority === 'Medium' && '🟡 Medium Priority'}
                    {contact.priority === 'Low' && '🟢 Low Priority'}
                  </div>
                </div>
                <button
                  onClick={() => showDeleteModal(index)}
                  style={{
                    background: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    padding: '6px 10px'
                  }}
                >
                  ❌ Delete
                </button>
              </div>
            ))
          )}
        </div>

        {/* DELETE MODAL */}
        <div
          className="modal fade"
          tabIndex="-1"
          ref={deleteModalRef}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this contact?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Contacts;
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Contacts() {
  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem('emergencyContacts');
    return saved ? JSON.parse(saved) : [];
  });

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
  const deleteModalRef = useRef(null);
  const navigate = useNavigate();

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const isDuplicate = (name, phone) => {
    return contacts.some(
      (c, i) =>
        i !== editingIndex &&
        (c.name.toLowerCase() === name.toLowerCase() || c.phone === phone)
    );
  };

  const isValidPhone = (phone) => /^[0-9]{10}$/.test(phone);

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

    const newContact = { name, phone };
    const updatedContacts = [...contacts, newContact].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    setContacts(updatedContacts);
    localStorage.setItem('emergencyContacts', JSON.stringify(updatedContacts));
    setName('');
    setPhone('');
    setError('');
    setSuccess('Contact added successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const showDeleteModal = (index) => {
    setDeleteIndex(index);
    const modal = new bootstrap.Modal(deleteModalRef.current);
    modal.show();
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      const updated = [...contacts];
      updated.splice(deleteIndex, 1);
      setContacts(updated);
      localStorage.setItem('emergencyContacts', JSON.stringify(updated));
      setDeleteIndex(null);

      const modal = bootstrap.Modal.getInstance(deleteModalRef.current);
      if (modal) modal.hide();
    }
  };

  const startEdit = (index) => {
    setEditingIndex(index);
    setEditedName(contacts[index].name);
    setEditedPhone(contacts[index].phone);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditedName('');
    setEditedPhone('');
  };

  const saveEdit = (index) => {
    if (!isValidPhone(editedPhone)) {
      setError('Phone number must be 10 digits.');
      return;
    }

    if (isDuplicate(editedName, editedPhone)) {
      setError('Duplicate name or phone.');
      return;
    }

    const updated = [...contacts];
    updated[index] = { name: editedName, phone: editedPhone };
    setContacts(updated);
    localStorage.setItem('emergencyContacts', JSON.stringify(updated));
    cancelEdit();
    setError('');
    setSuccess('Contact updated!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(contacts, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.download = 'emergency_contacts.json';
    link.href = url;
    link.click();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          setContacts(imported);
          localStorage.setItem('emergencyContacts', JSON.stringify(imported));
          setSuccess('Contacts imported successfully!');
          setTimeout(() => setSuccess(''), 3000);
        } else {
          setError('Invalid file format.');
        }
      } catch {
        setError('Failed to parse JSON.');
      }
    };
    reader.readAsText(file);
  };

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-4">
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate('/dashboard')}
        >
          ⬅ Back to Dashboard
        </button>
        <div>
          <button className="btn btn-outline-success me-2" onClick={handleExport}>
            ⬇️ Export
          </button>
          <label className="btn btn-outline-primary mb-0">
            ⬆️ Import
            <input
              type="file"
              accept=".json"
              hidden
              onChange={handleImport}
            />
          </label>
        </div>
      </div>

      <h1 className="mb-4 text-center">📇 Emergency Contacts</h1>

      <form onSubmit={handleAddContact} className="row g-3 mb-3">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="col-md-5">
          <input
            type="tel"
            className="form-control"
            placeholder="Phone Number"
            value={phone}
            required
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="col-md-2 d-grid">
          <button type="submit" className="btn btn-primary">
            ➕ Add
          </button>
        </div>
      </form>

      {/* Alerts */}
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Search Bar */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="🔍 Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Contact List */}
      <div className="card">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">Saved Contacts</h5>
        </div>
        <ul className="list-group list-group-flush">
          {filteredContacts.length === 0 ? (
            <li className="list-group-item text-muted">No contacts found.</li>
          ) : (
            filteredContacts.map((contact, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {editingIndex === index ? (
                  <div className="w-100 d-flex flex-column flex-md-row gap-2">
                    <input
                      type="text"
                      className="form-control"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control"
                      value={editedPhone}
                      onChange={(e) => setEditedPhone(e.target.value)}
                    />
                    <div className="d-flex gap-1">
                      <button className="btn btn-success btn-sm" onClick={() => saveEdit(index)}>
                        💾 Save
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <strong>{contact.name}</strong> - {contact.phone}
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-warning btn-sm" onClick={() => startEdit(index)}>
                        ✏️ Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => showDeleteModal(index)}>
                        ❌ Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Delete Modal */}
      <div
        className="modal fade"
        tabIndex="-1"
        ref={deleteModalRef}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Deletion</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this contact?</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contacts;
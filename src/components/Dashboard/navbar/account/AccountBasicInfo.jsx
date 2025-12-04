import React, { useState, useRef } from 'react';
import './AccountBasicInfo.css';

const initialUser = {
  photo: '',
  name: 'Priya Sharma',
  email: 'priya.sharma@example.com',
  mobile: '+919876543210',
  role: 'Learner'
};

const roles = ['Learner', 'Teacher'];

export default function AccountBasicInfo() {
  const [user, setUser] = useState(initialUser);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(user);
  const [photoPreview, setPhotoPreview] = useState(user.photo);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef();

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setForm(user);
      setPhotoPreview(user.photo);
      setErrors({});
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (name === 'email') validateEmail(value);
    if (name === 'mobile') validateMobile(value);
  };

  const validateEmail = email => {
    const valid = /^[^@]+@[^@]+\.[^@]+$/.test(email);
    setErrors(err => ({ ...err, email: valid ? '' : 'Invalid email address' }));
    return valid;
  };

  const validateMobile = mobile => {
    if (!mobile) {
      setErrors(err => ({ ...err, mobile: '' }));
      return true;
    }
    const valid = /^\+?[0-9]{8,15}$/.test(mobile);
    setErrors(err => ({ ...err, mobile: valid ? '' : 'Invalid mobile number' }));
    return valid;
  };

  const handlePhotoChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setPhotoPreview(ev.target.result);
      reader.readAsDataURL(file);
      setForm(f => ({ ...f, photo: file }));
    }
  };

  const handleEdit = () => {
    toggleEditMode();
  };

  const handleCancel = () => {
    toggleEditMode();
  };

  const handleSave = e => {
    e.preventDefault();
    const validEmail = validateEmail(form.email);
    const validMobile = validateMobile(form.mobile);
    if (!form.name.trim()) {
      setErrors(err => ({ ...err, name: 'Name is required' }));
      return;
    }
    if (!validEmail || !validMobile) return;
    const updated = {
      ...form,
      photo: typeof form.photo === 'string' ? form.photo : photoPreview
    };
    setUser(updated);
    setEditMode(false);
    setErrors({});
  };

  const FallbackAvatar = (
    <svg width="130" height="130" viewBox="0 0 80 80" aria-hidden="true">
      <circle cx="40" cy="40" r="38" fill="#e0e7ef" stroke="#b0b8c1" strokeWidth="2"/>
      <circle cx="40" cy="34" r="16" fill="#b0b8c1"/>
      <ellipse cx="40" cy="62" rx="20" ry="12" fill="#b0b8c1"/>
    </svg>
  );

  return (
    <section className="account-card" aria-label="Basic User Information">
      <div className="account-card__avatar-col">
        <div
          className="account-card__avatar"
          tabIndex={0}
          aria-label="Profile photo"
          onClick={() => editMode && fileInputRef.current.click()}
          style={{ cursor: editMode ? 'pointer' : 'default' }}
        >
          {photoPreview
            ? <img src={photoPreview} alt="User avatar" className="account-card__avatar-img" />
            : FallbackAvatar}
          {editMode && (
            <button
              type="button"
              className="account-card__photo-btn"
              onClick={() => fileInputRef.current.click()}
              aria-label="Change photo"
            >
              &#128247; Change photo
            </button>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handlePhotoChange}
            tabIndex={-1}
            aria-hidden="true"
          />
        </div>
      </div>
      <form className="account-card__info-col" onSubmit={handleSave} aria-label="User info form">
        <div className="account-card__row">
          <label htmlFor="name" className="account-card__label">Full Name</label>
          {editMode ? (
            <input
              id="name"
              name="name"
              type="text"
              className="account-card__input"
              value={form.name}
              onChange={handleChange}
              required
              aria-required="true"
              aria-invalid={!!errors.name}
              autoFocus
            />
          ) : (
            <span className="account-card__value">{user.name}</span>
          )}
          {errors.name && <span className="account-card__error">{errors.name}</span>}
        </div>
        <div className="account-card__row">
          <label htmlFor="email" className="account-card__label">Email Address</label>
          {editMode ? (
            <input
              id="email"
              name="email"
              type="email"
              className="account-card__input"
              value={form.email}
              onChange={handleChange}
              required
              aria-required="true"
              aria-invalid={!!errors.email}
            />
          ) : (
            <span className="account-card__value">{user.email}</span>
          )}
          {errors.email && <span className="account-card__error">{errors.email}</span>}
        </div>
        <div className="account-card__row">
          <label htmlFor="mobile" className="account-card__label">Mobile Number</label>
          {editMode ? (
            <input
              id="mobile"
              name="mobile"
              type="tel"
              className="account-card__input"
              value={form.mobile}
              onChange={handleChange}
              pattern="^\+?[0-9]{8,15}$"
              aria-invalid={!!errors.mobile}
              placeholder="e.g. +919876543210"
            />
          ) : (
            <span className="account-card__value">{user.mobile || <span className="account-card__muted">Not provided</span>}</span>
          )}
          {errors.mobile && <span className="account-card__error">{errors.mobile}</span>}
        </div>
        <div className="account-card__row">
          <label htmlFor="role" className="account-card__label">Role</label>
          {editMode ? (
            <select
              id="role"
              name="role"
              className="account-card__input"
              value={form.role}
              onChange={handleChange}
              aria-readonly="false"
            >
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          ) : (
            <span className="account-card__value">{user.role}</span>
          )}
        </div>
        <div className="account-card__actions">
          {editMode ? (
            <>
              <button type="submit" className="account-card__btn account-card__btn--save" aria-label="Save changes">
                &#10003; Save
              </button>
              <button type="button" className="account-card__btn account-card__btn--cancel" onClick={handleCancel} aria-label="Cancel edit">
                &#10005; Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              className="account-card__btn account-card__btn--edit"
              onClick={handleEdit}
              aria-label="Edit info"
            >
              &#9998; Edit
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

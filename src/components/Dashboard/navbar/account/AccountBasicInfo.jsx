import React, { useState, useRef, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../context/AuthContext';
import axios from 'axios';
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
  const navigate = useNavigate();
  const { user: authUser, setState } = useContext(AuthContext);
  
  // Ensure all properties have default values to prevent undefined input values
  const createUserObject = (data) => ({
    photo: data?.photo || '',
    name: data?.name || 'User',
    email: data?.email || 'user@example.com',
    mobile: data?.phone || data?.mobile || '',
    role: data?.role || 'Learner'
  });

  const initialUserData = createUserObject(authUser);
  
  const [user, setUser] = useState(initialUserData);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(initialUserData);
  const [photoPreview, setPhotoPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  // Load saved photo from localStorage on component mount
  useEffect(() => {
    const savedPhoto = localStorage.getItem(`user_photo_${initialUserData.email}`);
    if (savedPhoto) {
      setPhotoPreview(savedPhoto);
      setUser(prev => ({ ...prev, photo: savedPhoto }));
      setFormData(prev => ({ ...prev, photo: savedPhoto }));
    }
  }, [initialUserData.email]);

  const handleEdit = () => {
    setEditMode(true);
    // Ensure all values are strings to prevent undefined inputs
    setFormData({
      photo: user.photo || '',
      name: user.name || '',
      email: user.email || '',
      mobile: user.mobile || '',
      role: user.role || 'Learner'
    });
    setPhotoPreview(user.photo || '');
    setErrors({});
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData(user);
    setPhotoPreview('');
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value || '' // Ensure value is never undefined, default to empty string
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target.result);
        setFormData(prev => ({ ...prev, photo: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) newErrors.email = 'Invalid email';
    if (formData.mobile && !/^\+?[0-9]{8,15}$/.test(formData.mobile)) newErrors.mobile = 'Invalid phone';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Send update to backend
      const res = await axios.put('http://localhost:5000/profile', 
        {
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          role: formData.role
        }, 
        { withCredentials: true }
      );
      
      // Update local user state with response
      const updatedUser = res.data.user;
      setUser({
        photo: user.photo,
        name: updatedUser.name || formData.name,
        email: updatedUser.email || formData.email,
        mobile: updatedUser.phone || formData.mobile, // Backend returns 'phone', not 'mobile'
        role: formData.role
      });
      
      setFormData({
        photo: user.photo,
        name: updatedUser.name || formData.name,
        email: updatedUser.email || formData.email,
        mobile: updatedUser.phone || formData.mobile,
        role: formData.role
      });

      // Save photo to localStorage if it was changed
      if (photoPreview && photoPreview.startsWith('data:')) {
        localStorage.setItem(`user_photo_${updatedUser.email}`, photoPreview);
      }
      
      setEditMode(false);
      setErrors({});
      console.log('Profile updated successfully:', updatedUser);
    } catch (err) {
      console.error('Save error:', err);
      const errorMsg = err.response?.data?.message || 'Failed to save changes';
      setErrors({ general: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });
      setState({ authenticated: false, user: null, loading: false });
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      // Still navigate to login even if logout endpoint fails
      setState({ authenticated: false, user: null, loading: false });
      navigate('/login');
    }
  };

  const FallbackAvatar = null; // Avatar removed

  return (
    <section className="account-card" aria-label="Basic User Information">
      <form className="account-card__info-col" onSubmit={handleSave} aria-label="User info form">
        <div className="account-card__row">
          <label htmlFor="name" className="account-card__label">Full Name</label>
          {editMode ? (
            <input
              id="name"
              name="name"
              type="text"
              className="account-card__input"
              value={formData.name}
              onChange={handleInputChange}
              required
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
              value={formData.email}
              onChange={handleInputChange}
              required
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
              value={formData.mobile}
              onChange={handleInputChange}
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
              value={formData.role}
              onChange={handleInputChange}
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
              <button
                type="button"
                className="account-card__btn account-card__btn--save"
                onClick={handleSave}
                disabled={loading}
                aria-label="Save changes"
              >
                &#10003; Save
              </button>
              <button
                type="button"
                className="account-card__btn account-card__btn--cancel"
                onClick={handleCancel}
                disabled={loading}
                aria-label="Cancel edit"
              >
                &#10005; Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="account-card__btn account-card__btn--edit"
                onClick={handleEdit}
                aria-label="Edit info"
              >
                &#9998; Edit
              </button>
              <button
                type="button"
                className="account-card__btn account-card__btn--logout"
                onClick={handleLogout}
                aria-label="Logout"
              >
                &#128682; Logout
              </button>
            </>
          )}
        </div>
      </form>
    </section>
  );
}

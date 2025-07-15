import React, { useState } from 'react';
// CBT REGISTER STUDENTT PAGE
const StudentRegister = ({ onRegister }) => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    className: '',
    photo: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value
    });
  };

  const handleCapturePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      canvas.toBlob((blob) => {
        setForm(prev => ({ ...prev, photo: new File([blob], 'photo.jpg', { type: 'image/jpeg' }) }));
        stream.getTracks().forEach(track => track.stop());
      });
    } catch (error) {
      alert('Camera access denied or not available.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister && onRegister(form); // Backend integration hook
  };

  return (
    <div className="container my-4">
      <h3>Register New Student</h3>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Full Name</label>
          <input type="text" name="fullName" className="form-control" onChange={handleChange} required />
        </div>

        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input type="email" name="email" className="form-control" onChange={handleChange} required />
        </div>

        <div className="col-md-6">
          <label className="form-label">Phone</label>
          <input type="tel" name="phone" className="form-control" onChange={handleChange} required />
        </div>

        <div className="col-md-3">
          <label className="form-label">Gender</label>
          <select name="gender" className="form-select" onChange={handleChange} required>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">Class</label>
          <input type="text" name="className" className="form-control" onChange={handleChange} required />
        </div>

        <div className="col-md-6">
          <label className="form-label">Photo</label>
          <input type="file" name="photo" accept="image/*" className="form-control mb-2" onChange={handleChange} />
          <button type="button" className="btn btn-outline-secondary w-100" onClick={handleCapturePhoto}>
            <i className="fas fa-camera me-2"></i>Take Photo with Camera
          </button>
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary w-100">Register Student</button>
        </div>
      </form>
    </div>
  ); 
};

export default StudentRegister; 

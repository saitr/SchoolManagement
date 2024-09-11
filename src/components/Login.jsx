import React, { useState } from 'react';
import axiosInstance from '../API';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('login/', formData);

      const { access, refresh, role, is_superuser, first_name, email, teacher_id, message,user_id } = response.data;

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('role', role);
      localStorage.setItem('is_superuser', is_superuser);
      localStorage.setItem('first_name', first_name);
      localStorage.setItem('email', email);
      if (role === 'teacher') {
        localStorage.setItem('teacher_id', user_id);
      }

      setSuccessMessage(message);

      // Redirecting to designated pages based on the roles
      if (is_superuser) {
        navigate('/role'); 
      } else {
        switch (role) {
          case 'admin':
            navigate('/teacher');
            break;
          case 'teacher':
            navigate('/');
            break;
          default:
            navigate('/'); 
            break;
        }
      }

    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || 'Invalid login credentials');
      } else {
        setErrorMessage('Network error, please try again later.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm border-primary">
            <div className="card-header bg-primary text-white text-center">
              <h4>Login</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
              </form>
              
              {successMessage && (
                <div className="alert alert-success mt-3" role="alert">
                  {successMessage}
                </div>
              )}
              
              {errorMessage && (
                <div className="alert alert-danger mt-3" role="alert">
                  {errorMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

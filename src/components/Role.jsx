import React, { useEffect, useState } from 'react';
import axiosInstance from '../API'; 
import { useNavigate } from 'react-router-dom'; 

function Role() {
  const [roles, setRoles] = useState([]);  
  const [newRole, setNewRole] = useState(''); 
  const [responseMessage, setResponseMessage] = useState(null); 
  const [errorMessage, setErrorMessage] = useState(null); 
  const [loading, setLoading] = useState(true);  
  const [showModal, setShowModal] = useState(false);  
  const navigate = useNavigate();  


  const fetchRoles = async () => {
    try {
      const response = await axiosInstance.get('role/'); 
      setRoles(response.data.results); 
      setLoading(false);  
    } catch (error) {
      setErrorMessage('Error fetching roles');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage(null);
    setErrorMessage(null);
    
    try {
      const response = await axiosInstance.post('role/', { name: newRole });  
      setResponseMessage(response.data.message); 
      setNewRole(''); 
      fetchRoles();  
      handleClose(); 
    } catch (error) {
      setErrorMessage('Error creating role');
    }
  };

  const handleRoleClick = (roleName) => {
    switch(roleName.toLowerCase()) {
      case 'admin':
        navigate('/admin');  
        break;
      case 'teacher':
        navigate('/teacher');
        break;
      case 'student':
        navigate('/');  
        break;
      default:
        navigate('/'); 
    }
  };

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  useEffect(() => {
    fetchRoles(); 
  }, []);

  return (
    <div className="role-container container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow-sm">
            <div className="card-header bg-secondary text-white">
              <h4 className="text-center">Manage Roles</h4>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border text-secondary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <>
                  <h5 className="mb-4">Active Roles</h5>
                  <div className="row">
                    {roles.map((role, index) => (
                      <div 
                        key={index} 
                        className="col-md-4 mb-3"
                        onClick={() => handleRoleClick(role.name)}  
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="card h-100 shadow-sm">
                          <div className="card-body">
                            <h5 className="card-title text-center">{role.name}</h5>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="btn btn-primary" onClick={handleShow}>
                    Create New Role
                  </button>

                  {responseMessage && (
                    <div className="alert alert-success mt-3" role="alert">
                      {responseMessage}
                    </div>
                  )}
                  {errorMessage && (
                    <div className="alert alert-danger mt-3" role="alert">
                      {errorMessage}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <div className="custom-modal-header">
              <h5>Create New Role</h5>
              <button className="close-button" onClick={handleClose}>×</button>
            </div>
            <div className="custom-modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    id="newRole"
                    className="form-control"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="Enter role name"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Add Role
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Role;

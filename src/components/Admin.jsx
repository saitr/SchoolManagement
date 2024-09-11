import React, { useEffect, useState } from 'react';
import axiosInstance from '../API';  

function Admin() {
  const [admins, setAdmins] = useState([]);  
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  // Fetch admins from API
  const fetchAdmins = async () => {
    try {
      const response = await axiosInstance.get('admin/'); 
      setAdmins(response.data.results); 
      setLoading(false); 
    } catch (error) {
      setError('Error fetching admins');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();  
  }, []);

  return (
    <div className="admin-container container mt-5">
      <h2 className="text-center mb-4">Admins List</h2>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : (
        <div className="row">
          {admins.map((admin, index) => (
            <div key={index} className="col-md-6 col-lg-4 mb-4">
              <div className="admin-card shadow-sm p-3 bg-white rounded">
                <h5 className="admin-name">{admin.first_name+" "+admin.last_name}</h5>
                <p className="admin-email">{admin.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Admin;

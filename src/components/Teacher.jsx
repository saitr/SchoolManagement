import React, { useEffect, useState } from 'react';
import axiosInstance from '../API'; 

function Teacher() {
  const [teachers, setTeachers] = useState([]);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);  

  const fetchTeachers = async () => {
    try {
      const response = await axiosInstance.get('teacher/'); 
      setTeachers(response.data.results);  
      setLoading(false);  
    } catch (error) {
      setError('Error fetching teachers');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();  
  }, []);

  return (
    <div className="teacher-container container mt-5">
      <h2 className="text-center mb-4">Teachers List</h2>
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
          {teachers.map((teacher, index) => (
            <div key={index} className="col-md-6 col-lg-4 mb-4">
              <div className="teacher-card shadow-sm p-3 bg-white rounded">
                <h5 className="teacher-name">{teacher.first_name} {teacher.last_name}</h5>
                <p className="teacher-email">{teacher.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Teacher;

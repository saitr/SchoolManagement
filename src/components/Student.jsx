import React, { useEffect, useState } from 'react';
import axiosInstance from '../API';

function Student() {
  const [students, setStudents] = useState([]);  
  const [newStudent, setNewStudent] = useState({ student_first_name: '', student_last_name: '', student_class: '', student_email: '', student_address: '', teacher: '' });  // State to store new student input
  const [editingStudent, setEditingStudent] = useState(null);  
  const [teachers, setTeachers] = useState([]);  
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(true);  
  const [modalOpen, setModalOpen] = useState(false); 
  const [isTeacher, setIsTeacher] = useState(false);  
  const [teacherId, setTeacherId] = useState(null);  

  useEffect(() => {
    const role = localStorage.getItem('role');
    const id = localStorage.getItem('teacher_id');

    console.log('Role:', role);
    console.log('Teacher ID from local storage:', id);

    if (role === 'teacher') {
      setIsTeacher(true);
      setTeacherId(id);  

      fetchCurrentTeacher(id);

      fetchStudents(id);
    } else {
      setIsTeacher(false);
      fetchTeachers();

      fetchStudents(); 
    }

  }, []); 

  const fetchCurrentTeacher = async (teacherId) => {
    try {
      const response = await axiosInstance.get(`teacher/${teacherId}/`);
      console.log('Current Teacher Response:', response.data);
      if (response.data) {
        setTeachers([response.data.results]);  
      } else {
        setError('Error fetching teacher details');
      }
    } catch (error) {
      setError('Error fetching teacher details');
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axiosInstance.get('teacher/'); 
      console.log('Teachers Response:', response.data);
      if (response.data) {
        setTeachers(response.data.results);  
      } else {
        setError('Error fetching teachers list');
      }
    } catch (error) {
      setError('Error fetching teachers list');
    }
  };

  const fetchStudents = async (teacherId = null) => {
    try {
      const queryParams = teacherId ? `?teacher_id=${teacherId}` : '';
      console.log('Query Parameters****************', queryParams);  

      const response = await axiosInstance.get(`student/${queryParams}`);
      console.log('API Response#############', response.data); 

      if (response.data) {
        setStudents(response.data.results || []); 
      } else {
        setError('No students found in response');
      }
      setLoading(false);  
    } catch (error) {
      console.error('Error fetching students:', error); 
      setError('Error fetching students');
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('student/', newStudent); 
      if (response.data) {
        await fetchStudents(teacherId);  
        setModalOpen(false);  
        setNewStudent({ student_first_name: '', student_last_name: '', student_class: '', student_email: '', student_address: '', teacher: '' });  // Reset form
      } else {
        setError('Error creating student, no result returned');
      }
    } catch (error) {
      setError('Error creating student');
    }
  };

  
const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent && editingStudent.id) {
        const updatedStudent = {
          student_first_name: newStudent.student_first_name,
          student_last_name: newStudent.student_last_name,
          student_class: newStudent.student_class,
          student_email: newStudent.student_email,
          student_address: newStudent.student_address,
          teacher: newStudent.teacher,
        };
  
        const response = await axiosInstance.put(`student/${editingStudent.id}/`, updatedStudent);  
        if (response.data) {
          await fetchStudents(teacherId);  
          setModalOpen(false);  
          setEditingStudent(null);  
          setNewStudent({ student_first_name: '', student_last_name: '', student_class: '', student_email: '', student_address: '', teacher: '' }); 
        } else {
          setError('Error updating student, no result returned');
        }
      } else {
        setError('No student selected for update');
      }
    } catch (error) {
      setError('Error updating student');
    }
  };
  

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`student/${id}/`);  
      await fetchStudents(teacherId);  
    } catch (error) {
      setError('Error deleting student');
    }
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setNewStudent({
      student_first_name: student.student_first_name,
      student_last_name: student.student_last_name,
      student_class: student.student_class,
      student_email: student.student_email,
      student_address: student.student_address,
      teacher: student.teacher,
    });
    setModalOpen(true);
  };

  return (
    <div className="student-container container mt-5">
      <h2 className="text-center mb-4">Students List</h2>
      <button className="btn btn-primary mb-3" onClick={() => { setNewStudent({ student_first_name: '', student_last_name: '', student_class: '', student_email: '', student_address: '', teacher: '' }); setEditingStudent(null); setModalOpen(true); }}>Add New Student</button>

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
        <>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Class</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id}>
                    <td>{student.student_first_name}</td>
                    <td>{student.student_last_name}</td>
                    <td>{student.student_class}</td>
                    <td>{student.student_email}</td>
                    <td>{student.student_address}</td>
                    <td>
                      <button className="btn btn-warning me-2" onClick={() => openEditModal(student)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(student.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className={`modal fade ${modalOpen ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{editingStudent ? 'Edit Student' : 'Add New Student'}</h5>
              <button type="button" className="close" onClick={() => setModalOpen(false)}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form onSubmit={editingStudent ? handleUpdate : handleCreate}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="student_first_name">First Name</label>
                  <input type="text" className="form-control" id="student_first_name" value={newStudent.student_first_name} onChange={(e) => setNewStudent({ ...newStudent, student_first_name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label htmlFor="student_last_name">Last Name</label>
                  <input type="text" className="form-control" id="student_last_name" value={newStudent.student_last_name} onChange={(e) => setNewStudent({ ...newStudent, student_last_name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label htmlFor="student_class">Class</label>
                  <input type="text" className="form-control" id="student_class" value={newStudent.student_class} onChange={(e) => setNewStudent({ ...newStudent, student_class: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label htmlFor="student_email">Email</label>
                  <input type="email" className="form-control" id="student_email" value={newStudent.student_email} onChange={(e) => setNewStudent({ ...newStudent, student_email: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label htmlFor="student_address">Address</label>
                  <textarea className="form-control" id="student_address" value={newStudent.student_address} onChange={(e) => setNewStudent({ ...newStudent, student_address: e.target.value })} required />
                </div>
                {isTeacher || !isTeacher ? (
                  <div className="form-group">
                    <label htmlFor="teacher">Teacher</label>
                    <select className="form-control" id="teacher" value={newStudent.teacher} onChange={(e) => setNewStudent({ ...newStudent, teacher: e.target.value })}>
                      <option value="">Select Teacher</option>
                      {teachers.map(teacher => (
                        <option key={teacher.id} value={teacher.id}>{teacher.first_name}</option>
                      ))}
                    </select>
                  </div>
                ):null}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Close</button>
                <button type="submit" className="btn btn-primary">{editingStudent ? 'Update Student' : 'Add Student'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Student;

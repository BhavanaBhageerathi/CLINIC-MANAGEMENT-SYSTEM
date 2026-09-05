import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [courseFee, setCourseFee] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // =========================
  // GET ALL COURSES
  // =========================
  const fetchCourses = async () => {
    try {
      const response = await api.get("/courses/");

      // Sort courses by course ID
      const sortedCourses = [...response.data].sort(
        (a, b) => a.course_id - b.course_id
      );

      setCourses(sortedCourses);
    } catch (error) {
      console.error(error);
      setMessage("Unable to load courses.");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // =========================
  // ADD / EDIT COURSE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!courseName.trim() || !courseFee) {
      setMessage("Please enter course name and fee.");
      return;
    }

    try {
      if (editingId) {
        // PUT - Update complete course
        await api.put(`/courses/${editingId}`, {
          course_name: courseName,
          course_fee: courseFee,
        });

        setMessage("Course updated successfully.");
      } else {
        // POST - Add new course
        await api.post("/courses/", {
          course_name: courseName,
          course_fee: courseFee,
        });

        setMessage("Course added successfully.");
      }

      setCourseName("");
      setCourseFee("");
      setEditingId(null);

      await fetchCourses();
    } catch (error) {
      console.error(error);
      setMessage("Operation failed.");
    }
  };

  // =========================
  // EDIT COURSE
  // =========================
  const handleEdit = (course) => {
    setEditingId(course.course_id);
    setCourseName(course.course_name);
    setCourseFee(course.course_fee);
    setMessage("");
  };

  // =========================
  // PATCH - UPDATE ONLY FEE
  // =========================
  const handleUpdateFee = async (course) => {
    const newFee = window.prompt(
      "Enter new course fee:",
      course.course_fee
    );

    if (newFee === null) {
      return;
    }

    if (!newFee || Number(newFee) <= 0) {
      setMessage("Please enter a valid fee.");
      return;
    }

    try {
      await api.patch(`/courses/${course.course_id}/fee`, {
        course_fee: newFee,
      });

      setMessage("Course fee updated successfully.");

      await fetchCourses();
    } catch (error) {
      console.error(error);
      setMessage("Fee update failed.");
    }
  };

  // =========================
  // DELETE COURSE
  // =========================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    try {
      await api.delete(`/courses/${id}`);

      setMessage("Course deleted successfully.");

      await fetchCourses();
    } catch (error) {
      console.error(error);
      setMessage("Delete failed.");
    }
  };

  // =========================
  // CANCEL EDIT
  // =========================
  const handleCancel = () => {
    setEditingId(null);
    setCourseName("");
    setCourseFee("");
    setMessage("");
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <div className="dashboard">

      {/* HEADER */}
      <header className="dashboard-header">
        <div>
          <h1>Course Management System</h1>
          
        </div>

        <button onClick={handleLogout}>
          Logout
        </button>
      </header>


      {/* MAIN CONTENT */}
      <main className="dashboard-content">

        <div className="page-title">
          <h2>Course Management</h2>
          <p>Add, edit and manage your courses</p>
        </div>


        {/* ADD / EDIT COURSE */}
        <div className="course-form-card">

          <h3>
            {editingId ? "Edit Course" : "Add New Course"}
          </h3>

          <form onSubmit={handleSubmit}>

            <div className="form-row">

              <div className="form-group">
                <label>Course Name</label>

                <input
                  type="text"
                  placeholder="Enter course name"
                  value={courseName}
                  onChange={(e) =>
                    setCourseName(e.target.value)
                  }
                />
              </div>


              <div className="form-group">
                <label>Course Fee</label>

                <input
                  type="number"
                  placeholder="Enter course fee"
                  value={courseFee}
                  onChange={(e) =>
                    setCourseFee(e.target.value)
                  }
                />
              </div>

            </div>


            <div className="form-buttons">

              <button
                type="submit"
                className="primary-btn"
              >
                {editingId
                  ? "Update Course"
                  : "Add Course"}
              </button>


              {editingId && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>


          {message && (
            <p className="message">
              {message}
            </p>
          )}

        </div>


        {/* COURSE LIST */}
        <div className="courses-section">

          <div className="section-heading">
            <h3>Available Courses</h3>

            <span>
              {courses.length} Courses
            </span>
          </div>


          {courses.length === 0 ? (

            <div className="empty-state">
              <h3>No courses found</h3>
              <p>Add your first course above.</p>
            </div>

          ) : (

            <div className="course-grid">

              {courses.map((course) => (

                <div
                  className="course-card"
                  key={course.course_id}
                >

                  {/* COURSE NAME */}
                  <h3>
                    {course.course_name}
                  </h3>


                  {/* COURSE FEE */}
                  <div className="course-fee">
                    ₹{course.course_fee}
                  </div>


                  {/* ACTION BUTTONS */}
                  <div className="course-actions">

                    <button
                      className="edit-btn"
                      onClick={() =>
                        handleEdit(course)
                      }
                    >
                      Edit
                    </button>


                    <button
                      className="fee-btn"
                      onClick={() =>
                        handleUpdateFee(course)
                      }
                    >
                      Update Fee
                    </button>


                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(course.course_id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </main>

    </div>
  );
}

export default Dashboard;
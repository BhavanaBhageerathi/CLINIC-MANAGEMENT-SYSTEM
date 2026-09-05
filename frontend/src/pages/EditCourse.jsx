import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function EditCourse() {

  const { course_id } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  const course = location.state?.course;

  const [courseName, setCourseName] = useState(
    course?.course_name || ""
  );

  const [courseFee, setCourseFee] = useState(
    course?.course_fee || ""
  );

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    if (!courseName.trim()) {
      setError("Course name is required");
      return;
    }

    if (!courseFee.trim()) {
      setError("Course fee is required");
      return;
    }

    try {

      setLoading(true);

      await api.put(`/courses/${course_id}`, {
        course_name: courseName,
        course_fee: courseFee,
      });

      navigate("/dashboard");

    } catch (error) {

      setError(
        error.response?.data?.detail ||
        "Failed to update course"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="form-page">

        <div className="form-card">

          <h1>Edit Course</h1>

          <p>
            Update course information
          </p>

          <form onSubmit={handleSubmit}>

            <div className="input-group">

              <label>Course Name</label>

              <input
                type="text"
                value={courseName}
                onChange={(e) =>
                  setCourseName(e.target.value)
                }
              />

            </div>

            <div className="input-group">

              <label>Course Fee</label>

              <input
                type="text"
                value={courseFee}
                onChange={(e) =>
                  setCourseFee(e.target.value)
                }
              />

            </div>

            {error && (
              <p className="error-message">
                {error}
              </p>
            )}

            <div className="form-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-btn"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Course"}
              </button>

            </div>

          </form>

        </div>

      </div>
    </>
  );
}

export default EditCourse;
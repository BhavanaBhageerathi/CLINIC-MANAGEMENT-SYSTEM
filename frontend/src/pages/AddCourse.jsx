import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function AddCourse() {

  const [courseName, setCourseName] = useState("");
  const [courseFee, setCourseFee] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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

      await api.post("/courses/", {
        course_name: courseName,
        course_fee: courseFee,
      });

      navigate("/dashboard");

    } catch (error) {

      setError(
        error.response?.data?.detail ||
        "Failed to add course"
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

          <h1>Add Course</h1>

          <p>
            Create a new course
          </p>

          <form onSubmit={handleSubmit}>

            <div className="input-group">

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

            <div className="input-group">

              <label>Course Fee</label>

              <input
                type="text"
                placeholder="Example: 14000 INR"
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
                {loading ? "Adding..." : "Add Course"}
              </button>

            </div>

          </form>

        </div>

      </div>
    </>
  );
}

export default AddCourse;
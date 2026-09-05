import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        Course<span>Hub</span>
      </div>

      <div className="nav-links">
        <Link to="/dashboard">Courses</Link>
        <Link to="/add-course">Add Course</Link>

        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
import { Link } from "react-router-dom";

function DoctorNavbar() {

    return (
        <nav className="navbar navbar-dark bg-primary shadow-sm">

            <div className="container-fluid">

                <Link
                    to="/doctor"
                    className="navbar-brand fw-bold"
                >
                    <i className="bi bi-hospital me-2"></i>
                    Clinic Management System
                </Link>

                <div className="d-flex align-items-center">

                    <span className="text-white me-4">
                        <i className="bi bi-person-circle me-2"></i>
                        Dr. Bhavana
                    </span>

                    <button className="btn btn-light btn-sm">
                        <i className="bi bi-box-arrow-right me-1"></i>
                        Logout
                    </button>

                </div>

            </div>

        </nav>
    );
}

export default DoctorNavbar;
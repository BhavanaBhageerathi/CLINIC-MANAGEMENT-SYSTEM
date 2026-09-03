import { useNavigate } from "react-router-dom";
import DoctorNavbar from "../../components/doctor/DoctorNavbar";
import appointments from "../../data/doctor/appointments.json";

function TodayAppointments() {

    const navigate = useNavigate();

    // Temporary logged-in doctor
    const loggedInDoctorId = 101;

    // Temporary current date
    const today = "2026-09-01";

    // Get only this doctor's appointments for today
    const todayAppointments = appointments.filter(
        (appointment) =>
            appointment.doctorId === loggedInDoctorId &&
            appointment.date === today
    );

    return (
        <div className="min-vh-100 bg-light">

            {/* Navbar */}
            <DoctorNavbar />

            <div className="container py-5">

                {/* Page Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>
                        <h2 className="fw-bold mb-1">
                            Today's Appointments
                        </h2>

                        <p className="text-muted mb-0">
                            View your appointments scheduled for today.
                        </p>
                    </div>

                    <div>
                        <span className="badge bg-primary fs-6 px-3 py-2">
                            <i className="bi bi-calendar3 me-2"></i>
                            September 1, 2026
                        </span>
                    </div>

                </div>


                {/* Appointment Card */}
                <div className="card border-0 shadow-sm">

                    <div className="card-body p-0">

                        {todayAppointments.length === 0 ? (

                            /* No appointments */

                            <div className="text-center py-5">

                                <i className="bi bi-calendar-x display-4 text-muted"></i>

                                <h5 className="mt-3">
                                    No Appointments Today
                                </h5>

                                <p className="text-muted">
                                    You don't have any appointments scheduled for today.
                                </p>

                            </div>

                        ) : (

                            /* Appointment Table */

                            <div className="table-responsive">

                                <table className="table table-hover align-middle mb-0">

                                    <thead className="table-light">

                                        <tr>

                                            <th className="px-4">
                                                Token
                                            </th>

                                            <th>
                                                PID
                                            </th>

                                            <th>
                                                Time
                                            </th>

                                            <th>
                                                Patient Name
                                            </th>

                                            <th>
                                                Status
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {todayAppointments.map((appointment) => (

                                            <tr key={appointment.appointmentId}>

                                                <td className="px-4">

                                                    <span className="badge bg-primary rounded-pill">
                                                        {appointment.token}
                                                    </span>

                                                </td>

                                                <td>
                                                    <strong>
                                                        {appointment.patientId}
                                                    </strong>
                                                </td>

                                                <td>

                                                    <i className="bi bi-clock me-2 text-muted"></i>

                                                    {appointment.time}

                                                </td>

                                                <td>

                                                    <div className="d-flex align-items-center">

                                                        <div
                                                            className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                                            style={{
                                                                width: "40px",
                                                                height: "40px"
                                                            }}
                                                        >
                                                            {appointment.patientName.charAt(0)}
                                                        </div>

                                                        <div>

                                                            <div className="fw-semibold">
                                                                {appointment.patientName}
                                                            </div>

                                                            <small className="text-muted">
                                                                Patient ID: {appointment.patientId}
                                                            </small>

                                                        </div>

                                                    </div>

                                                </td>

                                                <td>

                                                    <span className="badge bg-success-subtle text-success px-3 py-2">
                                                        <i className="bi bi-check-circle me-1"></i>
                                                        {appointment.status}
                                                    </span>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>


                {/* Back Button */}

                <button
                    className="btn btn-outline-secondary mt-4"
                    onClick={() => navigate(-1)}
                >

                    <i className="bi bi-arrow-left me-2"></i>

                    Back

                </button>

            </div>

        </div>
    );
}

export default TodayAppointments;
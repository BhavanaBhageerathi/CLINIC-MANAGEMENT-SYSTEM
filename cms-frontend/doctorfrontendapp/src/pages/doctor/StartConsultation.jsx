import { useNavigate } from "react-router-dom";
import DoctorNavbar from "../../components/doctor/DoctorNavbar";
import appointments from "../../data/doctor/appointments.json";

function StartConsultation() {

    const navigate = useNavigate();

    // Temporary logged-in doctor
    const loggedInDoctorId = 101;

    // Temporary current date
    const today = "2026-09-01";

    // Get today's patients for this doctor
    const todayPatients = appointments.filter(
        (appointment) =>
            appointment.doctorId === loggedInDoctorId &&
            appointment.date === today &&
            appointment.status === "Booked"
    );

    // Select patient by token
    const handleSelectPatient = (appointment) => {

        navigate(`/doctor/patient/${appointment.appointmentId}`);

    };

    return (
        <div className="min-vh-100 bg-light">

            <DoctorNavbar />

            <div className="container py-5">

                {/* Header */}

                <div className="mb-4">

                    <h2 className="fw-bold mb-1">
                        Start Consultation
                    </h2>

                    <p className="text-muted mb-0">
                        Select a patient by token to start consultation.
                    </p>

                </div>


                {/* Appointment Card */}

                <div className="card border-0 shadow-sm">

                    <div className="card-header bg-white border-0 py-3">

                        <h5 className="mb-0 fw-semibold">

                            <i className="bi bi-people me-2 text-primary"></i>

                            Today's Patients

                        </h5>

                    </div>


                    <div className="card-body p-0">

                        {todayPatients.length === 0 ? (

                            <div className="text-center py-5">

                                <i className="bi bi-person-check display-4 text-muted"></i>

                                <h5 className="mt-3">
                                    No Patients Available
                                </h5>

                                <p className="text-muted">
                                    There are no booked patients available for consultation.
                                </p>

                            </div>

                        ) : (

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

                                            <th>
                                                Action
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {todayPatients.map((appointment) => (

                                            <tr key={appointment.appointmentId}>

                                                {/* Token */}

                                                <td className="px-4">

                                                    <span
                                                        className="badge bg-primary rounded-pill"
                                                        style={{
                                                            fontSize: "15px",
                                                            minWidth: "35px"
                                                        }}
                                                    >

                                                        {appointment.token}

                                                    </span>

                                                </td>


                                                {/* Patient ID */}

                                                <td>

                                                    <strong>
                                                        {appointment.patientId}
                                                    </strong>

                                                </td>


                                                {/* Time */}

                                                <td>

                                                    <i className="bi bi-clock me-2 text-muted"></i>

                                                    {appointment.time}

                                                </td>


                                                {/* Patient */}

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


                                                {/* Status */}

                                                <td>

                                                    <span className="badge bg-success-subtle text-success px-3 py-2">

                                                        <i className="bi bi-circle-fill me-1 small"></i>

                                                        {appointment.status}

                                                    </span>

                                                </td>


                                                {/* Action */}

                                                <td>

                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() =>
                                                            handleSelectPatient(appointment)
                                                        }
                                                    >

                                                        <i className="bi bi-play-circle me-2"></i>

                                                        Start Consultation

                                                    </button>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>


                {/* Back button */}

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

export default StartConsultation;
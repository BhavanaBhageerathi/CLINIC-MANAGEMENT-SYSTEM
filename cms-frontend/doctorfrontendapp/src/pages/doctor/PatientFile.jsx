
import { useNavigate, useParams } from "react-router-dom";
import appointments from "../../data/doctor/appointments.json";

function PatientFile() {

    const navigate = useNavigate();
    const { appointmentId } = useParams();

    // Find the selected appointment
    const appointment = appointments.find(
        (item) => item.appointmentId === Number(appointmentId)
    );

    // If appointment is not found
    if (!appointment) {
        return (
            <div className="min-vh-100 bg-light">

                <div className="container py-4">

                    {/* Back Arrow */}
                    <button
                        className="btn btn-link text-dark text-decoration-none px-0 mb-4"
                        onClick={() => navigate(-1)}
                    >
                        <i className="bi bi-arrow-left fs-5 me-2"></i>
                        Back
                    </button>

                    <div className="alert alert-danger shadow-sm">
                        Patient record not found.
                    </div>

                </div>

            </div>
        );
    }

    return (
        <div className="min-vh-100 bg-light">

            <div className="container py-4">

                {/* =========================
                    BACK BUTTON
                ========================== */}

                <button
                    className="btn btn-link text-dark text-decoration-none px-0 mb-3"
                    onClick={() => navigate(-1)}
                >
                    <i className="bi bi-arrow-left fs-5 me-2"></i>
                    Back
                </button>


                {/* =========================
                    PATIENT FILE
                ========================== */}

                <div className="card border-0 shadow-sm mb-4">

                    {/* Header */}

                    <div className="card-header bg-primary text-white py-3">

                        <h3 className="text-center mb-0 fw-bold">
                            <i className="bi bi-file-medical me-2"></i>
                            PATIENT FILE
                        </h3>

                    </div>


                    {/* Patient Details */}

                    <div className="card-body p-4">

                        <div className="row g-4">

                            {/* Patient ID */}

                            <div className="col-md-6">

                                <div className="text-muted small mb-1">
                                    Patient ID
                                </div>

                                <div className="fw-semibold fs-5">
                                    {appointment.patientId}
                                </div>

                            </div>


                            {/* Patient Name */}

                            <div className="col-md-6">

                                <div className="text-muted small mb-1">
                                    Patient Name
                                </div>

                                <div className="fw-semibold fs-5">
                                    {appointment.patientName}
                                </div>

                            </div>


                            {/* Age */}

                            <div className="col-md-6">

                                <div className="text-muted small mb-1">
                                    Age
                                </div>

                                <div className="fw-semibold">
                                    {appointment.age} Year(s)
                                </div>

                            </div>


                            {/* Gender */}

                            <div className="col-md-6">

                                <div className="text-muted small mb-1">
                                    Gender
                                </div>

                                <div className="fw-semibold">
                                    {appointment.gender}
                                </div>

                            </div>


                            {/* Blood Group */}

                            <div className="col-md-6">

                                <div className="text-muted small mb-1">
                                    Blood Group
                                </div>

                                <span className="badge bg-danger fs-6">
                                    {appointment.bloodGroup}
                                </span>

                            </div>


                            {/* Phone */}

                            <div className="col-md-6">

                                <div className="text-muted small mb-1">
                                    Phone
                                </div>

                                <div className="fw-semibold">
                                    <i className="bi bi-telephone me-2 text-primary"></i>
                                    {appointment.phone}
                                </div>

                            </div>


                            {/* Address */}

                            <div className="col-12">

                                <div className="text-muted small mb-1">
                                    Address
                                </div>

                                <div className="fw-semibold">
                                    <i className="bi bi-geo-alt me-2 text-primary"></i>
                                    {appointment.address}
                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =========================
                    CURRENT APPOINTMENT
                ========================== */}

                <div className="card border-0 shadow-sm mb-4">

                    <div className="card-header bg-white py-3">

                        <h5 className="mb-0 fw-bold">

                            <i className="bi bi-calendar-check text-primary me-2"></i>

                            Current Appointment

                        </h5>

                    </div>


                    <div className="card-body p-4">

                        <div className="row g-4">

                            {/* Appointment ID */}

                            <div className="col-md-6">

                                <div className="text-muted small mb-1">
                                    Appointment ID
                                </div>

                                <div className="fw-semibold">
                                    {appointment.appointmentId}
                                </div>

                            </div>


                            {/* Consult Date */}

                            <div className="col-md-6">

                                <div className="text-muted small mb-1">
                                    Consult Date
                                </div>

                                <div className="fw-semibold">

                                    <i className="bi bi-calendar3 me-2 text-primary"></i>

                                    {appointment.date}

                                </div>

                            </div>


                            {/* Token Number */}

                            <div className="col-md-6">

                                <div className="text-muted small mb-1">
                                    Token
                                </div>

                                <span className="badge bg-primary fs-6 px-3 py-2">

                                    {appointment.token}

                                </span>

                            </div>


                            {/* Time */}

                            <div className="col-md-6">

                                <div className="text-muted small mb-1">
                                    Time
                                </div>

                                <div className="fw-semibold">

                                    <i className="bi bi-clock me-2 text-primary"></i>

                                    {appointment.time}

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =========================
                    ACTION BUTTONS
                ========================== */}

                <div className="row g-3">

                    {/* View Medical History */}

                    <div className="col-md-6">

                        <button
                            className="btn btn-outline-primary w-100 py-3"
                            onClick={() =>
                                navigate(
                                    `/doctor/patient/${appointment.patientId}/history`
                                )
                            }
                        >

                            <i className="bi bi-clock-history fs-5 me-2"></i>

                            View Medical History

                        </button>

                    </div>


                    {/* Continue Consultation */}

                    <div className="col-md-6">

                        <button
                            className="btn btn-primary w-100 py-3"
                            onClick={() =>
                                navigate(
                                    `/doctor/consultation/${appointment.appointmentId}`
                                )
                            }
                        >

                            <i className="bi bi-clipboard2-pulse fs-5 me-2"></i>

                            Continue to Consultation

                            <i className="bi bi-arrow-right ms-2"></i>

                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default PatientFile;




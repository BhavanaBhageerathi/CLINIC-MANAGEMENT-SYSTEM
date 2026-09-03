
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import medicalHistory from "../../data/doctor/medicalHistory.json";
import appointments from "../../data/doctor/appointments.json";

function MedicalHistory() {

    const navigate = useNavigate();
    const { patientId } = useParams();

    const [selectedConsultation, setSelectedConsultation] = useState(null);

    // Find patient from appointment data
    const patient = appointments.find(
        (item) => item.patientId === Number(patientId)
    );

    // Get consultations belonging to this patient
    const patientHistory = medicalHistory.filter(
        (item) => item.patientId === Number(patientId)
    );

    return (
        <div className="min-vh-100 bg-light">

            <div className="container py-4">

                {/* Back Button */}

                <button
                    className="btn btn-link text-dark text-decoration-none px-0 mb-3"
                    onClick={() => navigate(-1)}
                >
                    <i className="bi bi-arrow-left fs-5 me-2"></i>
                    Back
                </button>


                {/* Page Header */}

                <div className="card border-0 shadow-sm mb-4">

                    <div className="card-header bg-primary text-white py-3">

                        <h3 className="text-center mb-0 fw-bold">

                            <i className="bi bi-clock-history me-2"></i>

                            PATIENT MEDICAL HISTORY

                        </h3>

                    </div>


                    {/* Patient Information */}

                    <div className="card-body">

                        {patient && (

                            <div className="row g-3">

                                <div className="col-md-4">

                                    <span className="text-muted small">
                                        Patient ID
                                    </span>

                                    <div className="fw-semibold">
                                        {patient.patientId}
                                    </div>

                                </div>


                                <div className="col-md-4">

                                    <span className="text-muted small">
                                        Patient Name
                                    </span>

                                    <div className="fw-semibold">
                                        {patient.patientName}
                                    </div>

                                </div>


                                <div className="col-md-4">

                                    <span className="text-muted small">
                                        Age
                                    </span>

                                    <div className="fw-semibold">
                                        {patient.age} Year(s)
                                    </div>

                                </div>

                            </div>

                        )}

                    </div>

                </div>


                {/* No History */}

                {patientHistory.length === 0 && (

                    <div className="alert alert-info shadow-sm">

                        <i className="bi bi-info-circle me-2"></i>

                        No previous consultation records found for this patient.

                    </div>

                )}


                {/* Consultation List */}

                {patientHistory.length > 0 && (

                    <div className="card border-0 shadow-sm mb-4">

                        <div className="card-header bg-white">

                            <h5 className="mb-0 fw-bold">

                                Previous Consultations

                            </h5>

                        </div>


                        <div className="table-responsive">

                            <table className="table table-hover align-middle mb-0">

                                <thead className="table-light">

                                    <tr>

                                        <th>Date</th>

                                        <th>Doctor</th>

                                        <th>Diagnosis</th>

                                        <th>Action</th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {patientHistory.map((consultation) => (

                                        <tr key={consultation.consultationId}>

                                            <td>
                                                {consultation.date}
                                            </td>

                                            <td>
                                                {consultation.doctorName}
                                            </td>

                                            <td>
                                                {consultation.diagnosis}
                                            </td>

                                            <td>

                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() =>
                                                        setSelectedConsultation(
                                                            consultation
                                                        )
                                                    }
                                                >

                                                    <i className="bi bi-eye me-1"></i>

                                                    View Details

                                                </button>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    </div>

                )}


                {/* Selected Consultation */}

                {selectedConsultation && (

                    <div className="card border-0 shadow-sm">

                        <div className="card-header bg-white py-3">

                            <div className="d-flex justify-content-between align-items-center">

                                <h5 className="mb-0 fw-bold">

                                    <i className="bi bi-file-medical me-2 text-primary"></i>

                                    Consultation Details

                                </h5>


                                <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() =>
                                        setSelectedConsultation(null)
                                    }
                                >
                                    Close
                                </button>

                            </div>

                        </div>


                        <div className="card-body">

                            {/* Basic Consultation Details */}

                            <div className="row g-4 mb-4">

                                <div className="col-md-4">

                                    <div className="text-muted small">
                                        Consultation Date
                                    </div>

                                    <div className="fw-semibold">
                                        {selectedConsultation.date}
                                    </div>

                                </div>


                                <div className="col-md-4">

                                    <div className="text-muted small">
                                        Doctor
                                    </div>

                                    <div className="fw-semibold">
                                        {selectedConsultation.doctorName}
                                    </div>

                                </div>


                                <div className="col-md-4">

                                    <div className="text-muted small">
                                        Diagnosis
                                    </div>

                                    <div className="fw-semibold">
                                        {selectedConsultation.diagnosis}
                                    </div>

                                </div>

                            </div>


                            {/* Symptoms */}

                            <div className="mb-4">

                                <h6 className="fw-bold">
                                    Symptoms
                                </h6>

                                <div className="bg-light rounded p-3">
                                    {selectedConsultation.symptoms}
                                </div>

                            </div>


                            {/* Doctor Notes */}

                            <div className="mb-4">

                                <h6 className="fw-bold">
                                    Doctor Notes
                                </h6>

                                <div className="bg-light rounded p-3">
                                    {selectedConsultation.notes || "No notes available."}
                                </div>

                            </div>


                            {/* Medicines */}

                            <div className="mb-4">

                                <h6 className="fw-bold mb-3">

                                    <i className="bi bi-capsule me-2 text-primary"></i>

                                    Medicines

                                </h6>


                                {selectedConsultation.medicines.length === 0 ? (

                                    <div className="text-muted">
                                        No medicines prescribed.
                                    </div>

                                ) : (

                                    <div className="table-responsive">

                                        <table className="table table-bordered align-middle">

                                            <thead className="table-light">

                                                <tr>

                                                    <th>Medicine</th>
                                                    <th>Strength</th>
                                                    <th>Frequency</th>
                                                    <th>Duration</th>
                                                    <th>Quantity</th>
                                                    <th>Route</th>
                                                    <th>Instructions</th>

                                                </tr>

                                            </thead>


                                            <tbody>

                                                {selectedConsultation.medicines.map(
                                                    (medicine, index) => (

                                                        <tr key={index}>

                                                            <td>
                                                                {medicine.medicineName}
                                                            </td>

                                                            <td>
                                                                {medicine.strength}
                                                            </td>

                                                            <td>
                                                                {medicine.frequency}
                                                            </td>

                                                            <td>
                                                                {medicine.duration}
                                                            </td>

                                                            <td>
                                                                {medicine.quantity}
                                                            </td>

                                                            <td>
                                                                {medicine.route}
                                                            </td>

                                                            <td>
                                                                {medicine.instructions}
                                                            </td>

                                                        </tr>

                                                    )
                                                )}

                                            </tbody>

                                        </table>

                                    </div>

                                )}

                            </div>


                            {/* Lab Tests */}

                            <div>

                                <h6 className="fw-bold mb-3">

                                    <i className="bi bi-clipboard2-pulse me-2 text-primary"></i>

                                    Lab Tests

                                </h6>


                                {selectedConsultation.labTests.length === 0 ? (

                                    <div className="text-muted">
                                        No lab tests prescribed.
                                    </div>

                                ) : (

                                    <div className="table-responsive">

                                        <table className="table table-bordered align-middle">

                                            <thead className="table-light">

                                                <tr>

                                                    <th>Test</th>
                                                    <th>Department</th>
                                                    <th>Status</th>
                                                    <th>Result</th>

                                                </tr>

                                            </thead>


                                            <tbody>

                                                {selectedConsultation.labTests.map(
                                                    (test, index) => (

                                                        <tr key={index}>

                                                            <td>
                                                                {test.testName}
                                                            </td>

                                                            <td>
                                                                {test.department}
                                                            </td>

                                                            <td>

                                                                <span
                                                                    className={
                                                                        test.status === "Completed"
                                                                            ? "badge bg-success"
                                                                            : "badge bg-warning text-dark"
                                                                    }
                                                                >
                                                                    {test.status}
                                                                </span>

                                                            </td>

                                                            <td>
                                                                {test.result || "Pending"}
                                                            </td>

                                                        </tr>

                                                    )
                                                )}

                                            </tbody>

                                        </table>

                                    </div>

                                )}

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
}

export default MedicalHistory;


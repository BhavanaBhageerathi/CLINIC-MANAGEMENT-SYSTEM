
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ConsultationHistory() {
    const navigate = useNavigate();

    const [searchType, setSearchType] = useState("id");
    const [searchValue, setSearchValue] = useState("");
    const [searchedPatient, setSearchedPatient] = useState(null);
    const [error, setError] = useState("");

    // Dummy consultation history
    // Later this data will come from Django REST API
    const consultationHistory = [
        {
            patientId: 25,
            patientName: "Bhav",
            age: 21,
            gender: "F",
            bloodGroup: "AB+",

            consultations: [
                {
                    consultationId: 1,
                    appointmentId: 2,
                    date: "2026-08-20",
                    token: 3,
                    time: "10:00 AM",

                    symptoms: "Fever, headache",
                    diagnosis: "Viral Fever",
                    doctorNotes: "Take adequate rest and drink plenty of fluids.",

                    medicines: [
                        {
                            name: "Paracetamol",
                            type: "Tablet",
                            strength: "650 mg",
                            frequency: "1-1-1",
                            duration: "5 Days",
                            instructions: "After Food",
                            route: "Oral",
                            quantity: "15 Tablets"
                        }
                    ],

                    labTests: [
                        {
                            name: "Complete Blood Count (CBC)",
                            department: "Hematology",
                            price: "Rs.350.00"
                        }
                    ]
                },

                {
                    consultationId: 2,
                    appointmentId: 4,
                    date: "2026-08-28",
                    token: 2,
                    time: "09:30 AM",

                    symptoms: "Cough, cold",
                    diagnosis: "Upper Respiratory Tract Infection",
                    doctorNotes: "Continue medication and avoid cold drinks.",

                    medicines: [
                        {
                            name: "Amoxicillin",
                            type: "Capsule",
                            strength: "250 mg",
                            frequency: "1-1-1",
                            duration: "5 Days",
                            instructions: "After Food",
                            route: "Oral",
                            quantity: "15 Capsules"
                        },
                        {
                            name: "Cetirizine",
                            type: "Tablet",
                            strength: "10 mg",
                            frequency: "0-0-1",
                            duration: "5 Days",
                            instructions: "After Food",
                            route: "Oral",
                            quantity: "5 Tablets"
                        }
                    ],

                    labTests: []
                }
            ]
        },

        {
            patientId: 30,
            patientName: "Anu",
            age: 28,
            gender: "F",
            bloodGroup: "O+",

            consultations: [
                {
                    consultationId: 3,
                    appointmentId: 7,
                    date: "2026-08-25",
                    token: 5,
                    time: "11:00 AM",

                    symptoms: "Stomach pain",
                    diagnosis: "Gastritis",
                    doctorNotes: "Avoid spicy food.",

                    medicines: [
                        {
                            name: "Pantoprazole",
                            type: "Tablet",
                            strength: "40 mg",
                            frequency: "1-0-0",
                            duration: "7 Days",
                            instructions: "Empty Stomach",
                            route: "Oral",
                            quantity: "7 Tablets"
                        }
                    ],

                    labTests: []
                }
            ]
        }
    ];

    const handleSearch = () => {
        setError("");
        setSearchedPatient(null);

        if (!searchValue.trim()) {
            setError("Please enter a value to search.");
            return;
        }

        let patient = null;

        if (searchType === "id") {
            patient = consultationHistory.find(
                (item) =>
                    item.patientId.toString() === searchValue.trim()
            );
        } else {
            patient = consultationHistory.find(
                (item) =>
                    item.patientName.toLowerCase() ===
                    searchValue.trim().toLowerCase()
            );
        }

        if (!patient) {
            setError("No patient found with the given details.");
            return;
        }

        setSearchedPatient(patient);
    };

    const handleClear = () => {
        setSearchValue("");
        setSearchedPatient(null);
        setError("");
    };

    return (
        <div className="min-vh-100 bg-light">

            {/* Header */}
            <div className="bg-primary text-white shadow-sm">
                <div className="container py-3">

                    <div className="d-flex align-items-center">

                        <button
                            className="btn btn-light me-3"
                            onClick={() => navigate(-1)}
                            title="Back"
                        >
                            <i className="bi bi-arrow-left"></i>
                        </button>

                        <div>
                            <h3 className="mb-0">
                                Consultation History
                            </h3>

                            <small>
                                View previous patient consultations
                            </small>
                        </div>

                    </div>

                </div>
            </div>

            <div className="container py-4">

                {/* Search Card */}
                <div className="card shadow-sm border-0 mb-4">

                    <div className="card-body p-4">

                        <h5 className="fw-bold mb-4">
                            <i className="bi bi-search me-2"></i>
                            Search Patient
                        </h5>

                        <div className="row g-3">

                            {/* Search Type */}
                            <div className="col-md-4">

                                <label className="form-label fw-semibold">
                                    Search By
                                </label>

                                <select
                                    className="form-select"
                                    value={searchType}
                                    onChange={(e) => {
                                        setSearchType(e.target.value);
                                        setSearchValue("");
                                        setError("");
                                        setSearchedPatient(null);
                                    }}
                                >
                                    <option value="id">
                                        Patient ID
                                    </option>

                                    <option value="name">
                                        Patient Name
                                    </option>
                                </select>

                            </div>

                            {/* Search Input */}
                            <div className="col-md-5">

                                <label className="form-label fw-semibold">
                                    {searchType === "id"
                                        ? "Patient ID"
                                        : "Patient Name"}
                                </label>

                                <input
                                    type={
                                        searchType === "id"
                                            ? "number"
                                            : "text"
                                    }
                                    className={`form-control ${
                                        error ? "is-invalid" : ""
                                    }`}
                                    placeholder={
                                        searchType === "id"
                                            ? "Enter Patient ID"
                                            : "Enter Patient Name"
                                    }
                                    value={searchValue}
                                    onChange={(e) => {
                                        setSearchValue(e.target.value);
                                        setError("");
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleSearch();
                                        }
                                    }}
                                />

                                {error && (
                                    <div className="invalid-feedback">
                                        {error}
                                    </div>
                                )}

                            </div>

                            {/* Buttons */}
                            <div className="col-md-3 d-flex align-items-end gap-2">

                                <button
                                    className="btn btn-primary flex-grow-1"
                                    onClick={handleSearch}
                                >
                                    <i className="bi bi-search me-1"></i>
                                    Search
                                </button>

                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={handleClear}
                                    title="Clear"
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>

                            </div>

                        </div>

                    </div>
                </div>

                {/* Patient Result */}
                {searchedPatient && (
                    <div>

                        {/* Patient Information */}
                        <div className="card shadow-sm border-0 mb-4">

                            <div className="card-header bg-white py-3">

                                <div className="d-flex justify-content-between align-items-center">

                                    <h5 className="mb-0 fw-bold">
                                        <i className="bi bi-person-circle me-2 text-primary"></i>
                                        Patient Information
                                    </h5>

                                    <span className="badge bg-success">
                                        History Available
                                    </span>

                                </div>

                            </div>

                            <div className="card-body">

                                <div className="row g-3">

                                    <div className="col-md-3">
                                        <small className="text-muted">
                                            Patient ID
                                        </small>

                                        <div className="fw-bold">
                                            {searchedPatient.patientId}
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <small className="text-muted">
                                            Patient Name
                                        </small>

                                        <div className="fw-bold">
                                            {searchedPatient.patientName}
                                        </div>
                                    </div>

                                    <div className="col-md-2">
                                        <small className="text-muted">
                                            Age
                                        </small>

                                        <div className="fw-bold">
                                            {searchedPatient.age}
                                        </div>
                                    </div>

                                    <div className="col-md-2">
                                        <small className="text-muted">
                                            Gender
                                        </small>

                                        <div className="fw-bold">
                                            {searchedPatient.gender}
                                        </div>
                                    </div>

                                    <div className="col-md-2">
                                        <small className="text-muted">
                                            Blood Group
                                        </small>

                                        <div className="fw-bold">
                                            {searchedPatient.bloodGroup}
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>

                        {/* Consultation History */}
                        <h5 className="fw-bold mb-3">
                            Previous Consultations
                        </h5>

                        {searchedPatient.consultations.map(
                            (consultation, index) => (

                                <div
                                    className="card shadow-sm border-0 mb-4"
                                    key={consultation.consultationId}
                                >

                                    {/* Consultation Header */}
                                    <div className="card-header bg-white py-3">

                                        <div className="d-flex justify-content-between align-items-center">

                                            <div>

                                                <h6 className="fw-bold mb-1">
                                                    Consultation{" "}
                                                    {index + 1}
                                                </h6>

                                                <small className="text-muted">
                                                    {consultation.date}{" "}
                                                    •{" "}
                                                    {consultation.time}
                                                </small>

                                            </div>

                                            <span className="badge bg-secondary">
                                                Read Only
                                            </span>

                                        </div>

                                    </div>

                                    <div className="card-body">

                                        {/* Appointment Details */}
                                        <div className="row g-3 mb-4">

                                            <div className="col-md-4">

                                                <small className="text-muted">
                                                    Appointment ID
                                                </small>

                                                <div className="fw-semibold">
                                                    {
                                                        consultation.appointmentId
                                                    }
                                                </div>

                                            </div>

                                            <div className="col-md-4">

                                                <small className="text-muted">
                                                    Token
                                                </small>

                                                <div className="fw-semibold">
                                                    {consultation.token}
                                                </div>

                                            </div>

                                            <div className="col-md-4">

                                                <small className="text-muted">
                                                    Consultation Date
                                                </small>

                                                <div className="fw-semibold">
                                                    {consultation.date}
                                                </div>

                                            </div>

                                        </div>

                                        {/* Symptoms / Diagnosis */}
                                        <div className="row g-3 mb-4">

                                            <div className="col-md-6">

                                                <div className="border rounded p-3 h-100">

                                                    <small className="text-muted">
                                                        Symptoms
                                                    </small>

                                                    <p className="mb-0 mt-1">
                                                        {
                                                            consultation.symptoms
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                            <div className="col-md-6">

                                                <div className="border rounded p-3 h-100">

                                                    <small className="text-muted">
                                                        Diagnosis
                                                    </small>

                                                    <p className="mb-0 mt-1 fw-semibold">
                                                        {
                                                            consultation.diagnosis
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                            <div className="col-12">

                                                <div className="border rounded p-3">

                                                    <small className="text-muted">
                                                        Doctor Notes
                                                    </small>

                                                    <p className="mb-0 mt-1">
                                                        {
                                                            consultation.doctorNotes
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                        {/* Medicines */}
                                        <div className="mb-4">

                                            <h6 className="fw-bold mb-3">
                                                <i className="bi bi-capsule me-2 text-primary"></i>
                                                Medicines
                                            </h6>

                                            {consultation.medicines.length >
                                            0 ? (

                                                <div className="table-responsive">

                                                    <table className="table table-bordered align-middle">

                                                        <thead className="table-light">

                                                            <tr>
                                                                <th>
                                                                    Medicine
                                                                </th>

                                                                <th>
                                                                    Strength
                                                                </th>

                                                                <th>
                                                                    Frequency
                                                                </th>

                                                                <th>
                                                                    Duration
                                                                </th>

                                                                <th>
                                                                    Route
                                                                </th>

                                                                <th>
                                                                    Instructions
                                                                </th>

                                                                <th>
                                                                    Quantity
                                                                </th>
                                                            </tr>

                                                        </thead>

                                                        <tbody>

                                                            {consultation.medicines.map(
                                                                (
                                                                    medicine,
                                                                    medicineIndex
                                                                ) => (

                                                                    <tr
                                                                        key={`${consultation.consultationId}-medicine-${medicineIndex}`}
                                                                    >

                                                                        <td>
                                                                            <strong>
                                                                                {
                                                                                    medicine.name
                                                                                }
                                                                            </strong>

                                                                            <br />

                                                                            <small className="text-muted">
                                                                                {
                                                                                    medicine.type
                                                                                }
                                                                            </small>
                                                                        </td>

                                                                        <td>
                                                                            {
                                                                                medicine.strength
                                                                            }
                                                                        </td>

                                                                        <td>
                                                                            {
                                                                                medicine.frequency
                                                                            }
                                                                        </td>

                                                                        <td>
                                                                            {
                                                                                medicine.duration
                                                                            }
                                                                        </td>

                                                                        <td>
                                                                            {
                                                                                medicine.route
                                                                            }
                                                                        </td>

                                                                        <td>
                                                                            {
                                                                                medicine.instructions
                                                                            }
                                                                        </td>

                                                                        <td>
                                                                            {
                                                                                medicine.quantity
                                                                            }
                                                                        </td>

                                                                    </tr>

                                                                )
                                                            )}

                                                        </tbody>

                                                    </table>

                                                </div>

                                            ) : (

                                                <div className="alert alert-light border">
                                                    No medicines prescribed.
                                                </div>

                                            )}

                                        </div>

                                        {/* Lab Tests */}
                                        <div>

                                            <h6 className="fw-bold mb-3">
                                                <i className="bi bi-clipboard2-pulse me-2 text-primary"></i>
                                                Lab Tests
                                            </h6>

                                            {consultation.labTests.length >
                                            0 ? (

                                                <div className="table-responsive">

                                                    <table className="table table-bordered">

                                                        <thead className="table-light">

                                                            <tr>
                                                                <th>
                                                                    Test
                                                                </th>

                                                                <th>
                                                                    Department
                                                                </th>

                                                                <th>
                                                                    Price
                                                                </th>
                                                            </tr>

                                                        </thead>

                                                        <tbody>

                                                            {consultation.labTests.map(
                                                                (
                                                                    test,
                                                                    testIndex
                                                                ) => (

                                                                    <tr
                                                                        key={`${consultation.consultationId}-test-${testIndex}`}
                                                                    >

                                                                        <td>
                                                                            {
                                                                                test.name
                                                                            }
                                                                        </td>

                                                                        <td>
                                                                            {
                                                                                test.department
                                                                            }
                                                                        </td>

                                                                        <td>
                                                                            {
                                                                                test.price
                                                                            }
                                                                        </td>

                                                                    </tr>

                                                                )
                                                            )}

                                                        </tbody>

                                                    </table>

                                                </div>

                                            ) : (

                                                <div className="alert alert-light border">
                                                    No lab tests prescribed.
                                                </div>

                                            )}

                                        </div>

                                    </div>

                                </div>

                            )
                        )}

                    </div>
                )}

                {/* Initial State */}
                {!searchedPatient && !error && (
                    <div className="card border-0 shadow-sm text-center py-5">

                        <div className="card-body">

                            <i className="bi bi-clock-history display-4 text-primary"></i>

                            <h5 className="fw-bold mt-3">
                                Search Consultation History
                            </h5>

                            <p className="text-muted mb-0">
                                Search by Patient ID or Patient Name
                                to view previous consultations.
                            </p>

                        </div>

                    </div>
                )}

                {/* Back Button */}
                <div className="mt-4">

                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigate(-1)}
                    >
                        <i className="bi bi-arrow-left me-2"></i>
                        Back
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ConsultationHistory;


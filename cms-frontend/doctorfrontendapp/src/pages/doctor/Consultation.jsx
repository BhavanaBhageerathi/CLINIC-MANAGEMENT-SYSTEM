
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import appointments from "../../data/doctor/appointments.json";

function Consultation() {

    const navigate = useNavigate();
    const { appointmentId } = useParams();

    // =====================================================
    // FIND CURRENT APPOINTMENT
    // =====================================================

    const appointment = appointments.find(
        (item) =>
            item.appointmentId === Number(appointmentId)
    );

    // =====================================================
    // CONSULTATION DETAILS
    // =====================================================

    const [symptoms, setSymptoms] = useState("");
    const [diagnosis, setDiagnosis] = useState("");
    const [notes, setNotes] = useState("");

    // =====================================================
    // MEDICINE FORM
    // =====================================================

    const [selectedMedicine, setSelectedMedicine] = useState("");
    const [frequency, setFrequency] = useState("");
    const [duration, setDuration] = useState("");
    const [instructions, setInstructions] = useState("");
    const [route, setRoute] = useState("");
    const [quantity, setQuantity] = useState("");

    const [medicines, setMedicines] = useState([]);

    // =====================================================
    // MEDICINE EDIT MODE
    // =====================================================

    const [editingMedicineId, setEditingMedicineId] =
        useState(null);

    // =====================================================
    // LAB TEST FORM
    // =====================================================

    const [labDepartment, setLabDepartment] = useState("");
    const [selectedTest, setSelectedTest] = useState("");

    const [labTests, setLabTests] = useState([]);

    // =====================================================
    // LAB TEST EDIT MODE
    // =====================================================

    const [editingLabTestId, setEditingLabTestId] =
        useState(null);

    // =====================================================
    // ERRORS
    // =====================================================

    const [errors, setErrors] = useState({});

    // =====================================================
    // SAVED STATUS
    // =====================================================

    const [saved, setSaved] = useState(false);

    // =====================================================
    // MEDICINE LIST
    // =====================================================

    const medicineList = [
        {
            id: 1,
            name: "Amoxicillin",
            type: "Capsule",
            strength: "250 mg"
        },
        {
            id: 2,
            name: "Azithromycin",
            type: "Tablet",
            strength: "500 mg"
        },
        {
            id: 3,
            name: "Cetirizine",
            type: "Tablet",
            strength: "10 mg"
        },
        {
            id: 4,
            name: "Cough Syrup",
            type: "Syrup",
            strength: "100 ml"
        },
        {
            id: 5,
            name: "Dolo",
            type: "Tablet",
            strength: "650 mg"
        },
        {
            id: 6,
            name: "Insulin",
            type: "Injection",
            strength: "10 ml"
        },
        {
            id: 7,
            name: "ORS Powder",
            type: "Powder",
            strength: "1 Sachet"
        },
        {
            id: 8,
            name: "Pantoprazole",
            type: "Tablet",
            strength: "40 mg"
        },
        {
            id: 9,
            name: "Paracetamol",
            type: "Tablet",
            strength: "650 mg"
        }
    ];

    // =====================================================
    // LAB DEPARTMENTS AND TESTS
    // =====================================================

    const labDepartments = {

        Biochemistry: [
            "Blood Glucose",
            "Liver Function Test"
        ],

        Cardiology: [
            "ECG",
            "Echocardiogram"
        ],

        Hematology: [
            "Complete Blood Count (CBC)"
        ],

        Microbiology: [
            "Urine Culture",
            "Blood Culture"
        ],

        Radiology: [
            "X-Ray",
            "Ultrasound"
        ]
    };

    // =====================================================
    // CHECK WHETHER MEDICINE IS ALREADY SELECTED
    // =====================================================

    const isMedicineAlreadySelected = (medicineId) => {

        return medicines.some(
            (medicine) =>
                medicine.medicineId === Number(medicineId)
        );
    };

    // =====================================================
    // CHECK WHETHER LAB TEST IS ALREADY SELECTED
    // =====================================================

    const isLabTestAlreadySelected = (
        department,
        test
    ) => {

        return labTests.some(
            (lab) =>
                lab.department === department &&
                lab.test === test
        );
    };

    // =====================================================
    // ADD / UPDATE MEDICINE
    // =====================================================

    const addOrUpdateMedicine = () => {

        const newErrors = {};

        if (!selectedMedicine) {
            newErrors.medicine =
                "Please select a medicine.";
        }

        if (!frequency) {
            newErrors.frequency =
                "Please select frequency.";
        }

        if (!duration) {
            newErrors.duration =
                "Please select duration.";
        }

        if (!instructions) {
            newErrors.instructions =
                "Please select instructions.";
        }

        if (!route) {
            newErrors.route =
                "Please select route.";
        }

        if (!quantity || Number(quantity) <= 0) {
            newErrors.quantity =
                "Please enter a valid quantity.";
        }

        // =================================================
        // DUPLICATE VALIDATION
        // =================================================

        if (
            !editingMedicineId &&
            isMedicineAlreadySelected(selectedMedicine)
        ) {

            newErrors.medicine =
                "This medicine has already been selected.";
        }

        if (Object.keys(newErrors).length > 0) {

            setErrors(newErrors);

            return;
        }

        const medicine = medicineList.find(
            (item) =>
                item.id === Number(selectedMedicine)
        );

        // =================================================
        // UPDATE EXISTING MEDICINE
        // =================================================

        if (editingMedicineId) {

            setMedicines(
                medicines.map(
                    (item) => {

                        if (
                            item.id === editingMedicineId
                        ) {

                            return {

                                ...item,

                                medicineId:
                                    medicine.id,

                                name:
                                    medicine.name,

                                type:
                                    medicine.type,

                                strength:
                                    medicine.strength,

                                frequency:
                                    frequency,

                                duration:
                                    duration,

                                instructions:
                                    instructions,

                                route:
                                    route,

                                quantity:
                                    quantity
                            };
                        }

                        return item;
                    }
                )
            );

            setEditingMedicineId(null);

        }

        // =================================================
        // ADD NEW MEDICINE
        // =================================================

        else {

            const newMedicine = {

                id: labTests.length + 1,

                medicineId:
                    medicine.id,

                name:
                    medicine.name,

                type:
                    medicine.type,

                strength:
                    medicine.strength,

                frequency:
                    frequency,

                duration:
                    duration,

                instructions:
                    instructions,

                route:
                    route,

                quantity:
                    quantity
            };

            setMedicines([
                ...medicines,
                newMedicine
            ]);
        }

        // Clear medicine form

        clearMedicineForm();

        setErrors({});
    };

    // =====================================================
    // CLEAR MEDICINE FORM
    // =====================================================

    const clearMedicineForm = () => {

        setSelectedMedicine("");
        setFrequency("");
        setDuration("");
        setInstructions("");
        setRoute("");
        setQuantity("");

        setEditingMedicineId(null);
    };

    // =====================================================
    // EDIT MEDICINE
    // =====================================================

    const editMedicine = (medicine) => {

        setSelectedMedicine(
            String(medicine.medicineId)
        );

        setFrequency(
            medicine.frequency
        );

        setDuration(
            medicine.duration
        );

        setInstructions(
            medicine.instructions
        );

        setRoute(
            medicine.route
        );

        setQuantity(
            medicine.quantity
        );

        setEditingMedicineId(
            medicine.id
        );

        setErrors({});

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // =====================================================
    // DELETE MEDICINE
    // =====================================================

    const removeMedicine = (id) => {

        setMedicines(
            medicines.filter(
                (medicine) =>
                    medicine.id !== id
            )
        );

        if (
            editingMedicineId === id
        ) {

            clearMedicineForm();
        }
    };

    // =====================================================
    // ADD / UPDATE LAB TEST
    // =====================================================

    const addOrUpdateLabTest = () => {

        const newErrors = {};

        if (!labDepartment) {

            newErrors.labDepartment =
                "Please select a lab department.";
        }

        if (!selectedTest) {

            newErrors.selectedTest =
                "Please select a lab test.";
        }

        // =================================================
        // DUPLICATE LAB TEST VALIDATION
        // =================================================

        if (
            !editingLabTestId &&
            isLabTestAlreadySelected(
                labDepartment,
                selectedTest
            )
        ) {

            newErrors.selectedTest =
                "This lab test has already been selected.";
        }

        if (Object.keys(newErrors).length > 0) {

            setErrors(newErrors);

            return;
        }

        // =================================================
        // UPDATE EXISTING LAB TEST
        // =================================================

        if (editingLabTestId) {

            setLabTests(
                labTests.map(
                    (item) => {

                        if (
                            item.id ===
                            editingLabTestId
                        ) {

                            return {

                                ...item,

                                department:
                                    labDepartment,

                                test:
                                    selectedTest
                            };
                        }

                        return item;
                    }
                )
            );

            setEditingLabTestId(null);

        }

        // =================================================
        // ADD NEW LAB TEST
        // =================================================

        else {

            const newTest = {

                id:  medicines.length + 1,

                department:
                    labDepartment,

                test:
                    selectedTest
            };

            setLabTests([
                ...labTests,
                newTest
            ]);
        }

        clearLabForm();

        setErrors({});
    };

    // =====================================================
    // CLEAR LAB FORM
    // =====================================================

    const clearLabForm = () => {

        setLabDepartment("");
        setSelectedTest("");

        setEditingLabTestId(null);
    };

    // =====================================================
    // EDIT LAB TEST
    // =====================================================

    const editLabTest = (labTest) => {

        setLabDepartment(
            labTest.department
        );

        setSelectedTest(
            labTest.test
        );

        setEditingLabTestId(
            labTest.id
        );

        setErrors({});

        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
        });
    };

    // =====================================================
    // DELETE LAB TEST
    // =====================================================

    const removeLabTest = (id) => {

        setLabTests(
            labTests.filter(
                (test) =>
                    test.id !== id
            )
        );

        if (
            editingLabTestId === id
        ) {

            clearLabForm();
        }
    };

    // =====================================================
    // SAVE CONSULTATION
    // =====================================================

    const saveConsultation = () => {

        const newErrors = {};

        // Symptoms required

        if (!symptoms.trim()) {

            newErrors.symptoms =
                "Symptoms are required.";
        }

        // Diagnosis required

        if (!diagnosis.trim()) {

            newErrors.diagnosis =
                "Diagnosis is required.";
        }

        // =================================================
        // AT LEAST ONE MEDICINE OR LAB TEST
        // =================================================

        if (
            medicines.length === 0 &&
            labTests.length === 0
        ) {

            newErrors.prescription =
                "Please add at least one medicine or at least one lab test.";
        }

        // =================================================
        // STOP IF ERRORS
        // =================================================

        if (
            Object.keys(newErrors).length > 0
        ) {

            setErrors(newErrors);

            return;
        }

        // =================================================
        // SAVE CONSULTATION
        // =================================================

        /*
            TEMPORARY FRONTEND STORAGE

            Later Django will handle this.

            Backend will save:

            Doctor
            Patient
            Appointment
            Symptoms
            Diagnosis
            Doctor Notes
            Medicines
            Lab Tests

            Then:

            Patient Status = COMPLETED
            Consultation = READ ONLY
        */

        const completedAppointments =
            JSON.parse(
                localStorage.getItem(
                    "completedAppointments"
                ) || "[]"
            );

        if (
            !completedAppointments.includes(
                appointment.appointmentId
            )
        ) {

            completedAppointments.push(
                appointment.appointmentId
            );
        }

        localStorage.setItem(
            "completedAppointments",
            JSON.stringify(
                completedAppointments
            )
        );

        setSaved(true);

        setErrors({});
    };

    // =====================================================
    // CONTINUE WITH NEXT PATIENT
    // =====================================================

    const handleNextPatient = () => {

        /*
            Completed appointment has already
            been stored in localStorage.

            StartConsultation.jsx can read
            completedAppointments and hide it.
        */

        navigate(
            "/doctor/consultation"
        );
    };

    // =====================================================
    // APPOINTMENT NOT FOUND
    // =====================================================

    if (!appointment) {

        return (

            <div className="min-vh-100 bg-light">

                <div className="container py-4">

                    <button
                        className="btn btn-link text-dark text-decoration-none px-0"
                        onClick={() => navigate(-1)}
                    >

                        <i className="bi bi-arrow-left me-2"></i>

                        Back

                    </button>

                    <div className="alert alert-danger mt-3">

                        Appointment not found.

                    </div>

                </div>

            </div>
        );
    }

    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <div className="min-vh-100 bg-light">

            <div className="container py-4">


                {/* =================================================
                    BACK
                ================================================= */}

                <button
                    className="btn btn-link text-dark text-decoration-none px-0 mb-3"
                    onClick={() => navigate(-1)}
                >

                    <i className="bi bi-arrow-left fs-5 me-2"></i>

                    Back

                </button>


                {/* =================================================
                    PATIENT HEADER
                ================================================= */}

                <div className="card border-0 shadow-sm mb-4">

                    <div className="card-header bg-primary text-white">

                        <h4 className="mb-0">

                            <i className="bi bi-clipboard2-pulse me-2"></i>

                            Patient Consultation

                        </h4>

                    </div>


                    <div className="card-body">

                        <div className="row g-3">


                            <div className="col-md-3">

                                <small className="text-muted">
                                    Patient ID
                                </small>

                                <div className="fw-semibold">
                                    {appointment.patientId}
                                </div>

                            </div>


                            <div className="col-md-3">

                                <small className="text-muted">
                                    Patient Name
                                </small>

                                <div className="fw-semibold">
                                    {appointment.patientName}
                                </div>

                            </div>


                            <div className="col-md-3">

                                <small className="text-muted">
                                    Appointment ID
                                </small>

                                <div className="fw-semibold">
                                    {appointment.appointmentId}
                                </div>

                            </div>


                            <div className="col-md-3">

                                <small className="text-muted">
                                    Token
                                </small>

                                <div>

                                    <span className="badge bg-primary">

                                        {appointment.token}

                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    SAVED MESSAGE
                ================================================= */}

                {saved && (

                    <div className="alert alert-success shadow-sm">

                        <i className="bi bi-check-circle-fill me-2"></i>

                        <strong>
                            Consultation completed successfully.
                        </strong>

                        <div className="mt-1">

                            Patient status is now
                            <strong> Completed</strong>.

                            The consultation is now
                            <strong> read-only</strong>.

                        </div>

                    </div>

                )}


                {/* =================================================
                    1. CONSULTATION DETAILS
                ================================================= */}

                <div className="card border-0 shadow-sm mb-4">

                    <div className="card-header bg-white">

                        <h5 className="fw-bold mb-0">

                            1. Consultation Details

                        </h5>

                    </div>


                    <div className="card-body">


                        {/* Symptoms */}

                        <div className="mb-4">

                            <label className="form-label fw-semibold">

                                Symptoms

                                <span className="text-danger">
                                    {" "}*
                                </span>

                            </label>


                            <textarea
                                className={`form-control ${
                                    errors.symptoms
                                        ? "is-invalid"
                                        : ""
                                }`}
                                rows="3"
                                placeholder="Enter patient's symptoms..."
                                value={symptoms}
                                disabled={saved}
                                onChange={(e) =>
                                    setSymptoms(
                                        e.target.value
                                    )
                                }
                            />


                            {errors.symptoms && (

                                <div className="invalid-feedback">

                                    {errors.symptoms}

                                </div>

                            )}

                        </div>


                        {/* Diagnosis */}

                        <div className="mb-4">

                            <label className="form-label fw-semibold">

                                Diagnosis

                                <span className="text-danger">
                                    {" "}*
                                </span>

                            </label>


                            <textarea
                                className={`form-control ${
                                    errors.diagnosis
                                        ? "is-invalid"
                                        : ""
                                }`}
                                rows="3"
                                placeholder="Enter diagnosis..."
                                value={diagnosis}
                                disabled={saved}
                                onChange={(e) =>
                                    setDiagnosis(
                                        e.target.value
                                    )
                                }
                            />


                            {errors.diagnosis && (

                                <div className="invalid-feedback">

                                    {errors.diagnosis}

                                </div>

                            )}

                        </div>


                        {/* Notes */}

                        <div>

                            <label className="form-label fw-semibold">

                                Doctor Notes

                                <span className="text-muted fw-normal">

                                    {" "}(Optional)

                                </span>

                            </label>


                            <textarea
                                className="form-control"
                                rows="3"
                                placeholder="Enter additional notes..."
                                value={notes}
                                disabled={saved}
                                onChange={(e) =>
                                    setNotes(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                    </div>

                </div>


                {/* =================================================
                    2. MEDICINE SELECTION
                ================================================= */}

                <div className="card border-0 shadow-sm mb-4">

                    <div className="card-header bg-white">

                        <h5 className="fw-bold mb-0">

                            2. Medicine Selection

                            <span className="text-muted fs-6 fw-normal">

                                {" "}(Optional if Lab Test is selected)

                            </span>

                        </h5>

                    </div>


                    <div className="card-body">


                        {/* Medicine dropdown */}

                        <div className="mb-3">

                            <label className="form-label fw-semibold">

                                Medicine

                            </label>


                            <select
                                className={`form-select ${
                                    errors.medicine
                                        ? "is-invalid"
                                        : ""
                                }`}
                                value={selectedMedicine}
                                disabled={saved}
                                onChange={(e) =>
                                    setSelectedMedicine(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">

                                    Select Medicine

                                </option>


                                {medicineList.map(
                                    (medicine) => {

                                        const alreadySelected =
                                            isMedicineAlreadySelected(
                                                medicine.id
                                            );

                                        /*
                                            While editing the current
                                            medicine, allow that same
                                            medicine to remain selected.
                                        */

                                        const isCurrentEditing =
                                            editingMedicineId &&
                                            medicines.find(
                                                (item) =>
                                                    item.id ===
                                                    editingMedicineId
                                            )?.medicineId ===
                                            medicine.id;

                                        return (

                                            <option
                                                key={medicine.id}
                                                value={medicine.id}
                                                disabled={
                                                    alreadySelected &&
                                                    !isCurrentEditing
                                                }
                                            >

                                                {medicine.name}
                                                {" - "}
                                                {medicine.type}
                                                {" - "}
                                                {medicine.strength}

                                                {alreadySelected &&
                                                    !isCurrentEditing
                                                    ? "  (Already Selected)"
                                                    : ""}

                                            </option>

                                        );

                                    }
                                )}

                            </select>


                            {errors.medicine && (

                                <div className="invalid-feedback">

                                    {errors.medicine}

                                </div>

                            )}

                            <small className="text-muted">

                                Medicines already selected cannot
                                be selected again.

                            </small>

                        </div>


                        <div className="row g-3">


                            {/* Frequency */}

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">

                                    Frequency

                                </label>


                                <select
                                    className="form-select"
                                    value={frequency}
                                    disabled={saved}
                                    onChange={(e) =>
                                        setFrequency(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Select Frequency
                                    </option>

                                    <option value="1-1-1">
                                        Morning Afternoon Night (1-1-1)
                                    </option>

                                    <option value="1-0-1">
                                        Morning & Night (1-0-1)
                                    </option>

                                    <option value="1-0-0">
                                        Morning Only (1-0-0)
                                    </option>

                                    <option value="0-1-0">
                                        Afternoon Only (0-1-0)
                                    </option>

                                    <option value="0-0-1">
                                        Night Only (0-0-1)
                                    </option>

                                    <option value="SOS">
                                        SOS
                                    </option>

                                </select>


                                {errors.frequency && (

                                    <div className="text-danger small mt-1">

                                        {errors.frequency}

                                    </div>

                                )}

                            </div>


                            {/* Duration */}

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">

                                    Duration

                                </label>


                                <select
                                    className="form-select"
                                    value={duration}
                                    disabled={saved}
                                    onChange={(e) =>
                                        setDuration(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Select Duration
                                    </option>

                                    <option value="3 Days">
                                        3 Days
                                    </option>

                                    <option value="5 Days">
                                        5 Days
                                    </option>

                                    <option value="7 Days">
                                        7 Days
                                    </option>

                                    <option value="10 Days">
                                        10 Days
                                    </option>

                                    <option value="15 Days">
                                        15 Days
                                    </option>

                                </select>


                                {errors.duration && (

                                    <div className="text-danger small mt-1">

                                        {errors.duration}

                                    </div>

                                )}

                            </div>


                            {/* Instructions */}

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">

                                    Instructions

                                </label>


                                <select
                                    className="form-select"
                                    value={instructions}
                                    disabled={saved}
                                    onChange={(e) =>
                                        setInstructions(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Select Instructions
                                    </option>

                                    <option value="Before Food">
                                        Before Food
                                    </option>

                                    <option value="After Food">
                                        After Food
                                    </option>

                                    <option value="With Food">
                                        With Food
                                    </option>

                                    <option value="Empty Stomach">
                                        Empty Stomach
                                    </option>

                                </select>


                                {errors.instructions && (

                                    <div className="text-danger small mt-1">

                                        {errors.instructions}

                                    </div>

                                )}

                            </div>


                            {/* Route */}

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">

                                    Route of Administration

                                </label>


                                <select
                                    className="form-select"
                                    value={route}
                                    disabled={saved}
                                    onChange={(e) =>
                                        setRoute(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Select Route
                                    </option>

                                    <option value="Oral">
                                        Oral
                                    </option>

                                    <option value="Injection">
                                        Injection
                                    </option>

                                    <option value="Syrup">
                                        Syrup
                                    </option>

                                    <option value="Drops">
                                        Drops
                                    </option>

                                    <option value="Ointment">
                                        Ointment
                                    </option>

                                    <option value="Inhalation">
                                        Inhalation
                                    </option>

                                </select>


                                {errors.route && (

                                    <div className="text-danger small mt-1">

                                        {errors.route}

                                    </div>

                                )}

                            </div>


                            {/* Quantity */}

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">

                                    Quantity to Dispense

                                </label>


                                <input
                                    type="number"
                                    min="1"
                                    className="form-control"
                                    placeholder="Enter quantity"
                                    value={quantity}
                                    disabled={saved}
                                    onChange={(e) =>
                                        setQuantity(
                                            e.target.value
                                        )
                                    }
                                />


                                {errors.quantity && (

                                    <div className="text-danger small mt-1">

                                        {errors.quantity}

                                    </div>

                                )}

                            </div>

                        </div>


                        {/* Add / Update Button */}

                        {!saved && (

                            <div className="mt-4">

                                <button
                                    className="btn btn-outline-primary me-2"
                                    onClick={
                                        addOrUpdateMedicine
                                    }
                                >

                                    <i
                                        className={`bi ${
                                            editingMedicineId
                                                ? "bi-check-circle"
                                                : "bi-plus-circle"
                                        } me-2`}
                                    ></i>


                                    {editingMedicineId
                                        ? "Update Medicine"
                                        : "Add Medicine"}

                                </button>


                                {editingMedicineId && (

                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={
                                            clearMedicineForm
                                        }
                                    >

                                        Cancel Edit

                                    </button>

                                )}

                            </div>

                        )}


                        {/* =================================================
                            SELECTED MEDICINES
                        ================================================= */}

                        {medicines.length > 0 && (

                            <div className="mt-4">

                                <h6 className="fw-bold">

                                    <i className="bi bi-capsule me-2"></i>

                                    Selected Medicines

                                </h6>


                                <div className="table-responsive">

                                    <table className="table table-bordered table-hover align-middle">

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
                                                    Quantity
                                                </th>

                                                <th>
                                                    Route
                                                </th>

                                                <th>
                                                    Instructions
                                                </th>

                                                {!saved && (

                                                    <th>
                                                        Actions
                                                    </th>

                                                )}

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {medicines.map(
                                                (medicine) => (

                                                    <tr
                                                        key={
                                                            medicine.id
                                                        }
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
                                                                medicine.quantity
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


                                                        {!saved && (

                                                            <td>

                                                                {/* EDIT */}

                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-warning me-2"
                                                                    title="Edit Medicine"
                                                                    onClick={() =>
                                                                        editMedicine(
                                                                            medicine
                                                                        )
                                                                    }
                                                                >

                                                                    <i className="bi bi-pencil"></i>

                                                                </button>


                                                                {/* DELETE */}

                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    title="Delete Medicine"
                                                                    onClick={() =>
                                                                        removeMedicine(
                                                                            medicine.id
                                                                        )
                                                                    }
                                                                >

                                                                    <i className="bi bi-trash"></i>

                                                                </button>

                                                            </td>

                                                        )}

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            </div>

                        )}

                    </div>

                </div>


                {/* =================================================
                    3. LAB TEST SELECTION
                ================================================= */}

                <div className="card border-0 shadow-sm mb-4">

                    <div className="card-header bg-white">

                        <h5 className="fw-bold mb-0">

                            3. Lab Test Selection

                            <span className="text-muted fs-6 fw-normal">

                                {" "}(Optional if Medicine is selected)

                            </span>

                        </h5>

                    </div>


                    <div className="card-body">


                        <div className="row g-3">


                            {/* Department */}

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">

                                    Lab Test Department

                                </label>


                                <select
                                    className="form-select"
                                    value={labDepartment}
                                    disabled={saved}
                                    onChange={(e) => {

                                        setLabDepartment(
                                            e.target.value
                                        );

                                        setSelectedTest("");

                                    }}
                                >

                                    <option value="">
                                        Select Department
                                    </option>


                                    {Object.keys(
                                        labDepartments
                                    ).map(
                                        (department) => (

                                            <option
                                                key={
                                                    department
                                                }
                                                value={
                                                    department
                                                }
                                            >

                                                {
                                                    department
                                                }

                                            </option>

                                        )
                                    )}

                                </select>


                                {errors.labDepartment && (

                                    <div className="text-danger small mt-1">

                                        {
                                            errors.labDepartment
                                        }

                                    </div>

                                )}

                            </div>


                            {/* Test */}

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">

                                    Lab Test

                                </label>


                                <select
                                    className="form-select"
                                    value={selectedTest}
                                    disabled={
                                        saved ||
                                        !labDepartment
                                    }
                                    onChange={(e) =>
                                        setSelectedTest(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Select Test
                                    </option>


                                    {labDepartment &&

                                        labDepartments[
                                            labDepartment
                                        ].map(
                                            (test) => {

                                                const alreadySelected =
                                                    isLabTestAlreadySelected(
                                                        labDepartment,
                                                        test
                                                    );

                                                const currentEditingTest =
                                                    editingLabTestId &&
                                                    labTests.find(
                                                        (item) =>
                                                            item.id ===
                                                            editingLabTestId
                                                    );

                                                const isCurrentEditing =
                                                    currentEditingTest &&
                                                    currentEditingTest.department ===
                                                        labDepartment &&
                                                    currentEditingTest.test ===
                                                        test;

                                                return (

                                                    <option
                                                        key={
                                                            test
                                                        }
                                                        value={
                                                            test
                                                        }
                                                        disabled={
                                                            alreadySelected &&
                                                            !isCurrentEditing
                                                        }
                                                    >

                                                        {test}

                                                        {alreadySelected &&
                                                            !isCurrentEditing
                                                            ? "  (Already Selected)"
                                                            : ""}

                                                    </option>

                                                );

                                            }
                                        )}

                                </select>


                                {errors.selectedTest && (

                                    <div className="text-danger small mt-1">

                                        {
                                            errors.selectedTest
                                        }

                                    </div>

                                )}

                                <small className="text-muted">

                                    Already selected lab tests
                                    cannot be selected again.

                                </small>

                            </div>

                        </div>


                        {/* Add / Update Lab Test */}

                        {!saved && (

                            <div className="mt-4">

                                <button
                                    className="btn btn-outline-primary me-2"
                                    onClick={
                                        addOrUpdateLabTest
                                    }
                                >

                                    <i
                                        className={`bi ${
                                            editingLabTestId
                                                ? "bi-check-circle"
                                                : "bi-plus-circle"
                                        } me-2`}
                                    ></i>


                                    {editingLabTestId
                                        ? "Update Lab Test"
                                        : "Add Lab Test"}

                                </button>


                                {editingLabTestId && (

                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={
                                            clearLabForm
                                        }
                                    >

                                        Cancel Edit

                                    </button>

                                )}

                            </div>

                        )}


                        {/* =================================================
                            SELECTED LAB TESTS
                        ================================================= */}

                        {labTests.length > 0 && (

                            <div className="mt-4">

                                <h6 className="fw-bold">

                                    <i className="bi bi-eyedropper me-2"></i>

                                    Selected Lab Tests

                                </h6>


                                <div className="table-responsive">

                                    <table className="table table-bordered table-hover align-middle">

                                        <thead className="table-light">

                                            <tr>

                                                <th>
                                                    #
                                                </th>

                                                <th>
                                                    Department
                                                </th>

                                                <th>
                                                    Test
                                                </th>

                                                {!saved && (

                                                    <th>
                                                        Actions
                                                    </th>

                                                )}

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {labTests.map(
                                                (test, index) => (

                                                    <tr
                                                        key={
                                                            test.id
                                                        }
                                                    >

                                                        <td>
                                                            {
                                                                index + 1
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                test.department
                                                            }
                                                        </td>

                                                        <td>

                                                            <strong>
                                                                {
                                                                    test.test
                                                                }
                                                            </strong>

                                                        </td>


                                                        {!saved && (

                                                            <td>

                                                                {/* EDIT */}

                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-warning me-2"
                                                                    title="Edit Lab Test"
                                                                    onClick={() =>
                                                                        editLabTest(
                                                                            test
                                                                        )
                                                                    }
                                                                >

                                                                    <i className="bi bi-pencil"></i>

                                                                </button>


                                                                {/* DELETE */}

                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    title="Delete Lab Test"
                                                                    onClick={() =>
                                                                        removeLabTest(
                                                                            test.id
                                                                        )
                                                                    }
                                                                >

                                                                    <i className="bi bi-trash"></i>

                                                                </button>

                                                            </td>

                                                        )}

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            </div>

                        )}

                    </div>

                </div>


                {/* =================================================
                    BEFORE SAVE
                ================================================= */}

                {!saved && (

                    <div className="card border-0 shadow-sm mb-4">

                        <div className="card-header bg-white">

                            <h5 className="fw-bold mb-0">

                                4. Save Consultation

                            </h5>

                        </div>


                        <div className="card-body">


                            {errors.prescription && (

                                <div className="alert alert-danger">

                                    <i className="bi bi-exclamation-triangle me-2"></i>

                                    {
                                        errors.prescription
                                    }

                                </div>

                            )}


                            <div className="alert alert-info">

                                <i className="bi bi-info-circle me-2"></i>

                                <strong>
                                    Saved consultations cannot be edited
                                </strong>

                                <br />

                                
                                
                                <br />


                            </div>


                            <div className="text-end">

                                <button
                                    className="btn btn-success btn-lg px-5"
                                    onClick={
                                        saveConsultation
                                    }
                                >

                                    <i className="bi bi-check-circle me-2"></i>

                                    Save Consultation

                                </button>

                            </div>

                        </div>

                    </div>

                )}


                {/* =================================================
                    AFTER SAVE
                ================================================= */}

                {saved && (

                    <div className="card border-0 shadow-sm mb-4">

                        <div className="card-body">


                            {/* Completed */}

                            <div className="alert alert-success">

                                <h5 className="alert-heading">

                                    <i className="bi bi-check-circle-fill me-2"></i>

                                    Consultation Saved Successfully

                                </h5>


                                <hr />


                                <p className="mb-1">

                                    Patient Status:

                                    <strong>
                                        {" "}Completed
                                    </strong>

                                </p>


                                <p className="mb-0">

                                    Consultation:

                                    <strong>
                                        {" "}Read-Only
                                    </strong>

                                </p>

                            </div>


                            <div className="d-flex justify-content-end gap-2 flex-wrap">


                                {/* PRINT */}

                                <button
                                    className="btn btn-primary btn-lg px-4"
                                    onClick={() =>
                                        window.print()
                                    }
                                >

                                    <i className="bi bi-printer me-2"></i>

                                    Print Prescription

                                </button>


                                {/* NEXT PATIENT */}

                                <button
                                    className="btn btn-warning btn-lg px-4"
                                    onClick={
                                        handleNextPatient
                                    }
                                >

                                    <i className="bi bi-arrow-right-circle me-2"></i>

                                    Continue with Next Patient

                                </button>

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Consultation;


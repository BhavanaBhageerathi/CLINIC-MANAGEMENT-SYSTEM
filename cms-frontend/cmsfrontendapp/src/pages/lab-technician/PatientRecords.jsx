import { useMemo, useState } from "react";
import "./PatientRecords.css";

const initialRecords = [
  {
    id: "LR001",
    patientId: "PAT001",
    patientName: "Arun Kumar",
    age: 42,
    gender: "Male",
    doctor: "Dr. Rahul Menon",
    testName: "Complete Blood Count",
    testId: "LAB001",
    category: "Hematology",
    sample: "Blood",
    requestedDate: "03 Sep 2026",
    requestedTime: "09:15 AM",
    status: "Pending",
  },
  {
    id: "LR002",
    patientId: "PAT002",
    patientName: "Meera Nair",
    age: 35,
    gender: "Female",
    doctor: "Dr. Anjali Kumar",
    testName: "Liver Function Test",
    testId: "LAB002",
    category: "Biochemistry",
    sample: "Blood",
    requestedDate: "03 Sep 2026",
    requestedTime: "09:30 AM",
    status: "In Progress",
  },
  {
    id: "LR003",
    patientId: "PAT003",
    patientName: "Vishnu Raj",
    age: 28,
    gender: "Male",
    doctor: "Dr. Arun Das",
    testName: "Blood Glucose",
    testId: "LAB003",
    category: "Biochemistry",
    sample: "Blood",
    requestedDate: "03 Sep 2026",
    requestedTime: "10:00 AM",
    status: "Completed",
  },
  {
    id: "LR004",
    patientId: "PAT004",
    patientName: "Anjali S",
    age: 51,
    gender: "Female",
    doctor: "Dr. Rahul Menon",
    testName: "Lipid Profile",
    testId: "LAB004",
    category: "Biochemistry",
    sample: "Blood",
    requestedDate: "03 Sep 2026",
    requestedTime: "10:20 AM",
    status: "Pending",
  },
  {
    id: "LR005",
    patientId: "PAT005",
    patientName: "Nikhil Mohan",
    age: 46,
    gender: "Male",
    doctor: "Dr. Anjali Kumar",
    testName: "Thyroid Profile",
    testId: "LAB005",
    category: "Hormones",
    sample: "Blood",
    requestedDate: "03 Sep 2026",
    requestedTime: "10:45 AM",
    status: "Completed",
  },
];

const statusOptions = [
  "Pending",
  "In Progress",
  "Completed",
  "Cancelled",
];

function PatientRecords() {
  const [records, setRecords] = useState(initialRecords);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const [editingRecord, setEditingRecord] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);

  const filteredRecords = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !keyword ||
        record.patientId.toLowerCase().includes(keyword) ||
        record.patientName.toLowerCase().includes(keyword) ||
        record.id.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "All" ||
        record.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [records, search, statusFilter]);

  const pendingCount = records.filter(
    (record) => record.status === "Pending"
  ).length;

  const inProgressCount = records.filter(
    (record) => record.status === "In Progress"
  ).length;

  const completedCount = records.filter(
    (record) => record.status === "Completed"
  ).length;

  const cancelledCount = records.filter(
    (record) => record.status === "Cancelled"
  ).length;

  const openViewModal = (record) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };

  const openStatusModal = (record) => {
    setEditingRecord(record);
    setEditStatus(record.status);
    setShowStatusModal(true);
  };

  const closeModals = () => {
    setSelectedRecord(null);
    setEditingRecord(null);
    setShowViewModal(false);
    setShowStatusModal(false);
    setEditStatus("");
  };

  const updateStatus = () => {
    if (!editingRecord || !editStatus) {
      return;
    }

    setRecords((previous) =>
      previous.map((record) =>
        record.id === editingRecord.id
          ? {
              ...record,
              status: editStatus,
            }
          : record
      )
    );

    closeModals();
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "pr-status-pending";

      case "In Progress":
        return "pr-status-progress";

      case "Completed":
        return "pr-status-completed";

      case "Cancelled":
        return "pr-status-cancelled";

      default:
        return "";
    }
  };

  return (
    <div className="patient-records-page">

      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <div className="pr-page-header">

        <div>
          <div className="pr-breadcrumb">
            <span>Clinic</span>

            <i className="bi bi-chevron-right"></i>

            <span>Laboratory</span>

            <i className="bi bi-chevron-right"></i>

            <strong>Patient Records</strong>
          </div>

          <div className="d-flex align-items-center gap-3 mt-2">

            <div className="pr-title-icon">
              <i className="bi bi-person-vcard"></i>
            </div>

            <div>
              <h2 className="pr-page-title">
                Patient Records
              </h2>

              <p className="pr-page-subtitle mb-0">
                Manage doctor-requested laboratory tests and patient records.
              </p>
            </div>

          </div>
        </div>

        <div className="pr-live-indicator">

          <span className="pr-live-dot"></span>

          Laboratory Queue Live

        </div>

      </div>

      {/* =====================================================
          STATISTICS
          ===================================================== */}

      <div className="row g-4 mb-4">

        <div className="col-xl-3 col-md-6">

          <div className="pr-stat-card">

            <div>
              <div className="pr-stat-label">
                PENDING TESTS
              </div>

              <div className="pr-stat-number">
                {pendingCount}
              </div>

              <small className="text-warning fw-semibold">
                Awaiting processing
              </small>
            </div>

            <div className="pr-stat-icon pr-stat-warning">
              <i className="bi bi-hourglass-split"></i>
            </div>

          </div>

        </div>

        <div className="col-xl-3 col-md-6">

          <div className="pr-stat-card">

            <div>
              <div className="pr-stat-label">
                IN PROGRESS
              </div>

              <div className="pr-stat-number">
                {inProgressCount}
              </div>

              <small className="text-primary fw-semibold">
                Currently processing
              </small>
            </div>

            <div className="pr-stat-icon pr-stat-primary">
              <i className="bi bi-activity"></i>
            </div>

          </div>

        </div>

        <div className="col-xl-3 col-md-6">

          <div className="pr-stat-card">

            <div>
              <div className="pr-stat-label">
                COMPLETED
              </div>

              <div className="pr-stat-number">
                {completedCount}
              </div>

              <small className="text-success fw-semibold">
                Reports ready
              </small>
            </div>

            <div className="pr-stat-icon pr-stat-success">
              <i className="bi bi-check2-circle"></i>
            </div>

          </div>

        </div>

        <div className="col-xl-3 col-md-6">

          <div className="pr-stat-card">

            <div>
              <div className="pr-stat-label">
                CANCELLED
              </div>

              <div className="pr-stat-number">
                {cancelledCount}
              </div>

              <small className="text-muted">
                Closed requests
              </small>
            </div>

            <div className="pr-stat-icon pr-stat-danger">
              <i className="bi bi-x-circle"></i>
            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          MAIN PANEL
          ===================================================== */}

      <div className="pr-panel">

        {/* PANEL HEADER */}

        <div className="pr-panel-header">

          <div>

            <div className="pr-eyebrow">
              DOCTOR LAB REQUESTS
            </div>

            <h5 className="fw-bold mb-1">
              Patient Test Queue
            </h5>

            <small className="text-muted">
              Patient information is read-only. Only test status can be updated.
            </small>

          </div>

          <div className="pr-record-count">
            <i className="bi bi-people me-2"></i>
            {filteredRecords.length} Records
          </div>

        </div>

        {/* =====================================================
            SEARCH / FILTER
            ===================================================== */}

        <div className="pr-filter-area">

          <div className="pr-search-box">

            <i className="bi bi-search"></i>

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search Patient ID, Patient Name or Report ID..."
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
              >
                <i className="bi bi-x-circle-fill"></i>
              </button>
            )}

          </div>

          <select
            className="form-select pr-select"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="All">
              All Status
            </option>

            {statusOptions.map((status) => (
              <option
                key={status}
                value={status}
              >
                {status}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="btn btn-light rounded-4 pr-reset-button"
            onClick={resetFilters}
          >
            <i className="bi bi-arrow-counterclockwise me-2"></i>
            Reset
          </button>

        </div>

        {/* =====================================================
            TABLE
            ===================================================== */}

        <div className="table-responsive">

          <table className="table align-middle mb-0 pr-table">

            <thead>

              <tr>

                <th className="ps-4">
                  PATIENT
                </th>

                <th>
                  TEST
                </th>

                <th>
                  REQUESTED BY
                </th>

                <th>
                  REQUESTED
                </th>

                <th>
                  STATUS
                </th>

                <th className="text-end pe-4">
                  ACTIONS
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredRecords.map((record) => (

                <tr
                  key={record.id}
                  className="pr-table-row"
                >

                  {/* PATIENT */}

                  <td className="ps-4">

                    <div className="d-flex align-items-center gap-3">

                      <div className="pr-patient-avatar">
                        {getInitials(record.patientName)}
                      </div>

                      <div>

                        <div className="pr-patient-name">
                          {record.patientName}
                        </div>

                        <div className="pr-patient-meta">
                          {record.patientId}
                          <span>•</span>
                          {record.age} yrs
                          <span>•</span>
                          {record.gender}
                        </div>

                      </div>

                    </div>

                  </td>

                  {/* TEST */}

                  <td>

                    <div className="pr-test-name">
                      {record.testName}
                    </div>

                    <div className="pr-test-meta">
                      {record.testId}
                      <span>•</span>
                      {record.category}
                    </div>

                  </td>

                  {/* DOCTOR */}

                  <td>

                    <div className="pr-doctor">

                      <div className="pr-doctor-icon">
                        <i className="bi bi-person-badge"></i>
                      </div>

                      <div>
                        {record.doctor}
                      </div>

                    </div>

                  </td>

                  {/* DATE */}

                  <td>

                    <div className="pr-date">
                      <i className="bi bi-calendar3 me-1"></i>
                      {record.requestedDate}
                    </div>

                    <div className="pr-time">
                      {record.requestedTime}
                    </div>

                  </td>

                  {/* STATUS */}

                  <td>

                    <button
                      type="button"
                      className={`pr-status ${getStatusClass(
                        record.status
                      )}`}
                      onClick={() => openStatusModal(record)}
                      title="Update test status"
                    >

                      <span className="pr-status-dot"></span>

                      {record.status}

                    </button>

                  </td>

                  {/* ACTIONS */}

                  <td className="text-end pe-4">

                    <div className="pr-actions">

                      <button
                        type="button"
                        className="pr-action pr-action-view"
                        onClick={() => openViewModal(record)}
                        title="View patient record"
                      >
                        <i className="bi bi-eye"></i>
                      </button>

                      <button
                        type="button"
                        className="pr-action pr-action-status"
                        onClick={() => openStatusModal(record)}
                        title="Update test status"
                      >
                        <i className="bi bi-arrow-repeat"></i>
                      </button>

                      {record.status === "Completed" && (
                        <button
                          type="button"
                          className="pr-action pr-action-report"
                          title="Generate laboratory report"
                        >
                          <i className="bi bi-file-earmark-medical"></i>
                        </button>
                      )}

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {/* EMPTY STATE */}

          {filteredRecords.length === 0 && (

            <div className="pr-empty-state">

              <div className="pr-empty-icon">
                <i className="bi bi-person-x"></i>
              </div>

              <h5 className="fw-bold mt-3">
                Patient Record Not Found.
              </h5>

              <p className="text-muted mb-4">
                No patient record matches your current search or filter.
              </p>

              <button
                type="button"
                className="btn btn-light rounded-4 px-4"
                onClick={resetFilters}
              >
                <i className="bi bi-arrow-counterclockwise me-2"></i>
                Clear Filters
              </button>

            </div>

          )}

        </div>

        {/* PANEL FOOTER */}

        <div className="pr-panel-footer">

          <span>
            <i className="bi bi-lock-fill text-success me-2"></i>
            Patient details are protected and read-only
          </span>

          <span>
            Showing {filteredRecords.length} of {records.length} records
          </span>

        </div>

      </div>

      {/* =====================================================
          VIEW PATIENT MODAL
          ===================================================== */}

      {showViewModal && selectedRecord && (

        <div className="pr-modal-backdrop">

          <div className="pr-modal">

            <div className="pr-modal-header">

              <div className="d-flex align-items-center gap-3">

                <div className="pr-view-avatar">
                  {getInitials(selectedRecord.patientName)}
                </div>

                <div>

                  <h5 className="fw-bold mb-1">
                    {selectedRecord.patientName}
                  </h5>

                  <small className="text-muted">
                    {selectedRecord.patientId}
                  </small>

                </div>

              </div>

              <button
                type="button"
                className="pr-close-button"
                onClick={closeModals}
              >
                <i className="bi bi-x-lg"></i>
              </button>

            </div>

            <div className="pr-modal-body">

              <div className="pr-readonly-note">
                <i className="bi bi-lock-fill"></i>

                Patient information is automatically retrieved
                from the Doctor Module and cannot be edited here.
              </div>

              <div className="pr-section-title">
                Patient Information
              </div>

              <div className="pr-details-grid">

                <div className="pr-detail-item">
                  <span>Patient ID</span>
                  <strong>
                    {selectedRecord.patientId}
                  </strong>
                </div>

                <div className="pr-detail-item">
                  <span>Patient Name</span>
                  <strong>
                    {selectedRecord.patientName}
                  </strong>
                </div>

                <div className="pr-detail-item">
                  <span>Age</span>
                  <strong>
                    {selectedRecord.age} years
                  </strong>
                </div>

                <div className="pr-detail-item">
                  <span>Gender</span>
                  <strong>
                    {selectedRecord.gender}
                  </strong>
                </div>

              </div>

              <div className="pr-section-title mt-4">
                Laboratory Request
              </div>

              <div className="pr-details-grid">

                <div className="pr-detail-item">
                  <span>Report ID</span>
                  <strong>
                    {selectedRecord.id}
                  </strong>
                </div>

                <div className="pr-detail-item">
                  <span>Test ID</span>
                  <strong>
                    {selectedRecord.testId}
                  </strong>
                </div>

                <div className="pr-detail-item">
                  <span>Test Name</span>
                  <strong>
                    {selectedRecord.testName}
                  </strong>
                </div>

                <div className="pr-detail-item">
                  <span>Category</span>
                  <strong>
                    {selectedRecord.category}
                  </strong>
                </div>

                <div className="pr-detail-item">
                  <span>Sample</span>
                  <strong>
                    {selectedRecord.sample}
                  </strong>
                </div>

                <div className="pr-detail-item">
                  <span>Requested By</span>
                  <strong>
                    {selectedRecord.doctor}
                  </strong>
                </div>

                <div className="pr-detail-item">
                  <span>Requested Date</span>
                  <strong>
                    {selectedRecord.requestedDate}
                  </strong>
                </div>

                <div className="pr-detail-item">
                  <span>Requested Time</span>
                  <strong>
                    {selectedRecord.requestedTime}
                  </strong>
                </div>

                <div className="pr-detail-item pr-detail-full">

                  <span>
                    Current Test Status
                  </span>

                  <span
                    className={`pr-status ${getStatusClass(
                      selectedRecord.status
                    )}`}
                  >
                    <span className="pr-status-dot"></span>
                    {selectedRecord.status}
                  </span>

                </div>

              </div>

            </div>

            <div className="pr-modal-footer">

              <button
                type="button"
                className="btn btn-light rounded-4 px-4"
                onClick={closeModals}
              >
                Close
              </button>

              <button
                type="button"
                className="btn btn-primary rounded-4 px-4 fw-semibold"
                onClick={() => {
                  closeModals();
                  openStatusModal(selectedRecord);
                }}
              >
                <i className="bi bi-arrow-repeat me-2"></i>
                Update Status
              </button>

            </div>

          </div>

        </div>

      )}

      {/* =====================================================
          STATUS UPDATE MODAL
          ===================================================== */}

      {showStatusModal && editingRecord && (

        <div className="pr-modal-backdrop">

          <div className="pr-modal pr-status-modal">

            <div className="pr-modal-header">

              <div className="d-flex align-items-center gap-3">

                <div className="pr-modal-icon">
                  <i className="bi bi-arrow-repeat"></i>
                </div>

                <div>

                  <h5 className="fw-bold mb-1">
                    Update Test Status
                  </h5>

                  <small className="text-muted">
                    {editingRecord.testName}
                  </small>

                </div>

              </div>

              <button
                type="button"
                className="pr-close-button"
                onClick={closeModals}
              >
                <i className="bi bi-x-lg"></i>
              </button>

            </div>

            <div className="pr-modal-body">

              <div className="pr-status-patient">

                <div className="pr-patient-avatar">
                  {getInitials(editingRecord.patientName)}
                </div>

                <div>

                  <div className="fw-bold">
                    {editingRecord.patientName}
                  </div>

                  <small className="text-muted">
                    {editingRecord.patientId}
                    {" • "}
                    {editingRecord.id}
                  </small>

                </div>

              </div>

              <div className="pr-section-title mt-4">
                Select New Status
              </div>

              <div className="pr-status-list">

                {statusOptions.map((status) => (

                  <button
                    type="button"
                    key={status}
                    className={`pr-status-option ${
                      editStatus === status
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => setEditStatus(status)}
                  >

                    <span
                      className={`pr-status-option-icon ${getStatusClass(
                        status
                      )}`}
                    >
                      <i
                        className={`bi ${
                          status === "Pending"
                            ? "bi-hourglass-split"
                            : status === "In Progress"
                            ? "bi-activity"
                            : status === "Completed"
                            ? "bi-check-lg"
                            : "bi-x-lg"
                        }`}
                      ></i>
                    </span>

                    <div>

                      <div className="fw-semibold">
                        {status}
                      </div>

                      <small className="text-muted">

                        {status === "Pending" &&
                          "Test is waiting to be processed."}

                        {status === "In Progress" &&
                          "Technician is currently performing the test."}

                        {status === "Completed" &&
                          "Test is completed and report can be generated."}

                        {status === "Cancelled" &&
                          "Laboratory request has been cancelled."}

                      </small>

                    </div>

                    <span className="pr-radio-check">
                      {editStatus === status && (
                        <i className="bi bi-check"></i>
                      )}
                    </span>

                  </button>

                ))}

              </div>

            </div>

            <div className="pr-modal-footer">

              <button
                type="button"
                className="btn btn-light rounded-4 px-4"
                onClick={closeModals}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-primary rounded-4 px-4 fw-semibold"
                onClick={updateStatus}
              >
                <i className="bi bi-check-lg me-2"></i>
                Update Status
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default PatientRecords;
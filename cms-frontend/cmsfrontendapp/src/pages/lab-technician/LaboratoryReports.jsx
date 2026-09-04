import { useMemo, useState } from "react";
import "./LaboratoryReports.css";

const initialReports = [
  {
    id: "RPT001",
    patientId: "PAT003",
    patientName: "Vishnu Raj",
    age: 35,
    gender: "Male",
    testName: "Blood Glucose",
    testId: "LAB003",
    category: "Biochemistry",
    doctor: "Dr. Anjali Nair",
    result: "96 mg/dL",
    referenceRange: "70 - 100 mg/dL",
    resultStatus: "Normal",
    technician: "Lab Technician",
    reportDate: "03 Sep 2026",
    reportTime: "10:30 AM",
    remarks: "Blood glucose level is within the normal range.",
  },
  {
    id: "RPT002",
    patientId: "PAT005",
    patientName: "Nikhil Mohan",
    age: 29,
    gender: "Male",
    testName: "Thyroid Profile",
    testId: "LAB005",
    category: "Endocrinology",
    doctor: "Dr. Rahul Menon",
    result: "TSH: 2.4 mIU/L",
    referenceRange: "0.4 - 4.0 mIU/L",
    resultStatus: "Normal",
    technician: "Lab Technician",
    reportDate: "03 Sep 2026",
    reportTime: "11:15 AM",
    remarks: "Thyroid stimulating hormone level is within the expected range.",
  },
  {
    id: "RPT003",
    patientId: "PAT008",
    patientName: "Meera Thomas",
    age: 47,
    gender: "Female",
    testName: "Complete Blood Count",
    testId: "LAB001",
    category: "Hematology",
    doctor: "Dr. Priya Menon",
    result: "Hb: 11.8 g/dL",
    referenceRange: "12 - 16 g/dL",
    resultStatus: "Attention",
    technician: "Lab Technician",
    reportDate: "02 Sep 2026",
    reportTime: "04:20 PM",
    remarks: "Hemoglobin is slightly below the normal reference range.",
  },
  {
    id: "RPT004",
    patientId: "PAT010",
    patientName: "Arjun S",
    age: 52,
    gender: "Male",
    testName: "Lipid Profile",
    testId: "LAB004",
    category: "Biochemistry",
    doctor: "Dr. Vivek Kumar",
    result: "LDL: 142 mg/dL",
    referenceRange: "Below 100 mg/dL",
    resultStatus: "Abnormal",
    technician: "Lab Technician",
    reportDate: "02 Sep 2026",
    reportTime: "02:45 PM",
    remarks: "LDL cholesterol is above the recommended reference range.",
  },
];

const emptyForm = {
  id: "",
  patientId: "",
  patientName: "",
  age: "",
  gender: "",
  testName: "",
  testId: "",
  category: "",
  doctor: "",
  result: "",
  referenceRange: "",
  resultStatus: "Normal",
  technician: "Lab Technician",
  reportDate: "",
  reportTime: "",
  remarks: "",
};

const resultStatuses = ["Normal", "Attention", "Abnormal"];

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function LaboratoryReports() {
  const [reports, setReports] = useState(initialReports);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [selectedReport, setSelectedReport] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const filteredReports = useMemo(() => {
    const value = search.toLowerCase().trim();

    return reports.filter((report) => {
      const matchesSearch =
        !value ||
        report.id.toLowerCase().includes(value) ||
        report.patientName.toLowerCase().includes(value) ||
        report.testName.toLowerCase().includes(value);

      const matchesStatus =
        statusFilter === "All" || report.resultStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reports, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: reports.length,
      normal: reports.filter((r) => r.resultStatus === "Normal").length,
      attention: reports.filter((r) => r.resultStatus === "Attention").length,
      abnormal: reports.filter((r) => r.resultStatus === "Abnormal").length,
    };
  }, [reports]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      reportDate: new Date().toISOString().split("T")[0],
    });
    setErrors({});
    setShowForm(true);
  };

  const openEditModal = (report) => {
    setEditingId(report.id);
    setForm({
      ...report,
      reportDate: convertDisplayDateToInput(report.reportDate),
    });
    setErrors({});
    setShowForm(true);
  };

  const openViewModal = (report) => {
    setSelectedReport(report);
    setShowView(true);
  };

  const openDeleteModal = (report) => {
    setSelectedReport(report);
    setShowDelete(true);
  };

  const closeModals = () => {
    setShowForm(false);
    setShowView(false);
    setShowDelete(false);
    setSelectedReport(null);
    setEditingId(null);
    setErrors({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!/^RPT\d{3,}$/.test(form.id.trim())) {
      newErrors.id = "Use a valid Report ID such as RPT001.";
    }

    if (!form.patientId.trim()) {
      newErrors.patientId = "Patient ID is required.";
    }

    if (!form.patientName.trim()) {
      newErrors.patientName = "Patient name is required.";
    } else if (!/^[A-Za-z\s]+$/.test(form.patientName.trim())) {
      newErrors.patientName = "Patient name should contain letters only.";
    }

    if (!form.testName.trim()) {
      newErrors.testName = "Test name is required.";
    }

    if (!form.result.trim()) {
      newErrors.result = "Test result is required.";
    }

    if (!form.referenceRange.trim()) {
      newErrors.referenceRange = "Reference range is required.";
    }

    if (!form.reportDate) {
      newErrors.reportDate = "Report date is required.";
    }

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const duplicateId = reports.some(
      (report) =>
        report.id.toLowerCase() === form.id.trim().toLowerCase() &&
        report.id !== editingId,
    );

    if (duplicateId) {
      setErrors({
        id: "This Report ID already exists.",
      });
      return;
    }

    const formattedReport = {
      ...form,
      id: form.id.trim().toUpperCase(),
      patientId: form.patientId.trim().toUpperCase(),
      patientName: form.patientName.trim(),
      testName: form.testName.trim(),
      result: form.result.trim(),
      referenceRange: form.referenceRange.trim(),
      reportDate: formatDate(form.reportDate),
      reportTime:
        form.reportTime ||
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
    };

    if (editingId) {
      setReports((previous) =>
        previous.map((report) =>
          report.id === editingId ? formattedReport : report,
        ),
      );
    } else {
      setReports((previous) => [formattedReport, ...previous]);
    }

    closeModals();
  };

  const deleteReport = () => {
    if (!selectedReport) return;

    setReports((previous) =>
      previous.filter((report) => report.id !== selectedReport.id),
    );

    closeModals();
  };

  const printReport = (report) => {
    const printWindow = window.open("", "_blank", "width=900,height=700");

    if (!printWindow) {
      alert("Please allow pop-ups to print the report.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${report.id} - Laboratory Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              color: #1f2937;
            }

            .header {
              display: flex;
              justify-content: space-between;
              border-bottom: 2px solid #2563eb;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }

            h1 {
              margin: 0;
              color: #1d4ed8;
            }

            .subtitle {
              color: #64748b;
              margin-top: 5px;
            }

            .section {
              margin-top: 25px;
            }

            .section-title {
              font-size: 14px;
              font-weight: bold;
              text-transform: uppercase;
              color: #2563eb;
              margin-bottom: 10px;
            }

            .grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
            }

            .box {
              background: #f8fafc;
              padding: 12px;
              border-radius: 8px;
            }

            .label {
              font-size: 11px;
              color: #64748b;
            }

            .value {
              font-weight: 600;
              margin-top: 4px;
            }

            .result {
              border: 1px solid #dbeafe;
              padding: 20px;
              border-radius: 10px;
              margin-top: 15px;
            }

            .footer {
              margin-top: 60px;
              border-top: 1px solid #e2e8f0;
              padding-top: 15px;
              font-size: 12px;
              color: #64748b;
            }

            @media print {
              body {
                padding: 20px;
              }
            }
          </style>
        </head>

        <body>
          <div class="header">
            <div>
              <h1>Laboratory Report</h1>
              <div class="subtitle">Clinic Management System</div>
            </div>

            <div>
              <strong>${report.id}</strong><br/>
              ${report.reportDate}
            </div>
          </div>

          <div class="section">
            <div class="section-title">Patient Information</div>

            <div class="grid">
              <div class="box">
                <div class="label">Patient ID</div>
                <div class="value">${report.patientId}</div>
              </div>

              <div class="box">
                <div class="label">Patient Name</div>
                <div class="value">${report.patientName}</div>
              </div>

              <div class="box">
                <div class="label">Age</div>
                <div class="value">${report.age}</div>
              </div>

              <div class="box">
                <div class="label">Gender</div>
                <div class="value">${report.gender}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Test Information</div>

            <div class="grid">
              <div class="box">
                <div class="label">Test Name</div>
                <div class="value">${report.testName}</div>
              </div>

              <div class="box">
                <div class="label">Test ID</div>
                <div class="value">${report.testId}</div>
              </div>

              <div class="box">
                <div class="label">Doctor</div>
                <div class="value">${report.doctor}</div>
              </div>

              <div class="box">
                <div class="label">Technician</div>
                <div class="value">${report.technician}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Test Result</div>

            <div class="result">
              <div class="grid">
                <div>
                  <div class="label">Result</div>
                  <div class="value">${report.result}</div>
                </div>

                <div>
                  <div class="label">Reference Range</div>
                  <div class="value">${report.referenceRange}</div>
                </div>

                <div>
                  <div class="label">Result Status</div>
                  <div class="value">${report.resultStatus}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Remarks</div>
            <div>${report.remarks || "No additional remarks."}</div>
          </div>

          <div class="footer">
            Generated by ${report.technician} on ${report.reportDate} at ${report.reportTime}.
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <div className="lab-reports-page min-vh-100">
      <div className="container-fluid px-4 px-xl-5 py-4">
        {/* Header */}
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4 lab-reports-animate">
          <div>
            <div className="text-secondary small mb-2">
              <i className="bi bi-grid-1x2-fill me-2"></i>
              Lab Technician
              <span className="mx-2">/</span>
              Laboratory Reports
            </div>

            <div className="d-flex align-items-center gap-3">
              <div className="report-title-icon">
                <i className="bi bi-file-earmark-medical"></i>
              </div>

              <div>
                <h2 className="fw-bold mb-1">Laboratory Reports</h2>
                <p className="text-secondary mb-0">
                  Generate, manage and print completed laboratory reports.
                </p>
              </div>
            </div>
          </div>

          <button
            className="btn btn-primary rounded-pill px-4 py-3 shadow-sm"
            onClick={openCreateModal}
          >
            <i className="bi bi-file-earmark-plus me-2"></i>
            Generate Report
          </button>
        </div>

        {/* Statistics */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="report-stat-card h-100">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-secondary small">Total Reports</div>
                  <h3 className="fw-bold mb-0 mt-2">{stats.total}</h3>
                </div>

                <div className="report-stat-icon bg-primary-subtle text-primary">
                  <i className="bi bi-files"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="report-stat-card h-100">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-secondary small">Normal</div>
                  <h3 className="fw-bold mb-0 mt-2">{stats.normal}</h3>
                </div>

                <div className="report-stat-icon bg-success-subtle text-success">
                  <i className="bi bi-check-circle"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="report-stat-card h-100">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-secondary small">Attention</div>
                  <h3 className="fw-bold mb-0 mt-2">{stats.attention}</h3>
                </div>

                <div className="report-stat-icon bg-warning-subtle text-warning">
                  <i className="bi bi-exclamation-circle"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="report-stat-card h-100">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-secondary small">Abnormal</div>
                  <h3 className="fw-bold mb-0 mt-2">{stats.abnormal}</h3>
                </div>

                <div className="report-stat-icon bg-danger-subtle text-danger">
                  <i className="bi bi-exclamation-triangle"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main panel */}
        <div className="report-panel">
          <div className="report-panel-header">
            <div>
              <h5 className="fw-bold mb-1">Generated Reports</h5>
              <p className="text-secondary small mb-0">
                Manage completed laboratory test reports.
              </p>
            </div>

            <span className="badge rounded-pill text-bg-light border px-3 py-2">
              {filteredReports.length} Reports
            </span>
          </div>

          {/* Filters */}
          <div className="p-4 border-bottom">
            <div className="row g-3">
              <div className="col-12 col-lg-7">
                <div className="input-group report-search">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-search text-secondary"></i>
                  </span>

                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search Report ID, Patient Name or Test Name..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-3">
                <select
                  className="form-select report-select"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <option value="All">All Results</option>
                  {resultStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-6 col-lg-2">
                <button
                  className="btn btn-light border w-100 h-100"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                  }}
                >
                  <i className="bi bi-arrow-counterclockwise me-2"></i>
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table align-middle mb-0 report-table">
              <thead>
                <tr>
                  <th>REPORT</th>
                  <th>PATIENT</th>
                  <th>TEST</th>
                  <th>RESULT</th>
                  <th>DATE</th>
                  <th>STATUS</th>
                  <th className="text-end">ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div className="report-file-icon">
                          <i className="bi bi-file-earmark-medical"></i>
                        </div>

                        <div>
                          <div className="fw-bold">{report.id}</div>
                          <div className="small text-secondary">
                            {report.testId}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="patient-avatar">
                          {getInitials(report.patientName)}
                        </div>

                        <div>
                          <div className="fw-semibold">
                            {report.patientName}
                          </div>

                          <div className="small text-secondary">
                            {report.patientId} · {report.age} yrs
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="fw-semibold">{report.testName}</div>

                      <div className="small text-secondary">
                        {report.category}
                      </div>
                    </td>

                    <td>
                      <div className="fw-semibold">{report.result}</div>

                      <div className="small text-secondary">
                        Ref: {report.referenceRange}
                      </div>
                    </td>

                    <td>
                      <div className="fw-semibold">{report.reportDate}</div>

                      <div className="small text-secondary">
                        {report.reportTime}
                      </div>
                    </td>

                    <td>
                      <span
                        className={`report-status report-status-${report.resultStatus
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        <span className="status-dot"></span>
                        {report.resultStatus}
                      </span>
                    </td>

                    <td>
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          className="btn btn-light report-action"
                          title="View Report"
                          onClick={() => openViewModal(report)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>

                        <button
                          className="btn btn-light report-action"
                          title="Edit Report"
                          onClick={() => openEditModal(report)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>

                        <button
                          className="btn btn-light report-action"
                          title="Print Report"
                          onClick={() => printReport(report)}
                        >
                          <i className="bi bi-printer"></i>
                        </button>

                        <button
                          className="btn btn-light report-action report-delete-action"
                          title="Delete Report"
                          onClick={() => openDeleteModal(report)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredReports.length === 0 && (
              <div className="report-empty-state">
                <div className="report-empty-icon">
                  <i className="bi bi-file-earmark-x"></i>
                </div>

                <h5 className="fw-bold mt-3">Report Not Found.</h5>

                <p className="text-secondary mb-0">
                  No laboratory report matches your current search or filter.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {showForm && (
        <div className="report-modal-backdrop">
          <div className="report-modal report-large-modal">
            <div className="report-modal-header">
              <div>
                <div className="d-flex align-items-center gap-3">
                  <div className="report-modal-icon">
                    <i className="bi bi-file-earmark-medical"></i>
                  </div>

                  <div>
                    <h5 className="fw-bold mb-1">
                      {editingId
                        ? "Update Laboratory Report"
                        : "Generate Laboratory Report"}
                    </h5>

                    <p className="text-secondary small mb-0">
                      Enter verified laboratory test results.
                    </p>
                  </div>
                </div>
              </div>

              <button className="btn-close" onClick={closeModals}></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="report-modal-body">
                <div className="report-section-title">
                  <i className="bi bi-person-vcard me-2"></i>
                  Patient Information
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <label className="form-label">Report ID *</label>
                    <input
                      name="id"
                      value={form.id}
                      onChange={handleChange}
                      className={`form-control ${
                        errors.id ? "is-invalid" : ""
                      }`}
                      placeholder="RPT001"
                      disabled={Boolean(editingId)}
                    />
                    {errors.id && (
                      <div className="invalid-feedback">{errors.id}</div>
                    )}
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Patient ID *</label>
                    <input
                      name="patientId"
                      value={form.patientId}
                      onChange={handleChange}
                      className={`form-control ${
                        errors.patientId ? "is-invalid" : ""
                      }`}
                      placeholder="PAT001"
                    />
                    {errors.patientId && (
                      <div className="invalid-feedback">{errors.patientId}</div>
                    )}
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Patient Name *</label>
                    <input
                      name="patientName"
                      value={form.patientName}
                      onChange={handleChange}
                      className={`form-control ${
                        errors.patientName ? "is-invalid" : ""
                      }`}
                      placeholder="Patient Name"
                    />
                    {errors.patientName && (
                      <div className="invalid-feedback">
                        {errors.patientName}
                      </div>
                    )}
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Age</label>
                    <input
                      name="age"
                      type="number"
                      value={form.age}
                      onChange={handleChange}
                      className="form-control"
                      min="0"
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Gender</label>
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Select</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Doctor</label>
                    <input
                      name="doctor"
                      value={form.doctor}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Requesting Doctor"
                    />
                  </div>
                </div>

                <div className="report-section-title">
                  <i className="bi bi-eyedropper me-2"></i>
                  Test Information
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label">Test Name *</label>
                    <input
                      name="testName"
                      value={form.testName}
                      onChange={handleChange}
                      className={`form-control ${
                        errors.testName ? "is-invalid" : ""
                      }`}
                      placeholder="Complete Blood Count"
                    />
                    {errors.testName && (
                      <div className="invalid-feedback">{errors.testName}</div>
                    )}
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Test ID</label>
                    <input
                      name="testId"
                      value={form.testId}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="LAB001"
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Category</label>
                    <input
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Hematology"
                    />
                  </div>
                </div>

                <div className="report-section-title">
                  <i className="bi bi-clipboard2-pulse me-2"></i>
                  Result Details
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Test Result *</label>
                    <input
                      name="result"
                      value={form.result}
                      onChange={handleChange}
                      className={`form-control ${
                        errors.result ? "is-invalid" : ""
                      }`}
                      placeholder="Example: 96 mg/dL"
                    />
                    {errors.result && (
                      <div className="invalid-feedback">{errors.result}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Reference Range *</label>
                    <input
                      name="referenceRange"
                      value={form.referenceRange}
                      onChange={handleChange}
                      className={`form-control ${
                        errors.referenceRange ? "is-invalid" : ""
                      }`}
                      placeholder="Example: 70 - 100 mg/dL"
                    />
                    {errors.referenceRange && (
                      <div className="invalid-feedback">
                        {errors.referenceRange}
                      </div>
                    )}
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Result Status</label>
                    <select
                      name="resultStatus"
                      value={form.resultStatus}
                      onChange={handleChange}
                      className="form-select"
                    >
                      {resultStatuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Report Date *</label>
                    <input
                      name="reportDate"
                      type="date"
                      value={form.reportDate}
                      onChange={handleChange}
                      className={`form-control ${
                        errors.reportDate ? "is-invalid" : ""
                      }`}
                    />
                    {errors.reportDate && (
                      <div className="invalid-feedback">
                        {errors.reportDate}
                      </div>
                    )}
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Report Time</label>
                    <input
                      name="reportTime"
                      type="time"
                      value={form.reportTime}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Remarks</label>
                    <textarea
                      name="remarks"
                      value={form.remarks}
                      onChange={handleChange}
                      className="form-control"
                      rows="3"
                      placeholder="Additional laboratory observations..."
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="report-modal-footer">
                <button
                  type="button"
                  className="btn btn-light border rounded-pill px-4"
                  onClick={closeModals}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary rounded-pill px-4"
                >
                  <i
                    className={`bi ${
                      editingId ? "bi-check2-circle" : "bi-file-earmark-plus"
                    } me-2`}
                  ></i>

                  {editingId ? "Save Changes" : "Generate Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {showView && selectedReport && (
        <div className="report-modal-backdrop">
          <div className="report-modal report-view-modal">
            <div className="report-modal-header">
              <div className="d-flex align-items-center gap-3">
                <div className="report-modal-icon">
                  <i className="bi bi-file-earmark-medical"></i>
                </div>

                <div>
                  <h5 className="fw-bold mb-1">Laboratory Report</h5>

                  <div className="small text-secondary">
                    {selectedReport.id}
                  </div>
                </div>
              </div>

              <button className="btn-close" onClick={closeModals}></button>
            </div>

            <div className="report-modal-body">
              <div className="report-preview">
                <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-4">
                  <div>
                    <h4 className="fw-bold mb-1">Laboratory Report</h4>

                    <div className="text-secondary">
                      Clinic Management System
                    </div>
                  </div>

                  <div className="text-end">
                    <div className="fw-bold text-primary">
                      {selectedReport.id}
                    </div>

                    <small className="text-secondary">
                      {selectedReport.reportDate}
                    </small>
                  </div>
                </div>

                <div className="report-preview-section">
                  <div className="report-preview-heading">
                    Patient Information
                  </div>

                  <div className="row g-3">
                    <Detail
                      label="Patient ID"
                      value={selectedReport.patientId}
                    />

                    <Detail
                      label="Patient Name"
                      value={selectedReport.patientName}
                    />

                    <Detail label="Age" value={`${selectedReport.age} years`} />

                    <Detail label="Gender" value={selectedReport.gender} />
                  </div>
                </div>

                <div className="report-preview-section">
                  <div className="report-preview-heading">Test Information</div>

                  <div className="row g-3">
                    <Detail label="Test Name" value={selectedReport.testName} />

                    <Detail label="Test ID" value={selectedReport.testId} />

                    <Detail label="Category" value={selectedReport.category} />

                    <Detail label="Doctor" value={selectedReport.doctor} />
                  </div>
                </div>

                <div className="report-result-box">
                  <div className="report-preview-heading">Test Result</div>

                  <div className="row g-3">
                    <Detail label="Result" value={selectedReport.result} />

                    <Detail
                      label="Reference Range"
                      value={selectedReport.referenceRange}
                    />

                    <div className="col-md-4">
                      <div className="small text-secondary mb-1">
                        Result Status
                      </div>

                      <span
                        className={`report-status report-status-${selectedReport.resultStatus
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        <span className="status-dot"></span>
                        {selectedReport.resultStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="report-preview-section">
                  <div className="report-preview-heading">Remarks</div>

                  <p className="mb-0 text-secondary">
                    {selectedReport.remarks || "No additional remarks."}
                  </p>
                </div>

                <div className="report-signature">
                  <div>
                    <strong>{selectedReport.technician}</strong>
                    <div className="small text-secondary">
                      Laboratory Technician
                    </div>
                  </div>

                  <div className="text-end">
                    <div className="small text-secondary">Generated</div>

                    <strong>{selectedReport.reportDate}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="report-modal-footer">
              <button
                className="btn btn-light border rounded-pill px-4"
                onClick={closeModals}
              >
                Close
              </button>

              <button
                className="btn btn-primary rounded-pill px-4"
                onClick={() => printReport(selectedReport)}
              >
                <i className="bi bi-printer me-2"></i>
                Print Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDelete && selectedReport && (
        <div className="report-modal-backdrop">
          <div className="report-modal report-delete-modal">
            <div className="report-delete-icon">
              <i className="bi bi-trash3"></i>
            </div>

            <h5 className="fw-bold mt-3">Delete Laboratory Report?</h5>

            <p className="text-secondary">
              Are you sure you want to delete{" "}
              <strong>{selectedReport.id}</strong> for{" "}
              <strong>{selectedReport.patientName}</strong>? This action cannot
              be undone.
            </p>

            <div className="d-flex justify-content-center gap-2 mt-4">
              <button
                className="btn btn-light border rounded-pill px-4"
                onClick={closeModals}
              >
                Cancel
              </button>

              <button
                className="btn btn-danger rounded-pill px-4"
                onClick={deleteReport}
              >
                <i className="bi bi-trash3 me-2"></i>
                Delete Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="col-md-6">
      <div className="small text-secondary mb-1">{label}</div>

      <div className="fw-semibold">{value || "—"}</div>
    </div>
  );
}

function formatDate(date) {
  if (!date) return "";

  const [year, month, day] = date.split("-");

  return `${day} ${new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
  ).toLocaleString("en-US", {
    month: "short",
  })} ${year}`;
}

function convertDisplayDateToInput(date) {
  if (!date) return "";

  const parts = date.split(" ");

  if (parts.length !== 3) return "";

  const [day, monthText, year] = parts;

  const month = new Date(`${monthText} 1, ${year}`).getMonth() + 1;

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
    2,
    "0",
  )}`;
}

export default LaboratoryReports;

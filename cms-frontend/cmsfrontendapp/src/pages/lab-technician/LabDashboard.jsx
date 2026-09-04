import React from "react";
import { useNavigate } from "react-router-dom";

import "./LabDashboard.css";

const LabDashboard = () => {
  const navigate = useNavigate();

  // Current user
  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    user = {};
  }

  const username = user.username || "Lab Technician";

  return (
    <div className="lab-dashboard-page">
      {/* ================= HERO ================= */}

      <section className="lab-hero mb-4">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <div className="lab-hero-label">
              <i className="bi bi-stars me-2"></i>
              Laboratory Operations
            </div>

            <h1>Good morning, {username}.</h1>

            <p>
              Manage laboratory tests, patient records, reports and billing from
              one centralized workspace.
            </p>

            <div className="d-flex flex-wrap gap-2 mt-4">
              <button
                type="button"
                className="btn btn-light px-4"
                onClick={() => navigate("/lab-technician/tests")}
              >
                <i className="bi bi-clipboard2-pulse me-2"></i>
                Process Tests
              </button>

              <button
                type="button"
                className="btn btn-outline-light px-4"
                onClick={() => navigate("/lab-technician/reports")}
              >
                <i className="bi bi-file-earmark-medical me-2"></i>
                View Reports
              </button>
            </div>
          </div>

          <div className="col-lg-4 d-none d-lg-block">
            <div className="lab-hero-visual">
              <div className="lab-floating-icon icon-one">
                <i className="bi bi-droplet-half"></i>
              </div>

              <div className="lab-floating-icon icon-two">
                <i className="bi bi-heart-pulse"></i>
              </div>

              <div className="lab-floating-icon icon-three">
                <i className="bi bi-eyedropper"></i>
              </div>

              <div className="lab-hero-circle">
                <i className="bi bi-microscope"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= KPI CARDS ================= */}

      <section className="row g-4 mb-4">
        <div className="col-xl-3 col-md-6">
          <div className="lab-stat-card">
            <div className="lab-stat-icon">
              <i className="bi bi-hourglass-split"></i>
            </div>

            <div>
              <small>Pending Tests</small>
              <h3>12</h3>

              <span className="lab-stat-change">
                <i className="bi bi-arrow-up"></i>
                8% from yesterday
              </span>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="lab-stat-card">
            <div className="lab-stat-icon">
              <i className="bi bi-activity"></i>
            </div>

            <div>
              <small>In Progress</small>
              <h3>04</h3>

              <span className="lab-stat-change">Active now</span>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="lab-stat-card">
            <div className="lab-stat-icon">
              <i className="bi bi-check2-circle"></i>
            </div>

            <div>
              <small>Completed Today</small>
              <h3>28</h3>

              <span className="lab-stat-change">
                <i className="bi bi-arrow-up"></i>
                12% from yesterday
              </span>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="lab-stat-card">
            <div className="lab-stat-icon">
              <i className="bi bi-currency-rupee"></i>
            </div>

            <div>
              <small>Today's Revenue</small>
              <h3>₹8,450</h3>

              <span className="lab-stat-change">
                <i className="bi bi-arrow-up"></i>
                6.4% today
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= QUICK ACTIONS ================= */}

      <section className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="fw-bold mb-1">Quick Actions</h5>

            <p className="text-muted mb-0 small">
              Frequently used laboratory operations
            </p>
          </div>
        </div>

        <div className="row g-3">
          {/* Patient Records */}

          <div className="col-lg-3 col-md-6">
            <button
              type="button"
              className="lab-action-card w-100 text-start"
              onClick={() => navigate("/lab-technician/patients")}
            >
              <div className="lab-action-icon">
                <i className="bi bi-people"></i>
              </div>

              <h6>Patient Records</h6>

              <p>View requested laboratory tests.</p>

              <span>
                Open Records
                <i className="bi bi-arrow-right ms-2"></i>
              </span>
            </button>
          </div>

          {/* Manage Tests */}

          <div className="col-lg-3 col-md-6">
            <button
              type="button"
              className="lab-action-card w-100 text-start"
              onClick={() => navigate("/lab-technician/tests")}
            >
              <div className="lab-action-icon">
                <i className="bi bi-clipboard2-pulse"></i>
              </div>

              <h6>Manage Tests</h6>

              <p>Add and manage laboratory tests.</p>

              <span>
                Manage Tests
                <i className="bi bi-arrow-right ms-2"></i>
              </span>
            </button>
          </div>

          {/* Reports */}

          <div className="col-lg-3 col-md-6">
            <button
              type="button"
              className="lab-action-card w-100 text-start"
              onClick={() => navigate("/lab-technician/reports")}
            >
              <div className="lab-action-icon">
                <i className="bi bi-file-earmark-medical"></i>
              </div>

              <h6>Generate Report</h6>

              <p>Create reports for completed tests.</p>

              <span>
                View Reports
                <i className="bi bi-arrow-right ms-2"></i>
              </span>
            </button>
          </div>

          {/* Billing */}

          <div className="col-lg-3 col-md-6">
            <button
              type="button"
              className="lab-action-card w-100 text-start"
              onClick={() => navigate("/lab-technician/billing")}
            >
              <div className="lab-action-icon">
                <i className="bi bi-receipt"></i>
              </div>

              <h6>Create Bill</h6>

              <p>Generate bills and record payments.</p>

              <span>
                Open Billing
                <i className="bi bi-arrow-right ms-2"></i>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= RECENT TEST REQUESTS + WORKLOAD ================= */}

      <section className="row g-4">
        {/* Recent Test Requests */}

        <div className="col-xl-8">
          <div className="lab-panel">
            <div className="lab-panel-header">
              <div>
                <h5 className="fw-bold mb-1">Recent Test Requests</h5>

                <p className="text-muted small mb-0">
                  Latest requests received from doctors
                </p>
              </div>

              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={() => navigate("/lab-technician/patients")}
              >
                View All
              </button>
            </div>

            <div className="table-responsive">
              <table className="table lab-table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Patient</th>
                    <th>Test</th>
                    <th>Doctor</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td className="fw-semibold">LR001</td>

                    <td>
                      <div className="fw-semibold">Arun Kumar</div>

                      <small>PAT001</small>
                    </td>

                    <td>Complete Blood Count</td>

                    <td>Dr. Rajesh</td>

                    <td>
                      <span className="lab-status pending">Pending</span>
                    </td>
                  </tr>

                  <tr>
                    <td className="fw-semibold">LR002</td>

                    <td>
                      <div className="fw-semibold">Meera Nair</div>

                      <small>PAT002</small>
                    </td>

                    <td>Liver Function Test</td>

                    <td>Dr. Anitha</td>

                    <td>
                      <span className="lab-status progress">In Progress</span>
                    </td>
                  </tr>

                  <tr>
                    <td className="fw-semibold">LR003</td>

                    <td>
                      <div className="fw-semibold">Vishnu Raj</div>

                      <small>PAT003</small>
                    </td>

                    <td>Blood Glucose</td>

                    <td>Dr. Suresh</td>

                    <td>
                      <span className="lab-status completed">Completed</span>
                    </td>
                  </tr>

                  <tr>
                    <td className="fw-semibold">LR004</td>

                    <td>
                      <div className="fw-semibold">Anjali S</div>

                      <small>PAT004</small>
                    </td>

                    <td>Lipid Profile</td>

                    <td>Dr. Priya</td>

                    <td>
                      <span className="lab-status pending">Pending</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Workload */}

        <div className="col-xl-4">
          <div className="lab-panel h-100">
            <div className="lab-panel-header">
              <div>
                <h5 className="fw-bold mb-1">Today's Workload</h5>

                <p className="text-muted small mb-0">Laboratory activity</p>
              </div>
            </div>

            <div className="lab-workload-circle">
              <div className="lab-circle-inner">
                <strong>72%</strong>
                <span>Completed</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="d-flex justify-content-between mb-2">
                <span className="small">Pending</span>
                <strong className="small">12</strong>
              </div>

              <div className="progress mb-3">
                <div className="progress-bar" style={{ width: "30%" }}></div>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span className="small">In Progress</span>
                <strong className="small">04</strong>
              </div>

              <div className="progress mb-3">
                <div className="progress-bar" style={{ width: "15%" }}></div>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span className="small">Completed</span>
                <strong className="small">28</strong>
              </div>

              <div className="progress">
                <div className="progress-bar" style={{ width: "72%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ACTIVITY + SECURITY ================= */}

      <section className="row g-4 mt-1">
        {/* Recent Activity */}

        <div className="col-lg-7">
          <div className="lab-panel">
            <div className="lab-panel-header">
              <div>
                <h5 className="fw-bold mb-1">Recent Activity</h5>

                <p className="text-muted small mb-0">
                  Latest laboratory operations
                </p>
              </div>
            </div>

            <div className="lab-timeline">
              <div className="lab-timeline-item">
                <div className="lab-timeline-icon">
                  <i className="bi bi-check-lg"></i>
                </div>

                <div>
                  <strong>Blood Glucose test completed</strong>

                  <small>Patient PAT003 · 10 minutes ago</small>
                </div>
              </div>

              <div className="lab-timeline-item">
                <div className="lab-timeline-icon">
                  <i className="bi bi-file-earmark-text"></i>
                </div>

                <div>
                  <strong>Laboratory report generated</strong>

                  <small>Report REP003 · 24 minutes ago</small>
                </div>
              </div>

              <div className="lab-timeline-item">
                <div className="lab-timeline-icon">
                  <i className="bi bi-credit-card"></i>
                </div>

                <div>
                  <strong>Payment received</strong>

                  <small>Bill BILL002 · 42 minutes ago</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security */}

        <div className="col-lg-5">
          <div className="lab-panel h-100">
            <div className="lab-security-box">
              <div className="lab-security-icon">
                <i className="bi bi-shield-check"></i>
              </div>

              <div>
                <h6 className="fw-bold">System Security</h6>

                <p className="small text-muted mb-2">
                  Your laboratory session is secure.
                </p>

                <span className="lab-security-status">
                  <i className="bi bi-circle-fill me-1"></i>
                  Secure Connection
                </span>
              </div>
            </div>

            <hr />

            <div className="d-flex justify-content-between mb-2">
              <span className="small text-muted">Session</span>

              <strong className="small">Active</strong>
            </div>

            <div className="d-flex justify-content-between">
              <span className="small text-muted">Access Level</span>

              <strong className="small">Laboratory</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LabDashboard;

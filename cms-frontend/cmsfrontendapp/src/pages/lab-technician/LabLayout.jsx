import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./LabLayout.css";

const LabLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const menuItems = [
    {
      label: "Dashboard",
      icon: "bi-speedometer2",
      path: "/lab-technician",
    },
    {
      label: "Test Management",
      icon: "bi-clipboard2-pulse",
      path: "/lab-technician/tests",
    },
    {
      label: "Patient Records",
      icon: "bi-people",
      path: "/lab-technician/patients",
    },
    {
      label: "Laboratory Reports",
      icon: "bi-file-earmark-medical",
      path: "/lab-technician/reports",
    },
    {
      label: "Laboratory Billing",
      icon: "bi-receipt",
      path: "/lab-technician/billing",
    },
  ];

  const isActive = (path) => {
    if (path === "/lab-technician") {
      return location.pathname === "/lab-technician";
    }

    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    navigate("/login");
  };

  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    user = {};
  }

  const username = user.username || "Lab Technician";
  const staffId = user.staff_id || "LAB-TECH";

  return (
    <div className="lab-layout">
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="lab-sidebar">
        {/* Logo */}
        <div className="lab-sidebar-logo">
          <div className="lab-logo-icon">
            <i className="bi bi-heart-pulse-fill"></i>
          </div>

          <div>
            <h5 className="mb-0">CMS</h5>
            <small>Clinic Management</small>
          </div>
        </div>

        {/* Navigation */}
        <div className="lab-sidebar-section">
          <small className="lab-sidebar-heading">LABORATORY</small>

          <nav className="lab-sidebar-nav">
            {menuItems.map((item) => (
              <button
                key={item.path}
                type="button"
                className={`lab-sidebar-item ${
                  isActive(item.path) ? "active" : ""
                }`}
                onClick={() => navigate(item.path)}
              >
                <span className="lab-sidebar-icon">
                  <i className={`bi ${item.icon}`}></i>
                </span>

                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* System Status */}
        <div className="lab-system-card mt-auto">
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="lab-online-dot"></span>

            <span className="fw-semibold">Laboratory Online</span>
          </div>

          <small>All laboratory services are operational.</small>
        </div>

        {/* User */}
        <div className="lab-sidebar-user">
          <div className="lab-user-avatar">
            {username.charAt(0).toUpperCase()}
          </div>

          <div className="flex-grow-1 overflow-hidden">
            <div className="fw-semibold text-truncate">{username}</div>

            <small className="text-truncate d-block">{staffId}</small>
          </div>

          <button
            type="button"
            className="btn btn-sm text-white"
            onClick={handleLogout}
            title="Logout"
          >
            <i className="bi bi-box-arrow-right"></i>
          </button>
        </div>
      </aside>

      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <main className="lab-main">
        {/* ===================================================
            TOP NAVBAR
        =================================================== */}

        <header className="lab-topbar">
          <div>
            <div className="lab-breadcrumb">
              Clinic Management
              <i className="bi bi-chevron-right mx-2"></i>
              Laboratory
              <i className="bi bi-chevron-right mx-2"></i>
              <span>
                {location.pathname === "/lab-technician"
                  ? "Dashboard"
                  : location.pathname.includes("/tests")
                    ? "Test Management"
                    : location.pathname.includes("/patients")
                      ? "Patient Records"
                      : location.pathname.includes("/reports")
                        ? "Laboratory Reports"
                        : location.pathname.includes("/billing")
                          ? "Laboratory Billing"
                          : "Laboratory"}
              </span>
            </div>

            <h4 className="mb-0 fw-bold">
              {location.pathname === "/lab-technician"
                ? "Laboratory Dashboard"
                : location.pathname.includes("/tests")
                  ? "Test Management"
                  : location.pathname.includes("/patients")
                    ? "Patient Records"
                    : location.pathname.includes("/reports")
                      ? "Laboratory Reports"
                      : location.pathname.includes("/billing")
                        ? "Laboratory Billing"
                        : "Laboratory"}
            </h4>
          </div>

          {/* Right Side */}
          <div className="d-flex align-items-center gap-3">
            {/* Search */}
            <button type="button" className="lab-topbar-icon" title="Search">
              <i className="bi bi-search"></i>
            </button>

            {/* Notifications */}
            <div className="position-relative">
              <button
                type="button"
                className="lab-topbar-icon position-relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <i className="bi bi-bell"></i>

                <span className="lab-notification-dot"></span>
              </button>

              {showNotifications && (
                <div className="lab-dropdown lab-notification-dropdown">
                  <h6 className="fw-bold mb-3">Notifications</h6>

                  <div className="lab-notification-item">
                    <div className="lab-notification-icon">
                      <i className="bi bi-clipboard-check"></i>
                    </div>

                    <div>
                      <strong>New test request</strong>

                      <small>CBC requested for patient PAT006.</small>
                    </div>
                  </div>

                  <div className="lab-notification-item">
                    <div className="lab-notification-icon">
                      <i className="bi bi-check-circle"></i>
                    </div>

                    <div>
                      <strong>Test completed</strong>

                      <small>Thyroid Profile completed.</small>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="position-relative">
              <button
                type="button"
                className="lab-profile-button"
                onClick={() => setShowProfile(!showProfile)}
              >
                <div className="lab-profile-avatar">
                  {username.charAt(0).toUpperCase()}
                </div>

                <div className="d-none d-md-block text-start">
                  <div className="fw-semibold">{username}</div>

                  <small>Lab Technician</small>
                </div>

                <i className="bi bi-chevron-down ms-2"></i>
              </button>

              {showProfile && (
                <div className="lab-dropdown lab-profile-dropdown">
                  <div className="mb-3">
                    <small className="text-muted">Logged in as</small>

                    <div className="fw-bold">{username}</div>

                    <small>{staffId}</small>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm w-100"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ===================================================
            PAGE CONTENT

            Outlet automatically loads:
            Dashboard
            Test Management
            Patient Records
            Reports
            Billing
        =================================================== */}

        <div className="lab-page-content">
          <Outlet />
        </div>

        {/* Footer */}
        <footer className="lab-footer">
          <span>© 2026 Clinic Management System</span>

          <span>Laboratory Module</span>
        </footer>
      </main>
    </div>
  );
};

export default LabLayout;

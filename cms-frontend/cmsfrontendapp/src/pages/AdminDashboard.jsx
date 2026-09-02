function AdminDashboard() {
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <div className="admin-layout">

      {/* Sidebar */}
      <aside className="admin-sidebar">

        <div className="sidebar-header">
          <h2>CMS</h2>
          <p>Admin Panel</p>
        </div>

        <nav className="sidebar-menu">

          <button className="sidebar-item active">
            Dashboard
          </button>

          <button className="sidebar-item">
            Staff
          </button>

          <button className="sidebar-item">
            Medicines
          </button>

          <button className="sidebar-item">
            Lab Tests
          </button>

        </nav>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </aside>


      {/* Main Content */}
      <main className="admin-main">

        <header className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Clinic Management System</p>
          </div>

          <div className="admin-user">
            <span>Admin</span>
          </div>
        </header>


        {/* Dashboard Content */}
        <section className="dashboard-content">

          <h2>Overview</h2>

          <div className="dashboard-cards">

            <div className="dashboard-card">
              <h3>Staff</h3>
              <p>Manage clinic staff</p>
              <strong>0</strong>
            </div>

            <div className="dashboard-card">
              <h3>Medicines</h3>
              <p>Manage medicine master</p>
              <strong>0</strong>
            </div>

            <div className="dashboard-card">
              <h3>Lab Tests</h3>
              <p>Manage lab test master</p>
              <strong>0</strong>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;
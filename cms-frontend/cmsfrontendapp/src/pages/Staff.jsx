import { useEffect, useState } from "react";

function Staff() {
  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add Staff form
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "RECEPTIONIST",
    department: "",
    consultation_fee: "",
    is_active: true,
  });

  // =========================
  // LOAD DATA WHEN PAGE OPENS
  // =========================

  useEffect(() => {
    fetchStaff();
    fetchDepartments();
  }, []);

  // =========================
  // FETCH STAFF
  // =========================

  const fetchStaff = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/admin/staff/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError("Unable to load staff.");
        setLoading(false);
        return;
      }

      setStaff(data);
    } catch (error) {
      console.error("STAFF ERROR:", error);
      setError("Unable to connect to the server.");
    }

    setLoading(false);
  };

  // =========================
  // FETCH DEPARTMENTS
  // =========================

  const fetchDepartments = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/admin/departments/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Unable to load departments:", data);
        return;
      }

      setDepartments(data);
    } catch (error) {
      console.error("DEPARTMENT ERROR:", error);
    }
  };

  // =========================
  // HANDLE FORM INPUT
  // =========================

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear errors when user changes a field
    setFormError("");
    setSuccessMessage("");
  };

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setFormData({
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      role: "RECEPTIONIST",
      department: "",
      consultation_fee: "",
      is_active: true,
    });
  };

  // =========================
  // CREATE STAFF
  // =========================

  const handleCreateStaff = async (event) => {
    event.preventDefault();

    setFormError("");
    setSuccessMessage("");
    setCreating(true);

    try {
      // Create a copy of the form data
      const dataToSend = {
        username: formData.username,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        is_active: formData.is_active,
      };

      // Department and consultation fee
      // are required only for Doctor
      if (formData.role === "DOCTOR") {
        dataToSend.department = Number(formData.department);

        dataToSend.consultation_fee = formData.consultation_fee;
      }

      // Send data to Django
      const response = await fetch(
        "http://127.0.0.1:8000/api/admin/staff/create/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },

          body: JSON.stringify(dataToSend),
        },
      );

      const data = await response.json();

      // =========================
      // HANDLE ERROR
      // =========================

      if (!response.ok) {
        console.error("CREATE STAFF ERROR:", data);

        // Django serializer errors
        if (typeof data === "object") {
          const messages = [];

          Object.keys(data).forEach((field) => {
            const fieldErrors = data[field];

            if (Array.isArray(fieldErrors)) {
              fieldErrors.forEach((message) => {
                messages.push(`${field}: ${message}`);
              });
            } else {
              messages.push(`${field}: ${fieldErrors}`);
            }
          });

          setFormError(messages.join(" "));
        } else {
          setFormError("Unable to create staff.");
        }

        setCreating(false);
        return;
      }

      // =========================
      // SUCCESS
      // =========================

      console.log("STAFF CREATED:", data);

      setSuccessMessage("Staff member created successfully.");

      // Reset the form
      resetForm();

      // Refresh staff table
      await fetchStaff();

      // Keep form open so success can be seen
      setCreating(false);
    } catch (error) {
      console.error("CREATE STAFF ERROR:", error);

      setFormError("Unable to connect to the server.");

      setCreating(false);
    }
  };

  // =========================
  // OPEN / CLOSE FORM
  // =========================

  const handleToggleForm = () => {
    setShowForm(!showForm);

    setFormError("");
    setSuccessMessage("");
  };

  return (
    <div className="staff-page">
      {/* =========================
          HEADER
          ========================= */}

      <div className="staff-header">
        <div>
          <h1>Staff Management</h1>

          <p>Manage clinic staff members</p>
        </div>

        <button className="add-staff-button" onClick={handleToggleForm}>
          {showForm ? "Close" : "+ Add Staff"}
        </button>
      </div>

      {/* =========================
          ADD STAFF FORM
          ========================= */}

      {showForm && (
        <div className="add-staff-form">
          <h2>Add New Staff</h2>

          {/* FORM ERROR */}

          {formError && <div className="form-error">{formError}</div>}

          {/* SUCCESS MESSAGE */}

          {successMessage && (
            <div className="form-success">{successMessage}</div>
          )}

          <form onSubmit={handleCreateStaff}>
            <div className="form-grid">
              {/* USERNAME */}

              <div className="form-field">
                <label>Username</label>

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  required
                />
              </div>

              {/* FIRST NAME */}

              <div className="form-field">
                <label>First Name</label>

                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Enter first name"
                />
              </div>

              {/* LAST NAME */}

              <div className="form-field">
                <label>Last Name</label>

                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Enter last name"
                />
              </div>

              {/* EMAIL */}

              <div className="form-field">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                />
              </div>

              {/* PASSWORD */}

              <div className="form-field">
                <label>Password</label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                />
              </div>

              {/* ROLE */}

              <div className="form-field">
                <label>Role</label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="DOCTOR">Doctor</option>

                  <option value="RECEPTIONIST">Receptionist</option>

                  <option value="PHARMACIST">Pharmacist</option>

                  <option value="LAB_TECHNICIAN">Lab Technician</option>
                </select>
              </div>

              {/* DEPARTMENT
                  ONLY FOR DOCTOR */}

              {formData.role === "DOCTOR" && (
                <div className="form-field">
                  <label>Department</label>

                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Department</option>

                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* CONSULTATION FEE
                  ONLY FOR DOCTOR */}

              {formData.role === "DOCTOR" && (
                <div className="form-field">
                  <label>Consultation Fee</label>

                  <input
                    type="number"
                    name="consultation_fee"
                    value={formData.consultation_fee}
                    onChange={handleChange}
                    placeholder="Enter consultation fee"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              )}
            </div>

            {/* =========================
                ACTIVE STATUS
                ========================= */}

            <div className="active-checkbox">
              <label>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                />
                Active Staff
              </label>
            </div>

            {/* =========================
                CREATE BUTTON
                ========================= */}

            <button
              type="submit"
              className="create-staff-button"
              disabled={creating}
            >
              {creating ? "Creating..." : "Create Staff"}
            </button>
          </form>
        </div>
      )}

      {/* =========================
          STAFF SUMMARY
          ========================= */}

      <div className="staff-summary">
        <strong>Total Staff: {staff.length}</strong>
      </div>

      {/* =========================
          LOADING
          ========================= */}

      {loading && <p>Loading staff...</p>}

      {/* =========================
          ERROR
          ========================= */}

      {error && <p className="staff-error">{error}</p>}

      {/* =========================
          STAFF TABLE
          ========================= */}

      {!loading && !error && (
        <div className="staff-table-container">
          <table className="staff-table">
            <thead>
              <tr>
                <th>Staff ID</th>

                <th>Username</th>

                <th>Name</th>

                <th>Email</th>

                <th>Role</th>
              </tr>
            </thead>

            <tbody>
              {staff.map((member) => (
                <tr key={member.staff_id}>
                  <td>{member.staff_id}</td>

                  <td>{member.username}</td>

                  <td>
                    {member.first_name} {member.last_name}
                  </td>

                  <td>{member.email}</td>

                  <td>
                    <span className="role-badge">{member.role}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Staff;

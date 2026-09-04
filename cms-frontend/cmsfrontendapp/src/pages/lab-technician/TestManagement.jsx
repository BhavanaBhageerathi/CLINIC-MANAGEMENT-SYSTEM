import { useMemo, useState } from "react";
import "./TestManagement.css";

const initialTests = [
  {
    id: "LAB001",
    name: "Complete Blood Count",
    category: "Hematology",
    sample: "Blood",
    duration: "30 min",
    price: 450,
    status: "Active",
  },
  {
    id: "LAB002",
    name: "Liver Function Test",
    category: "Biochemistry",
    sample: "Blood",
    duration: "45 min",
    price: 650,
    status: "Active",
  },
  {
    id: "LAB003",
    name: "Blood Glucose",
    category: "Biochemistry",
    sample: "Blood",
    duration: "15 min",
    price: 200,
    status: "Active",
  },
  {
    id: "LAB004",
    name: "Lipid Profile",
    category: "Biochemistry",
    sample: "Blood",
    duration: "40 min",
    price: 550,
    status: "Active",
  },
  {
    id: "LAB005",
    name: "Thyroid Profile",
    category: "Hormones",
    sample: "Blood",
    duration: "60 min",
    price: 750,
    status: "Inactive",
  },
];

const emptyForm = {
  id: "",
  name: "",
  category: "",
  sample: "",
  duration: "",
  price: "",
  status: "Active",
};

function TestManagement() {
  const [tests, setTests] = useState(initialTests);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editingTest, setEditingTest] = useState(null);
  const [viewingTest, setViewingTest] = useState(null);
  const [deletingTest, setDeletingTest] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const categories = useMemo(() => {
    return [...new Set(tests.map((test) => test.category))];
  }, [tests]);

  const filteredTests = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return tests.filter((test) => {
      const matchesSearch =
        !keyword ||
        test.id.toLowerCase().includes(keyword) ||
        test.name.toLowerCase().includes(keyword);

      const matchesCategory =
        categoryFilter === "All" ||
        test.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" ||
        test.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [tests, search, categoryFilter, statusFilter]);

  const totalTests = tests.length;

  const activeTests = tests.filter(
    (test) => test.status === "Active"
  ).length;

  const inactiveTests = tests.filter(
    (test) => test.status === "Inactive"
  ).length;

  const totalCategories = categories.length;

  const openCreateModal = () => {
    setEditingTest(null);
    setForm(emptyForm);
    setErrors({});
    setShowFormModal(true);
  };

  const openEditModal = (test) => {
    setEditingTest(test);

    setForm({
      id: test.id,
      name: test.name,
      category: test.category,
      sample: test.sample,
      duration: test.duration,
      price: String(test.price),
      status: test.status,
    });

    setErrors({});
    setShowFormModal(true);
  };

  const openViewModal = (test) => {
    setViewingTest(test);
    setShowViewModal(true);
  };

  const openDeleteModal = (test) => {
    setDeletingTest(test);
    setShowDeleteModal(true);
  };

  const closeModals = () => {
    setShowFormModal(false);
    setShowViewModal(false);
    setShowDeleteModal(false);

    setEditingTest(null);
    setViewingTest(null);
    setDeletingTest(null);
    setErrors({});
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!/^LAB\d{3,}$/.test(form.id.trim())) {
      newErrors.id = "Use a valid Test ID such as LAB001.";
    }

    if (!/^[A-Za-z\s]+$/.test(form.name.trim())) {
      newErrors.name = "Test Name must contain alphabets only.";
    }

    if (!form.category.trim()) {
      newErrors.category = "Category is required.";
    }

    if (!form.sample.trim()) {
      newErrors.sample = "Sample type is required.";
    }

    if (!form.duration.trim()) {
      newErrors.duration = "Duration is required.";
    }

    if (
      form.price === "" ||
      Number.isNaN(Number(form.price)) ||
      Number(form.price) < 0
    ) {
      newErrors.price = "Enter a valid price.";
    }

    const duplicate = tests.some(
      (test) =>
        test.id.toLowerCase() === form.id.trim().toLowerCase() &&
        test.id !== editingTest?.id
    );

    if (duplicate) {
      newErrors.id = "This Test ID already exists.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const preparedTest = {
      id: form.id.trim().toUpperCase(),
      name: form.name.trim(),
      category: form.category.trim(),
      sample: form.sample.trim(),
      duration: form.duration.trim(),
      price: Number(form.price),
      status: form.status,
    };

    if (editingTest) {
      setTests((previous) =>
        previous.map((test) =>
          test.id === editingTest.id ? preparedTest : test
        )
      );
    } else {
      setTests((previous) => [preparedTest, ...previous]);
    }

    closeModals();
  };

  const deleteTest = () => {
    if (!deletingTest) return;

    setTests((previous) =>
      previous.filter((test) => test.id !== deletingTest.id)
    );

    closeModals();
  };

  const toggleStatus = (id) => {
    setTests((previous) =>
      previous.map((test) =>
        test.id === id
          ? {
              ...test,
              status:
                test.status === "Active" ? "Inactive" : "Active",
            }
          : test
      )
    );
  };

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("All");
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

  return (
    <div className="test-management-page">

      {/* PAGE HEADER */}
      <div className="tm-page-header">
        <div>
          <div className="tm-breadcrumb">
            <span>Clinic</span>
            <i className="bi bi-chevron-right"></i>
            <span>Laboratory</span>
            <i className="bi bi-chevron-right"></i>
            <strong>Test Management</strong>
          </div>

          <div className="d-flex align-items-center gap-3 mt-2">
            <div className="tm-title-icon">
              <i className="bi bi-eyedropper"></i>
            </div>

            <div>
              <h2 className="tm-page-title">
                Laboratory Tests
              </h2>

              <p className="tm-page-subtitle mb-0">
                Manage standardized laboratory tests and services.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary rounded-4 px-4 py-3 fw-semibold tm-add-button"
          onClick={openCreateModal}
        >
          <i className="bi bi-plus-lg me-2"></i>
          Add New Test
        </button>
      </div>

      {/* STATISTICS */}
      <div className="row g-4 mb-4">

        <div className="col-xl-3 col-md-6">
          <div className="tm-stat-card">
            <div>
              <div className="tm-stat-label">
                TOTAL TESTS
              </div>

              <div className="tm-stat-number">
                {totalTests}
              </div>

              <small className="text-muted">
                Laboratory services
              </small>
            </div>

            <div className="tm-stat-icon tm-stat-primary">
              <i className="bi bi-clipboard2-pulse"></i>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="tm-stat-card">
            <div>
              <div className="tm-stat-label">
                ACTIVE TESTS
              </div>

              <div className="tm-stat-number">
                {activeTests}
              </div>

              <small className="text-success fw-semibold">
                Available for requests
              </small>
            </div>

            <div className="tm-stat-icon tm-stat-success">
              <i className="bi bi-check-circle"></i>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="tm-stat-card">
            <div>
              <div className="tm-stat-label">
                INACTIVE TESTS
              </div>

              <div className="tm-stat-number">
                {inactiveTests}
              </div>

              <small className="text-warning fw-semibold">
                Currently unavailable
              </small>
            </div>

            <div className="tm-stat-icon tm-stat-warning">
              <i className="bi bi-pause-circle"></i>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="tm-stat-card">
            <div>
              <div className="tm-stat-label">
                CATEGORIES
              </div>

              <div className="tm-stat-number">
                {totalCategories}
              </div>

              <small className="text-muted">
                Test categories
              </small>
            </div>

            <div className="tm-stat-icon tm-stat-info">
              <i className="bi bi-diagram-3"></i>
            </div>
          </div>
        </div>

      </div>

      {/* MAIN PANEL */}
      <div className="tm-panel">

        {/* PANEL HEADER */}
        <div className="tm-panel-header">

          <div>
            <div className="tm-eyebrow">
              LABORATORY MASTER
            </div>

            <h5 className="fw-bold mb-1">
              Test Directory
            </h5>

            <small className="text-muted">
              Create, view, update and manage laboratory tests.
            </small>
          </div>

          <div className="tm-record-count">
            <i className="bi bi-database me-2"></i>
            {filteredTests.length} Records
          </div>

        </div>

        {/* FILTER BAR */}
        <div className="tm-filter-area">

          <div className="tm-search-box">
            <i className="bi bi-search"></i>

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by Test ID or Test Name..."
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
            className="form-select tm-select"
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(event.target.value)
            }
          >
            <option value="All">All Categories</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            className="form-select tm-select"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button
            type="button"
            className="btn btn-light rounded-4 tm-reset-button"
            onClick={resetFilters}
          >
            <i className="bi bi-arrow-counterclockwise me-2"></i>
            Reset
          </button>

        </div>

        {/* TABLE */}
        <div className="table-responsive">

          <table className="table align-middle mb-0 tm-table">

            <thead>
              <tr>
                <th className="ps-4">TEST</th>
                <th>CATEGORY</th>
                <th>SAMPLE</th>
                <th>DURATION</th>
                <th>PRICE</th>
                <th>STATUS</th>
                <th className="text-end pe-4">
                  ACTIONS
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredTests.map((test) => (
                <tr key={test.id} className="tm-table-row">

                  <td className="ps-4">

                    <div className="d-flex align-items-center gap-3">

                      <div className="tm-test-avatar">
                        {getInitials(test.name)}
                      </div>

                      <div>
                        <div className="tm-test-name">
                          {test.name}
                        </div>

                        <small className="tm-test-id">
                          {test.id}
                        </small>
                      </div>

                    </div>

                  </td>

                  <td>
                    <span className="tm-category">
                      {test.category}
                    </span>
                  </td>

                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-droplet text-primary"></i>
                      {test.sample}
                    </div>
                  </td>

                  <td>
                    <span className="text-muted">
                      <i className="bi bi-clock me-1"></i>
                      {test.duration}
                    </span>
                  </td>

                  <td>
                    <span className="tm-price">
                      ₹{test.price.toLocaleString("en-IN")}
                    </span>
                  </td>

                  <td>

                    <button
                      type="button"
                      className={`tm-status ${
                        test.status === "Active"
                          ? "tm-status-active"
                          : "tm-status-inactive"
                      }`}
                      onClick={() => toggleStatus(test.id)}
                      title="Click to change status"
                    >
                      <span className="tm-status-dot"></span>
                      {test.status}
                    </button>

                  </td>

                  <td className="text-end pe-4">

                    <div className="tm-actions">

                      <button
                        type="button"
                        className="tm-action tm-action-view"
                        onClick={() => openViewModal(test)}
                        title="View"
                      >
                        <i className="bi bi-eye"></i>
                      </button>

                      <button
                        type="button"
                        className="tm-action tm-action-edit"
                        onClick={() => openEditModal(test)}
                        title="Edit"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>

                      <button
                        type="button"
                        className="tm-action tm-action-delete"
                        onClick={() => openDeleteModal(test)}
                        title="Delete"
                      >
                        <i className="bi bi-trash3"></i>
                      </button>

                    </div>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

          {/* EMPTY STATE */}
          {filteredTests.length === 0 && (
            <div className="tm-empty-state">

              <div className="tm-empty-icon">
                <i className="bi bi-search"></i>
              </div>

              <h5 className="fw-bold mt-3">
                Test Not Found.
              </h5>

              <p className="text-muted mb-4">
                No laboratory test matches your current search
                or filters.
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

        {/* FOOTER */}
        <div className="tm-panel-footer">

          <span>
            <i className="bi bi-shield-check text-success me-2"></i>
            Laboratory master data
          </span>

          <span>
            Showing {filteredTests.length} of {tests.length} tests
          </span>

        </div>

      </div>

      {/* ===================================================== */}
      {/* CREATE / UPDATE MODAL */}
      {/* ===================================================== */}

      {showFormModal && (
        <div className="tm-modal-backdrop">

          <div className="tm-modal">

            <div className="tm-modal-header">

              <div className="d-flex align-items-center gap-3">

                <div className="tm-modal-icon">
                  <i
                    className={`bi ${
                      editingTest
                        ? "bi-pencil-square"
                        : "bi-plus-lg"
                    }`}
                  ></i>
                </div>

                <div>
                  <h5 className="fw-bold mb-1">
                    {editingTest
                      ? "Update Laboratory Test"
                      : "Add Laboratory Test"}
                  </h5>

                  <small className="text-muted">
                    {editingTest
                      ? "Modify the selected test details."
                      : "Create a new standardized laboratory test."}
                  </small>
                </div>

              </div>

              <button
                type="button"
                className="tm-close-button"
                onClick={closeModals}
              >
                <i className="bi bi-x-lg"></i>
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="tm-modal-body">

                <div className="row g-3">

                  {/* TEST ID */}
                  <div className="col-md-6">

                    <label className="form-label tm-form-label">
                      Test ID
                    </label>

                    <div className="tm-input-wrapper">
                      <i className="bi bi-upc-scan"></i>

                      <input
                        type="text"
                        name="id"
                        value={form.id}
                        onChange={handleInputChange}
                        className={`form-control ${
                          errors.id ? "is-invalid" : ""
                        }`}
                        placeholder="LAB001"
                      />
                    </div>

                    {errors.id && (
                      <div className="tm-error">
                        {errors.id}
                      </div>
                    )}

                  </div>

                  {/* TEST NAME */}
                  <div className="col-md-6">

                    <label className="form-label tm-form-label">
                      Test Name
                    </label>

                    <div className="tm-input-wrapper">
                      <i className="bi bi-eyedropper"></i>

                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleInputChange}
                        className={`form-control ${
                          errors.name ? "is-invalid" : ""
                        }`}
                        placeholder="Complete Blood Count"
                      />
                    </div>

                    {errors.name && (
                      <div className="tm-error">
                        {errors.name}
                      </div>
                    )}

                  </div>

                  {/* CATEGORY */}
                  <div className="col-md-6">

                    <label className="form-label tm-form-label">
                      Category
                    </label>

                    <div className="tm-input-wrapper">
                      <i className="bi bi-diagram-3"></i>

                      <input
                        type="text"
                        name="category"
                        value={form.category}
                        onChange={handleInputChange}
                        className={`form-control ${
                          errors.category ? "is-invalid" : ""
                        }`}
                        placeholder="Hematology"
                      />
                    </div>

                    {errors.category && (
                      <div className="tm-error">
                        {errors.category}
                      </div>
                    )}

                  </div>

                  {/* SAMPLE */}
                  <div className="col-md-6">

                    <label className="form-label tm-form-label">
                      Sample Type
                    </label>

                    <div className="tm-input-wrapper">
                      <i className="bi bi-droplet"></i>

                      <input
                        type="text"
                        name="sample"
                        value={form.sample}
                        onChange={handleInputChange}
                        className={`form-control ${
                          errors.sample ? "is-invalid" : ""
                        }`}
                        placeholder="Blood"
                      />
                    </div>

                    {errors.sample && (
                      <div className="tm-error">
                        {errors.sample}
                      </div>
                    )}

                  </div>

                  {/* DURATION */}
                  <div className="col-md-6">

                    <label className="form-label tm-form-label">
                      Duration
                    </label>

                    <div className="tm-input-wrapper">
                      <i className="bi bi-clock"></i>

                      <input
                        type="text"
                        name="duration"
                        value={form.duration}
                        onChange={handleInputChange}
                        className={`form-control ${
                          errors.duration ? "is-invalid" : ""
                        }`}
                        placeholder="30 min"
                      />
                    </div>

                    {errors.duration && (
                      <div className="tm-error">
                        {errors.duration}
                      </div>
                    )}

                  </div>

                  {/* PRICE */}
                  <div className="col-md-6">

                    <label className="form-label tm-form-label">
                      Price
                    </label>

                    <div className="tm-input-wrapper">
                      <i className="bi bi-currency-rupee"></i>

                      <input
                        type="number"
                        min="0"
                        name="price"
                        value={form.price}
                        onChange={handleInputChange}
                        className={`form-control ${
                          errors.price ? "is-invalid" : ""
                        }`}
                        placeholder="450"
                      />
                    </div>

                    {errors.price && (
                      <div className="tm-error">
                        {errors.price}
                      </div>
                    )}

                  </div>

                  {/* STATUS */}
                  <div className="col-12">

                    <label className="form-label tm-form-label">
                      Status
                    </label>

                    <div className="tm-status-options">

                      <button
                        type="button"
                        className={`tm-status-option ${
                          form.status === "Active"
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          setForm((previous) => ({
                            ...previous,
                            status: "Active",
                          }))
                        }
                      >
                        <span className="tm-status-radio"></span>

                        <div>
                          <div className="fw-semibold">
                            Active
                          </div>

                          <small className="text-muted">
                            Available for laboratory requests
                          </small>
                        </div>
                      </button>

                      <button
                        type="button"
                        className={`tm-status-option ${
                          form.status === "Inactive"
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          setForm((previous) => ({
                            ...previous,
                            status: "Inactive",
                          }))
                        }
                      >
                        <span className="tm-status-radio"></span>

                        <div>
                          <div className="fw-semibold">
                            Inactive
                          </div>

                          <small className="text-muted">
                            Temporarily unavailable
                          </small>
                        </div>
                      </button>

                    </div>

                  </div>

                </div>

              </div>

              <div className="tm-modal-footer">

                <button
                  type="button"
                  className="btn btn-light rounded-4 px-4"
                  onClick={closeModals}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary rounded-4 px-4 fw-semibold"
                >
                  <i
                    className={`bi ${
                      editingTest
                        ? "bi-check-lg"
                        : "bi-plus-lg"
                    } me-2`}
                  ></i>

                  {editingTest
                    ? "Save Changes"
                    : "Create Test"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* ===================================================== */}
      {/* VIEW MODAL */}
      {/* ===================================================== */}

      {showViewModal && viewingTest && (
        <div className="tm-modal-backdrop">

          <div className="tm-modal tm-view-modal">

            <div className="tm-modal-header">

              <div className="d-flex align-items-center gap-3">

                <div className="tm-view-avatar">
                  {getInitials(viewingTest.name)}
                </div>

                <div>
                  <h5 className="fw-bold mb-1">
                    {viewingTest.name}
                  </h5>

                  <small className="text-muted">
                    {viewingTest.id}
                  </small>
                </div>

              </div>

              <button
                type="button"
                className="tm-close-button"
                onClick={closeModals}
              >
                <i className="bi bi-x-lg"></i>
              </button>

            </div>

            <div className="tm-modal-body">

              <div className="tm-details-grid">

                <div className="tm-detail-item">
                  <span>Test ID</span>
                  <strong>{viewingTest.id}</strong>
                </div>

                <div className="tm-detail-item">
                  <span>Test Name</span>
                  <strong>{viewingTest.name}</strong>
                </div>

                <div className="tm-detail-item">
                  <span>Category</span>
                  <strong>{viewingTest.category}</strong>
                </div>

                <div className="tm-detail-item">
                  <span>Sample Type</span>
                  <strong>{viewingTest.sample}</strong>
                </div>

                <div className="tm-detail-item">
                  <span>Duration</span>
                  <strong>{viewingTest.duration}</strong>
                </div>

                <div className="tm-detail-item">
                  <span>Price</span>
                  <strong>
                    ₹{viewingTest.price.toLocaleString("en-IN")}
                  </strong>
                </div>

                <div className="tm-detail-item tm-detail-full">
                  <span>Status</span>

                  <span
                    className={`tm-status ${
                      viewingTest.status === "Active"
                        ? "tm-status-active"
                        : "tm-status-inactive"
                    }`}
                  >
                    <span className="tm-status-dot"></span>
                    {viewingTest.status}
                  </span>
                </div>

              </div>

            </div>

            <div className="tm-modal-footer">

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
                  openEditModal(viewingTest);
                }}
              >
                <i className="bi bi-pencil-square me-2"></i>
                Edit Test
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ===================================================== */}
      {/* DELETE MODAL */}
      {/* ===================================================== */}

      {showDeleteModal && deletingTest && (
        <div className="tm-modal-backdrop">

          <div className="tm-modal tm-delete-modal">

            <div className="tm-delete-icon">
              <i className="bi bi-trash3"></i>
            </div>

            <h4 className="fw-bold mt-4">
              Delete Laboratory Test?
            </h4>

            <p className="text-muted mt-2">
              You are about to delete
              <strong className="text-dark">
                {" "}{deletingTest.name}
              </strong>.
              This action cannot be undone.
            </p>

            <div className="tm-delete-preview">

              <div className="tm-test-avatar">
                {getInitials(deletingTest.name)}
              </div>

              <div>
                <div className="fw-bold">
                  {deletingTest.name}
                </div>

                <small className="text-muted">
                  {deletingTest.id} · {deletingTest.category}
                </small>
              </div>

            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">

              <button
                type="button"
                className="btn btn-light rounded-4 px-4"
                onClick={closeModals}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-danger rounded-4 px-4 fw-semibold"
                onClick={deleteTest}
              >
                <i className="bi bi-trash3 me-2"></i>
                Delete Test
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default TestManagement;
import { useMemo, useState } from "react";
import "./LaboratoryBilling.css";

const initialBills = [
  {
    id: "BILL001",
    patientId: "PAT003",
    patientName: "Vishnu Raj",
    testId: "LAB003",
    testName: "Blood Glucose",
    billingDate: "03 Sep 2026",
    billingTime: "10:45 AM",
    amount: 300,
    discount: 0,
    total: 300,
    paymentStatus: "Paid",
    paymentMethod: "UPI",
    transactionId: "UPI982341",
  },
  {
    id: "BILL002",
    patientId: "PAT005",
    patientName: "Nikhil Mohan",
    testId: "LAB005",
    testName: "Thyroid Profile",
    billingDate: "03 Sep 2026",
    billingTime: "11:30 AM",
    amount: 850,
    discount: 50,
    total: 800,
    paymentStatus: "Paid",
    paymentMethod: "Card",
    transactionId: "CARD673821",
  },
  {
    id: "BILL003",
    patientId: "PAT008",
    patientName: "Meera Thomas",
    testId: "LAB001",
    testName: "Complete Blood Count",
    billingDate: "02 Sep 2026",
    billingTime: "04:45 PM",
    amount: 450,
    discount: 0,
    total: 450,
    paymentStatus: "Pending",
    paymentMethod: "",
    transactionId: "",
  },
  {
    id: "BILL004",
    patientId: "PAT010",
    patientName: "Arjun S",
    testId: "LAB004",
    testName: "Lipid Profile",
    billingDate: "02 Sep 2026",
    billingTime: "03:15 PM",
    amount: 700,
    discount: 100,
    total: 600,
    paymentStatus: "Paid",
    paymentMethod: "Cash",
    transactionId: "CASH00291",
  },
];

const emptyForm = {
  id: "",
  patientId: "",
  patientName: "",
  testId: "",
  testName: "",
  billingDate: "",
  billingTime: "",
  amount: "",
  discount: "0",
  paymentStatus: "Pending",
  paymentMethod: "",
  transactionId: "",
};

const paymentMethods = ["Cash", "Card", "UPI", "Net Banking"];

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function LaboratoryBilling() {
  const [bills, setBills] = useState(initialBills);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [selectedBill, setSelectedBill] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const filteredBills = useMemo(() => {
    const value = search.toLowerCase().trim();

    return bills.filter((bill) => {
      const matchesSearch =
        !value ||
        bill.id.toLowerCase().includes(value) ||
        bill.patientName.toLowerCase().includes(value) ||
        bill.billingDate.toLowerCase().includes(value);

      const matchesStatus =
        statusFilter === "All" ||
        bill.paymentStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bills, search, statusFilter]);

  const stats = useMemo(() => {
    const totalRevenue = bills
      .filter((bill) => bill.paymentStatus === "Paid")
      .reduce((sum, bill) => sum + Number(bill.total), 0);

    const pendingAmount = bills
      .filter((bill) => bill.paymentStatus === "Pending")
      .reduce((sum, bill) => sum + Number(bill.total), 0);

    return {
      total: bills.length,
      paid: bills.filter((bill) => bill.paymentStatus === "Paid").length,
      pending: bills.filter((bill) => bill.paymentStatus === "Pending").length,
      revenue: totalRevenue,
      pendingAmount,
    };
  }, [bills]);

  const openCreateModal = () => {
    setEditingId(null);

    setForm({
      ...emptyForm,
      billingDate: new Date().toISOString().split("T")[0],
    });

    setErrors({});
    setShowForm(true);
  };

  const openEditModal = (bill) => {
    setEditingId(bill.id);

    setForm({
      ...bill,
      billingDate: convertDisplayDateToInput(bill.billingDate),
    });

    setErrors({});
    setShowForm(true);
  };

  const openViewModal = (bill) => {
    setSelectedBill(bill);
    setShowView(true);
  };

  const openPaymentModal = (bill) => {
    setSelectedBill(bill);
    setShowPayment(true);
  };

  const openDeleteModal = (bill) => {
    setSelectedBill(bill);
    setShowDelete(true);
  };

  const closeModals = () => {
    setShowForm(false);
    setShowView(false);
    setShowPayment(false);
    setShowDelete(false);

    setSelectedBill(null);
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

  const calculatedTotal = Math.max(
    Number(form.amount || 0) - Number(form.discount || 0),
    0
  );

  const validateForm = () => {
    const newErrors = {};

    if (!/^BILL\d{3,}$/.test(form.id.trim())) {
      newErrors.id = "Use a valid Bill ID such as BILL001.";
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

    if (!form.billingDate) {
      newErrors.billingDate = "Billing date is required.";
    }

    if (form.amount === "" || Number(form.amount) < 0) {
      newErrors.amount = "Enter a valid amount.";
    }

    if (form.discount === "" || Number(form.discount) < 0) {
      newErrors.discount = "Enter a valid discount.";
    }

    if (Number(form.discount) > Number(form.amount)) {
      newErrors.discount = "Discount cannot exceed the test charge.";
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

    const duplicateId = bills.some(
      (bill) =>
        bill.id.toLowerCase() === form.id.trim().toLowerCase() &&
        bill.id !== editingId
    );

    if (duplicateId) {
      setErrors({
        id: "This Bill ID already exists.",
      });

      return;
    }

    const formattedBill = {
      ...form,

      id: form.id.trim().toUpperCase(),

      patientId: form.patientId.trim().toUpperCase(),

      patientName: form.patientName.trim(),

      testName: form.testName.trim(),

      amount: Number(form.amount),

      discount: Number(form.discount),

      total: calculatedTotal,

      billingDate: formatDate(form.billingDate),

      billingTime:
        form.billingTime ||
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
    };

    if (editingId) {
      setBills((previous) =>
        previous.map((bill) =>
          bill.id === editingId ? formattedBill : bill
        )
      );
    } else {
      setBills((previous) => [formattedBill, ...previous]);
    }

    closeModals();
  };

  const deleteBill = () => {
    if (!selectedBill) return;

    setBills((previous) =>
      previous.filter((bill) => bill.id !== selectedBill.id)
    );

    closeModals();
  };

  const markAsPaid = () => {
    if (!selectedBill) return;

    const paymentMethod = document.getElementById(
      "paymentMethod"
    ).value;

    const transactionId = document.getElementById(
      "transactionId"
    ).value.trim();

    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    setBills((previous) =>
      previous.map((bill) =>
        bill.id === selectedBill.id
          ? {
              ...bill,
              paymentStatus: "Paid",
              paymentMethod,
              transactionId:
                transactionId ||
                `TXN${Date.now().toString().slice(-6)}`,
            }
          : bill
      )
    );

    closeModals();
  };

  const printBill = (bill) => {
    const printWindow = window.open(
      "",
      "_blank",
      "width=900,height=700"
    );

    if (!printWindow) {
      alert("Please allow pop-ups to print the bill.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${bill.id} - Laboratory Bill</title>

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
              font-size: 13px;
              font-weight: bold;
              color: #2563eb;
              text-transform: uppercase;
              margin-bottom: 10px;
            }

            .grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
            }

            .box {
              background: #f8fafc;
              padding: 13px;
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

            .amount-box {
              margin-top: 25px;
              margin-left: auto;
              width: 330px;
            }

            .amount-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
            }

            .total {
              border-top: 2px solid #2563eb;
              padding-top: 12px;
              font-size: 20px;
              font-weight: bold;
            }

            .paid {
              color: #15803d;
              font-weight: bold;
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
              <h1>Laboratory Bill</h1>
              <div class="subtitle">
                Clinic Management System
              </div>
            </div>

            <div>
              <strong>${bill.id}</strong><br/>
              ${bill.billingDate}
            </div>

          </div>

          <div class="section">

            <div class="section-title">
              Patient Information
            </div>

            <div class="grid">

              <div class="box">
                <div class="label">Patient ID</div>
                <div class="value">${bill.patientId}</div>
              </div>

              <div class="box">
                <div class="label">Patient Name</div>
                <div class="value">${bill.patientName}</div>
              </div>

            </div>

          </div>

          <div class="section">

            <div class="section-title">
              Laboratory Test
            </div>

            <div class="grid">

              <div class="box">
                <div class="label">Test ID</div>
                <div class="value">${bill.testId}</div>
              </div>

              <div class="box">
                <div class="label">Test Name</div>
                <div class="value">${bill.testName}</div>
              </div>

            </div>

          </div>

          <div class="amount-box">

            <div class="amount-row">
              <span>Test Charge</span>
              <strong>₹${bill.amount.toFixed(2)}</strong>
            </div>

            <div class="amount-row">
              <span>Discount</span>
              <strong>- ₹${bill.discount.toFixed(2)}</strong>
            </div>

            <div class="amount-row total">
              <span>Total</span>
              <span>₹${bill.total.toFixed(2)}</span>
            </div>

            <div class="amount-row">
              <span>Payment Status</span>
              <span class="paid">${bill.paymentStatus}</span>
            </div>

          </div>

          <div class="section">

            <div class="section-title">
              Payment Information
            </div>

            <div class="grid">

              <div class="box">
                <div class="label">Payment Method</div>
                <div class="value">
                  ${bill.paymentMethod || "Pending"}
                </div>
              </div>

              <div class="box">
                <div class="label">Transaction ID</div>
                <div class="value">
                  ${bill.transactionId || "—"}
                </div>
              </div>

            </div>

          </div>

          <div class="footer">
            Generated by Laboratory Technician on
            ${bill.billingDate} at ${bill.billingTime}.
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
    <div className="lab-billing-page min-vh-100">

      <div className="container-fluid px-4 px-xl-5 py-4">

        {/* Header */}

        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4 billing-animate">

          <div>

            <div className="text-secondary small mb-2">
              <i className="bi bi-grid-1x2-fill me-2"></i>
              Lab Technician
              <span className="mx-2">/</span>
              Laboratory Billing
            </div>

            <div className="d-flex align-items-center gap-3">

              <div className="billing-title-icon">
                <i className="bi bi-receipt-cutoff"></i>
              </div>

              <div>

                <h2 className="fw-bold mb-1">
                  Laboratory Billing
                </h2>

                <p className="text-secondary mb-0">
                  Generate bills, record payments and manage laboratory charges.
                </p>

              </div>

            </div>

          </div>

          <button
            className="btn btn-primary rounded-pill px-4 py-3 shadow-sm"
            onClick={openCreateModal}
          >
            <i className="bi bi-receipt me-2"></i>
            Generate Bill
          </button>

        </div>

        {/* Statistics */}

        <div className="row g-3 mb-4">

          <div className="col-12 col-sm-6 col-xl-3">

            <div className="billing-stat-card h-100">

              <div className="d-flex justify-content-between align-items-center">

                <div>
                  <div className="text-secondary small">
                    Total Bills
                  </div>

                  <h3 className="fw-bold mb-0 mt-2">
                    {stats.total}
                  </h3>
                </div>

                <div className="billing-stat-icon bg-primary-subtle text-primary">
                  <i className="bi bi-receipt"></i>
                </div>

              </div>

            </div>

          </div>

          <div className="col-12 col-sm-6 col-xl-3">

            <div className="billing-stat-card h-100">

              <div className="d-flex justify-content-between align-items-center">

                <div>
                  <div className="text-secondary small">
                    Paid Bills
                  </div>

                  <h3 className="fw-bold mb-0 mt-2">
                    {stats.paid}
                  </h3>
                </div>

                <div className="billing-stat-icon bg-success-subtle text-success">
                  <i className="bi bi-check-circle"></i>
                </div>

              </div>

            </div>

          </div>

          <div className="col-12 col-sm-6 col-xl-3">

            <div className="billing-stat-card h-100">

              <div className="d-flex justify-content-between align-items-center">

                <div>
                  <div className="text-secondary small">
                    Pending Bills
                  </div>

                  <h3 className="fw-bold mb-0 mt-2">
                    {stats.pending}
                  </h3>
                </div>

                <div className="billing-stat-icon bg-warning-subtle text-warning">
                  <i className="bi bi-clock-history"></i>
                </div>

              </div>

            </div>

          </div>

          <div className="col-12 col-sm-6 col-xl-3">

            <div className="billing-stat-card h-100">

              <div className="d-flex justify-content-between align-items-center">

                <div>
                  <div className="text-secondary small">
                    Paid Revenue
                  </div>

                  <h3 className="fw-bold mb-0 mt-2">
                    ₹{stats.revenue.toLocaleString("en-IN")}
                  </h3>
                </div>

                <div className="billing-stat-icon bg-info-subtle text-info">
                  <i className="bi bi-currency-rupee"></i>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Billing Panel */}

        <div className="billing-panel">

          <div className="billing-panel-header">

            <div>
              <h5 className="fw-bold mb-1">
                Billing Records
              </h5>

              <p className="text-secondary small mb-0">
                Manage laboratory billing and payment information.
              </p>
            </div>

            <span className="badge rounded-pill text-bg-light border px-3 py-2">
              {filteredBills.length} Bills
            </span>

          </div>

          {/* Filters */}

          <div className="p-4 border-bottom">

            <div className="row g-3">

              <div className="col-12 col-lg-7">

                <div className="input-group billing-search">

                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-search text-secondary"></i>
                  </span>

                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search Bill ID, Patient Name or Billing Date..."
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                  />

                </div>

              </div>

              <div className="col-12 col-md-6 col-lg-3">

                <select
                  className="form-select billing-select"
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                >
                  <option value="All">All Payment Status</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
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

            <table className="table align-middle mb-0 billing-table">

              <thead>

                <tr>
                  <th>BILL</th>
                  <th>PATIENT</th>
                  <th>TEST</th>
                  <th>AMOUNT</th>
                  <th>BILLING DATE</th>
                  <th>PAYMENT</th>
                  <th className="text-end">ACTIONS</th>
                </tr>

              </thead>

              <tbody>

                {filteredBills.map((bill) => (

                  <tr key={bill.id}>

                    <td>

                      <div className="d-flex align-items-center gap-3">

                        <div className="billing-file-icon">
                          <i className="bi bi-receipt"></i>
                        </div>

                        <div>

                          <div className="fw-bold">
                            {bill.id}
                          </div>

                          <div className="small text-secondary">
                            {bill.testId}
                          </div>

                        </div>

                      </div>

                    </td>

                    <td>

                      <div className="d-flex align-items-center gap-2">

                        <div className="billing-patient-avatar">
                          {getInitials(bill.patientName)}
                        </div>

                        <div>

                          <div className="fw-semibold">
                            {bill.patientName}
                          </div>

                          <div className="small text-secondary">
                            {bill.patientId}
                          </div>

                        </div>

                      </div>

                    </td>

                    <td>

                      <div className="fw-semibold">
                        {bill.testName}
                      </div>

                      <div className="small text-secondary">
                        {bill.testId}
                      </div>

                    </td>

                    <td>

                      <div className="fw-bold">
                        ₹{bill.total.toLocaleString("en-IN")}
                      </div>

                      {bill.discount > 0 && (
                        <div className="small text-success">
                          ₹{bill.discount} discount
                        </div>
                      )}

                    </td>

                    <td>

                      <div className="fw-semibold">
                        {bill.billingDate}
                      </div>

                      <div className="small text-secondary">
                        {bill.billingTime}
                      </div>

                    </td>

                    <td>

                      <span
                        className={`billing-payment-status ${
                          bill.paymentStatus === "Paid"
                            ? "billing-paid"
                            : "billing-pending"
                        }`}
                      >
                        <span className="billing-status-dot"></span>
                        {bill.paymentStatus}
                      </span>

                      {bill.paymentMethod && (
                        <div className="small text-secondary mt-1">
                          {bill.paymentMethod}
                        </div>
                      )}

                    </td>

                    <td>

                      <div className="d-flex justify-content-end gap-2">

                        <button
                          className="btn btn-light billing-action"
                          title="View Bill"
                          onClick={() => openViewModal(bill)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>

                        <button
                          className="btn btn-light billing-action"
                          title="Edit Bill"
                          onClick={() => openEditModal(bill)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>

                        {bill.paymentStatus === "Pending" && (
                          <button
                            className="btn btn-light billing-action billing-pay-action"
                            title="Record Payment"
                            onClick={() =>
                              openPaymentModal(bill)
                            }
                          >
                            <i className="bi bi-credit-card"></i>
                          </button>
                        )}

                        <button
                          className="btn btn-light billing-action"
                          title="Print Bill"
                          onClick={() => printBill(bill)}
                        >
                          <i className="bi bi-printer"></i>
                        </button>

                        <button
                          className="btn btn-light billing-action billing-delete-action"
                          title="Delete Bill"
                          onClick={() =>
                            openDeleteModal(bill)
                          }
                        >
                          <i className="bi bi-trash"></i>
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

            {filteredBills.length === 0 && (

              <div className="billing-empty-state">

                <div className="billing-empty-icon">
                  <i className="bi bi-receipt-cutoff"></i>
                </div>

                <h5 className="fw-bold mt-3">
                  Billing Record Not Found.
                </h5>

                <p className="text-secondary mb-0">
                  No billing record matches your current search or filter.
                </p>

              </div>

            )}

          </div>

        </div>

      </div>

      {/* CREATE / EDIT BILL MODAL */}

      {showForm && (

        <div className="billing-modal-backdrop">

          <div className="billing-modal billing-large-modal">

            <div className="billing-modal-header">

              <div className="d-flex align-items-center gap-3">

                <div className="billing-modal-icon">
                  <i className="bi bi-receipt"></i>
                </div>

                <div>

                  <h5 className="fw-bold mb-1">
                    {editingId
                      ? "Update Laboratory Bill"
                      : "Generate Laboratory Bill"}
                  </h5>

                  <p className="text-secondary small mb-0">
                    Enter laboratory billing and payment details.
                  </p>

                </div>

              </div>

              <button
                className="btn-close"
                onClick={closeModals}
              ></button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="billing-modal-body">

                <div className="billing-section-title">
                  <i className="bi bi-person-vcard me-2"></i>
                  Patient & Test Information
                </div>

                <div className="row g-3 mb-4">

                  <div className="col-md-4">

                    <label className="form-label">
                      Bill ID *
                    </label>

                    <input
                      name="id"
                      value={form.id}
                      onChange={handleChange}
                      className={`form-control ${
                        errors.id ? "is-invalid" : ""
                      }`}
                      placeholder="BILL001"
                      disabled={Boolean(editingId)}
                    />

                    {errors.id && (
                      <div className="invalid-feedback">
                        {errors.id}
                      </div>
                    )}

                  </div>

                  <div className="col-md-4">

                    <label className="form-label">
                      Patient ID *
                    </label>

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
                      <div className="invalid-feedback">
                        {errors.patientId}
                      </div>
                    )}

                  </div>

                  <div className="col-md-4">

                    <label className="form-label">
                      Patient Name *
                    </label>

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

                  <div className="col-md-4">

                    <label className="form-label">
                      Test ID
                    </label>

                    <input
                      name="testId"
                      value={form.testId}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="LAB001"
                    />

                  </div>

                  <div className="col-md-8">

                    <label className="form-label">
                      Test Name *
                    </label>

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
                      <div className="invalid-feedback">
                        {errors.testName}
                      </div>
                    )}

                  </div>

                </div>

                <div className="billing-section-title">
                  <i className="bi bi-calculator me-2"></i>
                  Billing Details
                </div>

                <div className="row g-3">

                  <div className="col-md-4">

                    <label className="form-label">
                      Billing Date *
                    </label>

                    <input
                      name="billingDate"
                      type="date"
                      value={form.billingDate}
                      onChange={handleChange}
                      className={`form-control ${
                        errors.billingDate
                          ? "is-invalid"
                          : ""
                      }`}
                    />

                    {errors.billingDate && (
                      <div className="invalid-feedback">
                        {errors.billingDate}
                      </div>
                    )}

                  </div>

                  <div className="col-md-4">

                    <label className="form-label">
                      Billing Time
                    </label>

                    <input
                      name="billingTime"
                      type="time"
                      value={form.billingTime}
                      onChange={handleChange}
                      className="form-control"
                    />

                  </div>

                  <div className="col-md-4">

                    <label className="form-label">
                      Test Charge *
                    </label>

                    <div className="input-group">

                      <span className="input-group-text">
                        ₹
                      </span>

                      <input
                        name="amount"
                        type="number"
                        min="0"
                        value={form.amount}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.amount
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="500"
                      />

                    </div>

                    {errors.amount && (
                      <div className="text-danger small mt-1">
                        {errors.amount}
                      </div>
                    )}

                  </div>

                  <div className="col-md-4">

                    <label className="form-label">
                      Discount
                    </label>

                    <div className="input-group">

                      <span className="input-group-text">
                        ₹
                      </span>

                      <input
                        name="discount"
                        type="number"
                        min="0"
                        value={form.discount}
                        onChange={handleChange}
                        className="form-control"
                      />

                    </div>

                    {errors.discount && (
                      <div className="text-danger small mt-1">
                        {errors.discount}
                      </div>
                    )}

                  </div>

                  <div className="col-md-4">

                    <label className="form-label">
                      Total Amount
                    </label>

                    <div className="billing-total-display">
                      ₹{calculatedTotal.toLocaleString("en-IN")}
                    </div>

                  </div>

                  <div className="col-md-4">

                    <label className="form-label">
                      Payment Status
                    </label>

                    <select
                      name="paymentStatus"
                      value={form.paymentStatus}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Paid">
                        Paid
                      </option>
                    </select>

                  </div>

                  {form.paymentStatus === "Paid" && (

                    <>
                      <div className="col-md-6">

                        <label className="form-label">
                          Payment Method
                        </label>

                        <select
                          name="paymentMethod"
                          value={form.paymentMethod}
                          onChange={handleChange}
                          className="form-select"
                        >
                          <option value="">
                            Select Payment Method
                          </option>

                          {paymentMethods.map((method) => (
                            <option
                              key={method}
                              value={method}
                            >
                              {method}
                            </option>
                          ))}

                        </select>

                      </div>

                      <div className="col-md-6">

                        <label className="form-label">
                          Transaction / Reference ID
                        </label>

                        <input
                          name="transactionId"
                          value={form.transactionId}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="Optional reference number"
                        />

                      </div>
                    </>

                  )}

                </div>

              </div>

              <div className="billing-modal-footer">

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
                      editingId
                        ? "bi-check2-circle"
                        : "bi-receipt"
                    } me-2`}
                  ></i>

                  {editingId
                    ? "Save Changes"
                    : "Generate Bill"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* VIEW BILL MODAL */}

      {showView && selectedBill && (

        <div className="billing-modal-backdrop">

          <div className="billing-modal billing-view-modal">

            <div className="billing-modal-header">

              <div className="d-flex align-items-center gap-3">

                <div className="billing-modal-icon">
                  <i className="bi bi-receipt"></i>
                </div>

                <div>

                  <h5 className="fw-bold mb-1">
                    Laboratory Bill
                  </h5>

                  <div className="small text-secondary">
                    {selectedBill.id}
                  </div>

                </div>

              </div>

              <button
                className="btn-close"
                onClick={closeModals}
              ></button>

            </div>

            <div className="billing-modal-body">

              <div className="bill-preview">

                <div className="d-flex justify-content-between border-bottom pb-4 mb-4">

                  <div>

                    <h4 className="fw-bold mb-1">
                      Laboratory Bill
                    </h4>

                    <div className="text-secondary">
                      Clinic Management System
                    </div>

                  </div>

                  <div className="text-end">

                    <div className="fw-bold text-primary">
                      {selectedBill.id}
                    </div>

                    <small className="text-secondary">
                      {selectedBill.billingDate}
                    </small>

                  </div>

                </div>

                <div className="billing-preview-section">

                  <div className="billing-preview-heading">
                    Patient Information
                  </div>

                  <div className="row g-3">

                    <BillDetail
                      label="Patient ID"
                      value={selectedBill.patientId}
                    />

                    <BillDetail
                      label="Patient Name"
                      value={selectedBill.patientName}
                    />

                  </div>

                </div>

                <div className="billing-preview-section">

                  <div className="billing-preview-heading">
                    Laboratory Test
                  </div>

                  <div className="row g-3">

                    <BillDetail
                      label="Test ID"
                      value={selectedBill.testId}
                    />

                    <BillDetail
                      label="Test Name"
                      value={selectedBill.testName}
                    />

                  </div>

                </div>

                <div className="billing-amount-box">

                  <div className="billing-amount-row">
                    <span>Test Charge</span>
                    <strong>
                      ₹{selectedBill.amount.toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <div className="billing-amount-row">
                    <span>Discount</span>
                    <strong className="text-success">
                      - ₹{selectedBill.discount.toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <div className="billing-amount-total">
                    <span>Total Amount</span>
                    <span>
                      ₹{selectedBill.total.toLocaleString("en-IN")}
                    </span>
                  </div>

                </div>

                <div className="billing-preview-section">

                  <div className="billing-preview-heading">
                    Payment Information
                  </div>

                  <div className="row g-3">

                    <BillDetail
                      label="Payment Status"
                      value={selectedBill.paymentStatus}
                    />

                    <BillDetail
                      label="Payment Method"
                      value={
                        selectedBill.paymentMethod || "Pending"
                      }
                    />

                    <BillDetail
                      label="Transaction ID"
                      value={
                        selectedBill.transactionId || "—"
                      }
                    />

                    <BillDetail
                      label="Billing Time"
                      value={selectedBill.billingTime}
                    />

                  </div>

                </div>

              </div>

            </div>

            <div className="billing-modal-footer">

              <button
                className="btn btn-light border rounded-pill px-4"
                onClick={closeModals}
              >
                Close
              </button>

              {selectedBill.paymentStatus === "Pending" && (

                <button
                  className="btn btn-success rounded-pill px-4"
                  onClick={() => {
                    setShowView(false);
                    setShowPayment(true);
                  }}
                >
                  <i className="bi bi-credit-card me-2"></i>
                  Record Payment
                </button>

              )}

              <button
                className="btn btn-primary rounded-pill px-4"
                onClick={() => printBill(selectedBill)}
              >
                <i className="bi bi-printer me-2"></i>
                Print Bill
              </button>

            </div>

          </div>

        </div>

      )}

      {/* PAYMENT MODAL */}

      {showPayment && selectedBill && (

        <div className="billing-modal-backdrop">

          <div className="billing-modal billing-payment-modal">

            <div className="billing-modal-header">

              <div className="d-flex align-items-center gap-3">

                <div className="billing-payment-icon">
                  <i className="bi bi-credit-card"></i>
                </div>

                <div>

                  <h5 className="fw-bold mb-1">
                    Record Payment
                  </h5>

                  <div className="small text-secondary">
                    {selectedBill.id} · {selectedBill.patientName}
                  </div>

                </div>

              </div>

              <button
                className="btn-close"
                onClick={closeModals}
              ></button>

            </div>

            <div className="billing-modal-body">

              <div className="billing-payment-summary">

                <span>Amount Due</span>

                <strong>
                  ₹{selectedBill.total.toLocaleString("en-IN")}
                </strong>

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Payment Method *
                </label>

                <select
                  id="paymentMethod"
                  className="form-select"
                  defaultValue=""
                >
                  <option value="">
                    Select Payment Method
                  </option>

                  {paymentMethods.map((method) => (
                    <option
                      key={method}
                      value={method}
                    >
                      {method}
                    </option>
                  ))}

                </select>

              </div>

              <div>

                <label className="form-label">
                  Transaction / Reference ID
                </label>

                <input
                  id="transactionId"
                  className="form-control"
                  placeholder="Enter transaction/reference number"
                />

              </div>

            </div>

            <div className="billing-modal-footer">

              <button
                className="btn btn-light border rounded-pill px-4"
                onClick={closeModals}
              >
                Cancel
              </button>

              <button
                className="btn btn-success rounded-pill px-4"
                onClick={markAsPaid}
              >
                <i className="bi bi-check-circle me-2"></i>
                Confirm Payment
              </button>

            </div>

          </div>

        </div>

      )}

      {/* DELETE MODAL */}

      {showDelete && selectedBill && (

        <div className="billing-modal-backdrop">

          <div className="billing-modal billing-delete-modal">

            <div className="billing-delete-icon">
              <i className="bi bi-trash3"></i>
            </div>

            <h5 className="fw-bold mt-3">
              Delete Billing Record?
            </h5>

            <p className="text-secondary">
              Are you sure you want to delete{" "}
              <strong>{selectedBill.id}</strong> for{" "}
              <strong>{selectedBill.patientName}</strong>?
              This action cannot be undone.
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
                onClick={deleteBill}
              >
                <i className="bi bi-trash3 me-2"></i>
                Delete Bill
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

function BillDetail({ label, value }) {
  return (
    <div className="col-md-6">

      <div className="small text-secondary mb-1">
        {label}
      </div>

      <div className="fw-semibold">
        {value || "—"}
      </div>

    </div>
  );
}

function formatDate(date) {
  if (!date) return "";

  const [year, month, day] = date.split("-");

  return `${day} ${new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  ).toLocaleString("en-US", {
    month: "short",
  })} ${year}`;
}

function convertDisplayDateToInput(date) {
  if (!date) return "";

  const parts = date.split(" ");

  if (parts.length !== 3) return "";

  const [day, monthText, year] = parts;

  const month =
    new Date(`${monthText} 1, ${year}`).getMonth() + 1;

  return `${year}-${String(month).padStart(
    2,
    "0"
  )}-${String(day).padStart(2, "0")}`;
}

export default LaboratoryBilling;

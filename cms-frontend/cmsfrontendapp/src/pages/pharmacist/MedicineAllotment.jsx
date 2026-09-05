import { useEffect, useState } from "react";
import api from "../../services/api";

function MedicineAllotment() {
// ==========================================
// STATE
// ==========================================

const [prescriptions, setPrescriptions] =
useState([]);

const [medicines, setMedicines] =
useState([]);

const [searchPatient, setSearchPatient] =
useState("");

const [
selectedPrescription,
setSelectedPrescription,
] = useState(null);

const [
prescriptionMedicines,
setPrescriptionMedicines,
] = useState([]);

const [loading, setLoading] =
useState(true);

const [
medicineLoading,
setMedicineLoading,
] = useState(false);

const [issuing, setIssuing] =
useState(false);

const [error, setError] =
useState("");

// ==========================================
// LOAD PRESCRIPTIONS
// ==========================================

const loadPrescriptions = async () => {
try {
setLoading(true);
setError("");


  const response = await api.get(
    "pharmacist/prescriptions/?is_issued=false"
  );

  setPrescriptions(
    Array.isArray(response.data)
      ? response.data
      : []
  );
} catch (error) {
  console.error(
    "Error loading prescriptions:",
    error
  );

  setError(
    "Unable to load prescriptions. Please check the Django backend."
  );
} finally {
  setLoading(false);
}


};

// ==========================================
// LOAD MEDICINE INVENTORY
// ==========================================

const loadMedicines = async () => {
try {
const response = await api.get(
"pharmacist/medicines/"
);


  setMedicines(
    Array.isArray(response.data)
      ? response.data
      : []
  );
} catch (error) {
  console.error(
    "Error loading inventory:",
    error
  );

  setMedicines([]);
}


};

// ==========================================
// LOAD DATA WHEN PAGE OPENS
// ==========================================

useEffect(() => {
const loadPageData = async () => {
await Promise.all([
loadPrescriptions(),
loadMedicines(),
]);
};


loadPageData();


}, []);

// ==========================================
// SEARCH PRESCRIPTIONS
// ==========================================

const filteredPrescriptions =
prescriptions.filter(
(prescription) => {
const patientName =
prescription.patient_name || "";


    const patientId =
      prescription.patient_id || "";

    const search =
      searchPatient
        .trim()
        .toLowerCase();

    return (
      patientName
        .toLowerCase()
        .includes(search) ||
      patientId
        .toLowerCase()
        .includes(search)
    );
  }
);


// ==========================================
// SELECT PRESCRIPTION
// ==========================================

const handleSelectPrescription =
async (prescription) => {
try {
setSelectedPrescription(
prescription
);


    setPrescriptionMedicines([]);

    setMedicineLoading(true);

    const response =
      await api.get(
        `pharmacist/prescriptions/${prescription.id}/medicines/`
      );

    setPrescriptionMedicines(
      Array.isArray(response.data)
        ? response.data
        : []
    );
  } catch (error) {
    console.error(
      "Error loading prescription medicines:",
      error
    );

    alert(
      "Unable to load prescription medicines."
    );

    setPrescriptionMedicines([]);
  } finally {
    setMedicineLoading(false);
  }
};

// ==========================================
// FIND INVENTORY MEDICINE
// ==========================================

const getInventoryMedicine =
(medicineName) => {
return medicines.find(
(medicine) =>
medicine.name
?.toLowerCase()
.trim() ===
medicineName
?.toLowerCase()
.trim()
);
};

// ==========================================
// CHECK STOCK AVAILABILITY
// ==========================================

const hasInsufficientStock =
prescriptionMedicines.some(
(prescribedMedicine) => {
const inventoryMedicine =
getInventoryMedicine(
prescribedMedicine.medicine_name
);


    if (!inventoryMedicine) {
      return true;
    }

    return (
      Number(inventoryMedicine.stock) <
      Number(
        prescribedMedicine.prescribed_quantity
      )
    );
  }
);

// ==========================================
// ISSUE MEDICINES
// ==========================================

const handleIssueMedicines =
async () => {
if (!selectedPrescription) {
alert(
"Please select a prescription."
);

    return;
  }

  if (
    prescriptionMedicines.length === 0
  ) {
    alert(
      "No medicines found in this prescription."
    );

    return;
  }


  // ========================================
  // CHECK INVENTORY BEFORE ISSUING
  // ========================================

  for (
    const prescribedMedicine of prescriptionMedicines
  ) {
    const inventoryMedicine =
      getInventoryMedicine(
        prescribedMedicine.medicine_name
      );

    if (!inventoryMedicine) {
      alert(
        `${prescribedMedicine.medicine_name} is not available in inventory.`
      );

      return;
    }

    if (
      Number(inventoryMedicine.stock) <
      Number(
        prescribedMedicine.prescribed_quantity
      )
    ) {
      alert(
        `Insufficient stock for ${prescribedMedicine.medicine_name}. Available: ${inventoryMedicine.stock}, Required: ${prescribedMedicine.prescribed_quantity}`
      );

      return;
    }
  }


  // ========================================
  // ISSUE THROUGH DJANGO BACKEND
  // ========================================

  try {
    setIssuing(true);

    const response =
      await api.post(
        `pharmacist/prescriptions/${selectedPrescription.id}/issue/`
      );

    console.log(
      "Issue response:",
      response.data
    );

    alert(
      "Medicines issued successfully!"
    );


    // ======================================
    // REFRESH BACKEND DATA
    // ======================================

    await Promise.all([
      loadMedicines(),
      loadPrescriptions(),
    ]);


    // ======================================
    // CLEAR SELECTION
    // ======================================

    setSelectedPrescription(
      null
    );

    setPrescriptionMedicines(
      []
    );

    setSearchPatient("");

  } catch (error) {
    console.error(
      "Error issuing medicines:",
      error.response?.data || error
    );

    const message =
      error.response?.data?.detail ||
      "Unable to issue medicines. Please check the backend.";

    alert(message);

  } finally {
    setIssuing(false);
  }
};

// ==========================================
// LOADING
// ==========================================

if (loading) {
return ( <div className="allotment"> <h1>
Allot Medicine </h1>


    <p>
      Loading prescriptions...
    </p>
  </div>
);


}

// ==========================================
// ERROR
// ==========================================

if (error) {
return ( <div className="allotment"> <h1>
Allot Medicine </h1>

    <p
      style={{
        color: "red",
      }}
    >
      {error}
    </p>

    <button
      onClick={loadPrescriptions}
    >
      Try Again
    </button>
  </div>
);

}

// ==========================================
// MAIN PAGE
// ==========================================

return ( <div className="allotment">

  <h1>
    Allot Medicine
  </h1>

  <p>
    Search for a patient and issue
    medicines according to the
    prescription.
  </p>


  {/* ==================================== */}
  {/* SEARCH */}
  {/* ==================================== */}

  <div className="search-section">

    <input
      type="text"
      placeholder="Search patient by name or patient ID..."
      value={searchPatient}
      onChange={(e) =>
        setSearchPatient(
          e.target.value
        )
      }
    />

  </div>


  {/* ==================================== */}
  {/* PRESCRIPTION RESULTS */}
  {/* ==================================== */}

  {searchPatient.trim() && (
    <div className="patient-results">

      <h3>
        Select Prescription
      </h3>

      {filteredPrescriptions.length >
      0 ? (

        filteredPrescriptions.map(
          (prescription) => (

            <div
              className="patient-item"
              key={prescription.id}
              onClick={() =>
                handleSelectPrescription(
                  prescription
                )
              }
              style={{
                cursor: "pointer",
              }}
            >

              <strong>
                {prescription.patient_name}
              </strong>

              <p>
                Patient ID:{" "}
                {prescription.patient_id}
              </p>

              <p>
                Appointment:{" "}
                {prescription.appointment_id}
              </p>

              <p>
                Doctor:{" "}
                {prescription.doctor_name}
              </p>

            </div>

          )
        )

      ) : (

        <p>
          No unissued prescription found.
        </p>

      )}

    </div>
  )}


  {/* ==================================== */}
  {/* SELECTED PRESCRIPTION */}
  {/* ==================================== */}

  {selectedPrescription && (

    <div className="prescription-section">

      <h2>
        Prescription Details
      </h2>


      {/* PATIENT DETAILS */}

      <div className="patient-details">

        <p>
          <strong>
            Patient:
          </strong>{" "}

          {
            selectedPrescription.patient_name
          }
        </p>


        <p>
          <strong>
            Patient ID:
          </strong>{" "}

          {
            selectedPrescription.patient_id
          }
        </p>


        <p>
          <strong>
            Appointment ID:
          </strong>{" "}

          {
            selectedPrescription.appointment_id
          }
        </p>


        <p>
          <strong>
            Doctor:
          </strong>{" "}

          {
            selectedPrescription.doctor_name
          }
        </p>


        <p>
          <strong>
            Date:
          </strong>{" "}

          {
            selectedPrescription.appointment_date
          }
        </p>

      </div>


      {/* ================================= */}
      {/* MEDICINE LOADING */}
      {/* ================================= */}

      {medicineLoading ? (

        <p>
          Loading prescribed medicines...
        </p>

      ) : (


        <table>

          <thead>

            <tr>

              <th>
                Medicine
              </th>

              <th>
                Dosage
              </th>

              <th>
                Duration
              </th>

              <th>
                Prescribed Quantity
              </th>

              <th>
                Available Stock
              </th>

              <th>
                Status
              </th>

            </tr>

          </thead>


          <tbody>

            {prescriptionMedicines
              .length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                >
                  No medicines found.
                </td>

              </tr>

            ) : (

              prescriptionMedicines.map(
                (
                  prescribedMedicine
                ) => {

                  const inventoryMedicine =
                    getInventoryMedicine(
                      prescribedMedicine.medicine_name
                    );

                  const hasEnoughStock =
                    inventoryMedicine &&
                    Number(
                      inventoryMedicine.stock
                    ) >=
                    Number(
                      prescribedMedicine.prescribed_quantity
                    );

                  return (

                    <tr
                      key={
                        prescribedMedicine.id
                      }
                    >

                      <td>
                        {
                          prescribedMedicine.medicine_name
                        }
                      </td>


                      <td>
                        {
                          prescribedMedicine.dosage
                        }
                      </td>


                      <td>
                        {
                          prescribedMedicine.duration
                        }
                      </td>


                      <td>
                        {
                          prescribedMedicine.prescribed_quantity
                        }
                      </td>


                      <td>

                        {inventoryMedicine
                          ? inventoryMedicine.stock
                          : "Not Available"}

                      </td>


                      <td>

                        {!inventoryMedicine
                          ? "Not Available"
                          : hasEnoughStock
                          ? "Available"
                          : "Insufficient Stock"}

                      </td>

                    </tr>

                  );
                }
              )

            )}

          </tbody>

        </table>

      )}


      {/* ================================= */}
      {/* ISSUE BUTTON */}
      {/* ================================= */}

      {!medicineLoading &&
        prescriptionMedicines.length >
          0 && (

          <button
            className="issue-button"
            onClick={
              handleIssueMedicines
            }
            disabled={
              issuing ||
              hasInsufficientStock
            }
          >

            {issuing
              ? "Issuing Medicines..."
              : hasInsufficientStock
              ? "Insufficient Stock"
              : "Issue Medicines"}

          </button>

        )}

    </div>

  )}

</div>

);
}

export default MedicineAllotment;

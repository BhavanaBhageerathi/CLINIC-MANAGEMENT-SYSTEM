import { useState } from "react";

import PharmacistDashboard from "./pages/pharmacist/PharmacistDashboard";
import MedicineInventory from "./pages/pharmacist/MedicineInventory";
import MedicineAllotment from "./pages/pharmacist/MedicineAllotment";
import PharmacyBilling from "./pages/pharmacist/PharmacyBilling";
import SalesReports from "./pages/pharmacist/SalesReports";
import StockHistory from "./pages/pharmacist/StockHistory";

import PharmacistSidebar from "./components/pharmacist/PharmacistSidebar";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  // Shared medicine inventory
  const [medicines, setMedicines] = useState([]);

  // Shared issued prescriptions
  const [issuedPrescriptions, setIssuedPrescriptions] =
    useState([]);

  // Shared stock history
  const [stockHistory, setStockHistory] =
    useState([]);

  // Shared pharmacy bills
  const [bills, setBills] = useState([]);

  return (
    <div className="app-layout">
      {/* SIDEBAR */}

      <PharmacistSidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* MAIN CONTENT */}

      <main className="main-content">

        {/* DASHBOARD */}

        {activePage === "dashboard" && (
          <PharmacistDashboard
            medicines={medicines}
            issuedPrescriptions={issuedPrescriptions}
            bills={bills}
          />
        )}

        {/* MEDICINE INVENTORY */}

        {activePage === "inventory" && (
          <MedicineInventory
            medicines={medicines}
            setMedicines={setMedicines}
            stockHistory={stockHistory}
            setStockHistory={setStockHistory}
          />
        )}

        {/* ALLOT MEDICINE */}

        {activePage === "allotment" && (
          <MedicineAllotment
            medicines={medicines}
            setMedicines={setMedicines}
            issuedPrescriptions={issuedPrescriptions}
            setIssuedPrescriptions={
              setIssuedPrescriptions
            }
            stockHistory={stockHistory}
            setStockHistory={setStockHistory}
          />
        )}

        {/* PHARMACY BILLING */}

        {activePage === "billing" && (
          <PharmacyBilling
            issuedPrescriptions={issuedPrescriptions}
            medicines={medicines}
            bills={bills}
            setBills={setBills}
          />
        )}

        {/* SALES REPORTS */}

        {activePage === "reports" && (
          <SalesReports bills={bills} />
        )}

        {/* STOCK HISTORY */}

        {activePage === "stock-history" && (
          <StockHistory />
        )}

      </main>
    </div>
  );
}

export default App;
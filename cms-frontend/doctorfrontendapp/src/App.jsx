import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import TodayAppointments from "./pages/doctor/TodayAppointments";
import UpcomingAppointments from "./pages/doctor/UpcomingAppointments";
import StartConsultation from "./pages/doctor/StartConsultation";
import ConsultationHistory from "./pages/doctor/ConsultationHistory";
import PatientFile from "./pages/doctor/PatientFile";
import MedicalHistory from "./pages/doctor/MedicalHistory";
import Consultation from "./pages/doctor/Consultation";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* Temporary route */}
                <Route
                    path="/"
                    element={<Navigate to="/doctor" />}
                />

                <Route
                    path="/doctor"
                    element={<DoctorDashboard />}
                />

                <Route
                    path="/doctor/today"
                    element={<TodayAppointments />}
                />

                <Route
                    path="/doctor/upcoming"
                    element={<UpcomingAppointments />}
                />

                <Route
                    path="/doctor/consultation"
                    element={<StartConsultation />}
                />

                <Route
                    path="/doctor/patient/:patientId/history"
                    element={<MedicalHistory />}
                />

                <Route
                    path="/doctor/patient/:appointmentId"
                    element={<PatientFile />}
                />
                <Route
                    path="/doctor/consultation/:appointmentId"
                    element={<Consultation />}
                />

                <Route
                    path="/doctor/history"
                    element={<ConsultationHistory />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;

import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

/* ---------------- CONSTANTS & HELPERS ---------------- */
const API_BASE = "https://smart-healthcare-app-e0cx.onrender.com/api";
const SOCKET_BASE = "https://smart-healthcare-app-e0cx.onrender.com";

// Headers for authenticated API requests
const authHeaders = () => {
    const t = localStorage.getItem("token");
    return t ? { Authorization: `Bearer ${t}` } : {};
};




const fmtDate = (iso) => (iso ? new Date(iso).toLocaleString() : "N/A");

// Updated status classes for a softer, more professional look with subtle rings
const getStatusClasses = (status) => {
    switch (status) {
        case 'Confirmed':
            return 'bg-green-50 text-green-700 ring-green-600/20';
        case 'Rejected':
            return 'bg-red-50 text-red-700 ring-red-600/20';
        case 'Pending':
        case 'Scheduled':
            return 'bg-yellow-50 text-yellow-700 ring-yellow-600/20';
        default:
            return 'bg-gray-50 text-gray-700 ring-gray-500/10';
    }
};

/* ---------------- INLINE SVG ICONS ---------------- */
const Icon = ({ children, className = "w-5 h-5" }) => <svg className={className} fill="currentColor" viewBox="0 0 24 24">{children}</svg>;

const DoctorIcon = (props) => <Icon {...props}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-6h-2v6zm0-8h2V7h-2v2z" /></Icon>;
const CalendarCheckIcon = (props) => <Icon {...props}><path d="M19 4h-3V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V8h14v12zm-3.5-9.5l-1-1-4 4-2-2-1 1 3 3 5-5z" /></Icon>;
const ClockIcon = (props) => <Icon {...props}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-.9 14.5l-4.7-4.7L7.8 9.2l3.4 3.4V7h1.4v6.2l-4.3 4.3z" /></Icon>;
const SignOutIcon = (props) => <Icon {...props}><path d="M13 3h-2v10h2V3zm4.5 13.5l-1.4-1.4 2.1-2.1H5v-2h13.2l-2.1-2.1 1.4-1.4 4.5 4.5z" /></Icon>;
const TimesCircleIcon = (props) => <Icon {...props}><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" /></Icon>;
const CheckCircleIcon = (props) => <Icon {...props}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" /></Icon>;
const SpinnerIcon = (props) => <Icon {...props}><path d="M12 4V2C6.48 2 2 6.48 2 12h2c0-3.31 2.69-6 6-6z" /></Icon>;
const FileMedicalIcon = (props) => <Icon {...props}><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-3 15h2v-3h3v-2h-3V9h-2v3H8v2h3v3zm4-10V3.5L18.5 9H15z"/></Icon>;
const UserGroupIcon = (props) => <Icon {...props}><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.54.89 2.5 2.14 2.5 3.45V19h7v-2.5c0-2.33-4.67-3.5-7-3.5z"/></Icon>;


/* ---------------- INLINE COMPONENTS ---------------- */

// Fixed Header/Taskbar (Enhanced Design - Now Full Width)
const Header = ({ doctorName, doctorImage, toggleSidebar }) => {
    return (
        <header className="fixed top-0 right-0 left-0 h-16 bg-white border-b border-gray-100 shadow-sm z-30">
            <div className="flex items-center justify-between h-full px-4 md:px-6">
                
                {/* Logo/App Name and Mobile Menu Button (Left side on mobile) */}
                <div className="flex items-center gap-2 md:gap-3">
                    <button 
                        className="p-2 bg-blue-600 text-white rounded-md shadow-md md:hidden hover:bg-blue-700 transition-colors" 
                        onClick={toggleSidebar}
                        aria-label="Open Menu"
                    >
                        <ClockIcon className="w-5 h-5" />
                    </button>
                    <CalendarCheckIcon className="w-6 h-6 text-blue-600 hidden md:block" />
                    <h1 className="text-lg md:text-xl font-bold text-gray-800 tracking-tight">Doctor Portal</h1>
                </div>


                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="font-semibold text-gray-800">Dr.{doctorName}</p>
                        <p className="text-xs text-gray-500">Verified Professional</p>
                    </div>
                    <img
                        src={doctorImage || `https://placehold.co/40x40/4f46e5/ffffff?text=D`}
                        alt={`Dr.${doctorName} profile`}
                        className="w-10 h-10 rounded-full object-cover border-2 border-blue-400 shadow-sm"
                    />
                </div>
            </div>
        </header>
    );
};


// Responsive Sidebar for Doctor Portal (Positioned under the Header)
const Sidebar = ({ activeTab, setActiveTab, logout, doctorName, isVerified, isOpen, setIsOpen }) => {
    // Reusable Sidebar Button (Enhanced Hover/Active States)
    const SidebarButton = ({ label, icon: Icon, active, onClick }) => (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition duration-200 
                ${active ? 'bg-blue-700 text-white font-semibold shadow-inner' : 'hover:bg-gray-700 text-gray-300'}`}
        >
            <Icon className="w-5 h-5" />
            {label}
        </button>
    );

    return (
        <>
            {/* Overlay for mobile view */}
            {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsOpen(false)}></div>}
            
            {/* Sidebar Content - Uses md:fixed, md:top-16 (to sit under 4rem header) and md:h-[calc(100vh-4rem)] */}
            <aside 
                className={`
                    fixed top-0 left-0 h-full w-64 bg-gray-900 text-white p-6 shadow-2xl flex flex-col justify-between z-50 
                    transform transition-transform duration-300
                    md:fixed md:top-16 md:h-[calc(100vh-4rem)] md:translate-x-0
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div>
                    {/* <div className="text-2xl font-bold text-blue-400 mb-8 flex items-center justify-between">
                        <span className="flex items-center gap-2"><DoctorIcon className="w-6 h-6" />Dr. {doctorName || 'Portal'}</span>
                        <TimesCircleIcon className="w-6 h-6 md:hidden cursor-pointer hover:text-blue-200" onClick={() => setIsOpen(false)} />
                    </div> */}
                    {/* CRITICAL: Only show navigation links if verified */}
                    {isVerified && (
                        <nav className="space-y-3">
                            <SidebarButton label="Dashboard" icon={CalendarCheckIcon} active={activeTab === "dashboard"} onClick={() => { setActiveTab("dashboard"); setIsOpen(false); }} />
                            <SidebarButton label="Appointments" icon={ClockIcon} active={activeTab === "appointments"} onClick={() => { setActiveTab("appointments"); setIsOpen(false); }} />
                            <SidebarButton label="Prescriptions" icon={FileMedicalIcon} active={activeTab === "prescriptions"} onClick={() => { setActiveTab("prescriptions"); setIsOpen(false); }} />
                            <SidebarButton label="Patients (List)" icon={UserGroupIcon} active={activeTab === "patients"} onClick={() => { setActiveTab("patients"); setIsOpen(false); }} />
                                <SidebarButton 
  label="Reviews ⭐" 
  icon={FileMedicalIcon} 
  active={activeTab === "reviews"} 
  onClick={() => { setActiveTab("reviews"); setIsOpen(false); }} 
/>
                            <SidebarButton label="Profile" icon={DoctorIcon} active={activeTab === "profile"} onClick={() => { setActiveTab("profile"); setIsOpen(false); }} />
                        </nav>
                    )}
                </div>
                <button onClick={logout} className="w-full mt-10 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 transition duration-200 rounded-lg shadow-md text-white font-medium">
                    <SignOutIcon className="w-5 h-5" /> Logout
                </button>
            </aside>
        </>
    );
};

// Reusable Stat Card (Enhanced Design)
const StatCard = ({ title, value, color, icon: Icon }) => (
    <div className={`${color} text-white p-5 rounded-xl shadow-lg flex justify-between items-center transform transition duration-300 hover:scale-[1.02] hover:shadow-xl`}>
        <div>
            <div className="text-sm font-medium opacity-80">{title}</div>
            <div className="text-4xl font-extrabold mt-1">{value}</div>
        </div>
        <Icon className="w-9 h-9 opacity-70" />
    </div>
);

// Single Appointment Card (Enhanced Design, especially History Modal)
const AppointmentCard = ({ appt, handleAccept, handleReject, actionLoading, showActions }) => {
    const patientName = appt.patient?.name || appt.patient || 'Unknown Patient';
    const patientPhone = appt.patient?.phone || 'N/A';
    const appointmentTime = fmtDate(appt.time);
    const statusClass = getStatusClasses(appt.status);
    
    // History Modal State
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const HistoryModal = ({ patient }) => {
        if (!patient || !patient.prescriptionHistory) {
            return (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white p-6 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform scale-95 md:scale-100 transition-transform duration-300">
                        <div className="flex justify-between items-center border-b pb-3 mb-4">
                            <h3 className="text-xl font-bold text-blue-700">Patient History: {patient?.name || 'N/A'}</h3>
                            <button onClick={() => setIsHistoryOpen(false)} className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100">
                                <TimesCircleIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="text-gray-500 py-4 text-center">No detailed medical history available.</div>
                    </div>
                </div>
            );
        }

        const history = patient.prescriptionHistory;
        
        // Find latest diagnosis (assuming title contains diagnosis or disease name)
        const latestDiagnosis = history[0]?.title || 'N/A';

        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-white p-6 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform scale-95 md:scale-100 transition-transform duration-300">
                    <div className="flex justify-between items-center border-b pb-3 mb-4">
                        <h3 className="text-xl font-bold text-blue-700">Patient History: {patient.name}</h3>
                        <button onClick={() => setIsHistoryOpen(false)} className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100">
                            <TimesCircleIcon className="w-6 h-6" />
                        </button>
                    </div>
                    
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <p className="font-semibold text-gray-800">Contact: {patient.phone || 'N/A'}</p>
                        <p className="font-semibold text-gray-800">Address: {patient.address || 'N/A'}</p>
                        <p className="text-sm text-gray-600 mt-2">Latest Diagnosis: <span className="font-medium text-blue-600">{latestDiagnosis}</span></p>
                    </div>

                    <h4 className="font-bold text-gray-700 text-lg mb-3">Prescription History ({history.length})</h4>
                    
                    {history.length === 0 ? (
                        <p className="text-gray-500 italic py-4 text-center">No prior prescriptions found.</p>
                    ) : (
                        <div className="space-y-4">
                            {history.map((p, index) => (
                                <div key={p._id || index} className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                                        <div className="font-bold text-base text-gray-800">{p.title || 'Prescription'}</div>
                                        <div className="text-xs text-gray-600 mt-1 sm:mt-0">{fmtDate(p.date || p.createdAt)}</div>
                                    </div>
                                    <div className="text-sm text-gray-700 space-y-1">
                                        <p className="text-xs font-semibold text-blue-600">Prescribed by: Dr. {p.doctor?.name || 'N/A'}</p>
                                        <p className="font-medium text-gray-800 mt-2">Medicines:</p>
                                        <ul className="list-disc list-inside ml-4 text-gray-700">
                                            {Array.isArray(p.medicines) ? p.medicines.map((m, i) => <li key={i}>{m}</li>) : <li>{p.medicines || 'None'}</li>}
                                        </ul>
                                        <p className="font-medium text-gray-800 mt-3">Notes/Instructions:</p>
                                        <p className="italic text-xs text-gray-600 bg-gray-50 p-2 rounded">{p.notes || 'None'}</p>
                                    </div>
                                    {p.additionalFile && (
                                        <div className="mt-3">
                                            <a 
                                                href={p.additionalFile} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                            >
                                                <FileMedicalIcon className="w-4 h-4 mr-1" /> View Attached Document
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };


    return (
        <div className="flex flex-col sm:flex-row justify-between items-start bg-white p-5 rounded-xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
            {isHistoryOpen && <HistoryModal patient={appt.patient} />}
            
            {/* Details */}
            <div className="flex-1 space-y-1">
                <div className="text-lg font-bold text-blue-700">{patientName}</div>
                <div className="text-sm text-gray-700 font-medium flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-blue-500" /> {appointmentTime}
                </div>
                <div className="text-sm text-gray-500">
                    <span className="font-semibold">Contact:</span> {patientPhone}
                </div>
                <div className="text-xs text-gray-600 italic pt-1">
                    Reason: {appt.notes || 'General consultation'}
                </div>
                
                {/* History Button (Now Visible and Styled) */}
                <button 
                    onClick={() => setIsHistoryOpen(true)}
                    className="mt-3 text-xs text-indigo-600 hover:underline font-semibold flex items-center gap-1 p-2 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors"
                >
                    <FileMedicalIcon className="w-4 h-4" /> View Full History
                </button>
            </div>

            {/* Status & Actions */}
            <div className="flex flex-col items-end gap-2 mt-4 sm:mt-0 sm:ml-4">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ring-1 ring-inset ${statusClass}`}>
                    {appt.status || 'Pending'}
                </span>
                
                {showActions && (appt.status === 'Pending' || appt.status === 'Scheduled') && (
                    <div className="flex gap-2 mt-2">
                        <button 
                            onClick={() => handleAccept(appt._id)}
                            disabled={actionLoading}
                            className="text-white px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 transition text-sm disabled:opacity-50 flex items-center justify-center gap-1 shadow-sm"
                        >
                            {actionLoading ? <SpinnerIcon className="w-4 h-4 animate-spin" /> : <CheckCircleIcon className="w-4 h-4" />} Accept
                        </button>
                        <button 
                            onClick={() => handleReject(appt._id)}
                            disabled={actionLoading}
                            className="text-white px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 transition text-sm disabled:opacity-50 flex items-center justify-center gap-1 shadow-sm"
                        >
                            {actionLoading ? <SpinnerIcon className="w-4 h-4 animate-spin" /> : <TimesCircleIcon className="w-4 h-4" />} Reject
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Main Dashboard View (Enhanced Design)
const DashboardView = ({ totalAppointments, pendingAppointments, confirmedAppointments, upcoming, recentAppointments, loading, handleAccept, handleReject, actionLoading }) => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Total Appointments" value={totalAppointments} color="bg-blue-600" icon={CalendarCheckIcon} />
            <StatCard title="Pending Requests" value={pendingAppointments} color="bg-yellow-600" icon={ClockIcon} />
            <StatCard title="Confirmed Today/Future" value={confirmedAppointments} color="bg-green-600" icon={CheckCircleIcon} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Next Confirmed Appointment</h2>
            {upcoming ? (
                <div className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-md">
                    <p className="text-lg font-semibold text-gray-800">{upcoming.patient?.name || 'Patient Details Missing'}</p>
                    <p className="text-sm text-gray-600 mt-1">{fmtDate(upcoming.time)}</p>
                    <p className="text-sm text-gray-500 mt-2">Reason: <span className="italic">{upcoming.notes || 'N/A'}</span></p>
                </div>
            ) : (
                <p className="text-gray-500 p-2 italic text-center">No confirmed appointments scheduled.</p>
            )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Recent Appointment Requests</h2>
            {loading ? (
                <div className="text-center p-4 text-blue-600 flex items-center justify-center gap-2 animate-pulse"><SpinnerIcon className="w-5 h-5 animate-spin" /> Loading requests...</div>
            ) : recentAppointments.length === 0 ? (
                <p className="text-gray-500 p-2 italic text-center">No new appointment requests pending review.</p>
            ) : (
                <div className="space-y-4">
                    {recentAppointments.map(appt => (
                        <AppointmentCard 
                            key={appt._id} 
                            appt={appt} 
                            handleAccept={handleAccept} 
                            handleReject={handleReject} 
                            actionLoading={actionLoading}
                            showActions={appt.status === 'Pending' || appt.status === 'Scheduled'}
                        />
                    ))}
                </div>
            )}
        </div>
    </div>
);

// Appointments Full List View (Enhanced Design)
const AppointmentsView = ({ appointments, loading, handleAccept, handleReject, actionLoading }) => {
    const upcoming = appointments.filter(a => new Date(a.time) > new Date() && a.status !== 'Rejected')
        .sort((a, b) => new Date(a.time) - new Date(b.time));

    const history = appointments.filter(a => new Date(a.time) <= new Date() || a.status === 'Rejected')
        .sort((a, b) => new Date(b.time) - new Date(a.time));

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Appointment Management</h2>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-3">Pending & Upcoming ({upcoming.length})</h3>
                {loading ? <div className="text-center p-4 text-blue-600 flex items-center justify-center gap-2 animate-pulse"><SpinnerIcon className="w-5 h-5 animate-spin" /> Loading...</div> :
                   upcoming.length === 0 ? <p className="text-gray-500 p-2 italic text-center">No upcoming or pending appointments.</p> : (
                        <div className="space-y-4">
                            {upcoming.map(appt => (
                                <AppointmentCard 
                                    key={appt._id} 
                                    appt={appt} 
                                    handleAccept={handleAccept} 
                                    handleReject={handleReject} 
                                    actionLoading={actionLoading}
                                    showActions={appt.status === 'Pending' || appt.status === 'Scheduled'}
                                />
                            ))}
                        </div>
                    )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-3">History ({history.length})</h3>
                <div className="space-y-4">
                    {history.slice(0, 10).map(appt => (
                        <AppointmentCard 
                            key={appt._id} 
                            appt={appt} 
                            showActions={false}
                        />
                    ))}
                    {history.length > 10 && (
                        <p className="text-center text-gray-500 italic mt-4">Showing most recent 10 from {history.length} appointments.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// Prescription Writing View (Enhanced Design)
const PrescriptionsView = ({ appointments, doctorId, doctorName }) => {
    // Unique Patients logic 
    const uniquePatients = Array.from(
        new Map(appointments
            .filter(a => a.patient?._id)
            .map(a => [a.patient._id, a.patient]))
        .values()
    ).map(p => ({
        id: p._id,
        name: p.name || 'N/A',
    }));
    
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [medicines, setMedicines] = useState([    { name: "", dosage: "", frequency: "", duration: "" }]);
    const [instructions, setInstructions] = useState('');
    const [additionalFile, setAdditionalFile] = useState(null); // File state
    const [prescribeLoading, setPrescribeLoading] = useState(false);

    const handleAddMedicine = () => {
        setMedicines([...medicines, { name: "", dosage: "", frequency: "", duration: "" }]);
    };

    const handleMedicineChange = (index, field, value) => {
        const newMedicines = medicines.map((med, i) =>
            i === index ? { ...med, [field]: value } : med
        );
        setMedicines(newMedicines);
    };

    const handleRemoveMedicine = (index) => {
        setMedicines(medicines.filter((_, i) => i !== index));
    };
    
    const handleFileChange = (e) => {
        setAdditionalFile(e.target.files[0] || null);
    };

const handlePrescribe = async (e) => {
  e.preventDefault();

  if (!selectedPatientId) return toast.error("Please select a patient.");

  const validMedicines = medicines.filter(m => m.name.trim() !== '');

  if (validMedicines.length === 0 && instructions.trim() === '' && !additionalFile) {
    return toast.error("Prescription must contain medicine, instruction, or a document.");
  }

  setPrescribeLoading(true);

  try {

    const medicinesData = validMedicines.map((m) => ({
      name: m.name,
      dosage: m.dosage,
      timing: m.frequency,
      duration: m.duration || "N/A"
    }));

    const formData = new FormData();
    formData.append('patient', selectedPatientId);
    formData.append('doctor', doctorId);
    formData.append('doctorName', doctorName);
    formData.append('notes', instructions);
    formData.append('title', `Prescription from Dr. ${doctorName}`);
    formData.append('date', new Date().toISOString());

    formData.append('medicines', JSON.stringify(medicinesData));

    if (additionalFile) {
      formData.append('additionalFile', additionalFile);
    }

    const response = await axios.post(
      `${API_BASE}/prescriptions`,
      formData,
      { headers: { ...authHeaders() } }
    );

    toast.success(response.data.message || "Prescription sent!");

    // reset
    setSelectedPatientId('');
    setMedicines([{ name: "", dosage: "", frequency: "", duration: "" }]);
    setInstructions('');
    setAdditionalFile(null);

  } catch (error) {
    console.error("Prescription error:", error);
    toast.error(error.response?.data?.message || "Failed to send prescription");
  } finally {
    setPrescribeLoading(false);
  }
};
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-4xl border border-gray-100 mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Write New Prescription</h2>
            
            <form onSubmit={handlePrescribe} className="space-y-6">
                
                {/* Patient Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Patient (from appointments)</label>
                    <select
                        value={selectedPatientId}
                        onChange={(e) => setSelectedPatientId(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm transition"
                        required
                    >
                        <option value="">-- Choose Patient --</option>
                        {uniquePatients.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>

                {/* Medicines List */}
                <div className="space-y-4 p-4 border border-blue-200 rounded-xl bg-blue-50/50">
                    <h3 className="text-lg font-semibold text-gray-700">Medication Details ({medicines.length})</h3>
                    {medicines.map((med, index) => (
                        <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                            <input
                                type="text"
                                placeholder="Medicine Name"
                                value={med.name}
                                onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                                className="col-span-12 sm:col-span-5 px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                // Required logic based on having at least one item/instruction/file
                                required={index === 0 && medicines.filter(m => m.name.trim() !== '').length === 0 && instructions.trim() === '' && !additionalFile} 
                            />
                            <input
                                type="text"
                                placeholder="Dosage (e.g., 500mg)"
                                value={med.dosage}
                                onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                                className="col-span-12 sm:col-span-3 px-3 py-2 border rounded-lg"
                            />
                            <input
                                type="text"
                                placeholder="Frequency (e.g., 1-0-1)"
                                value={med.frequency}
                                onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                                className="col-span-12 sm:col-span-3 px-3 py-2 border rounded-lg"
                            />
                                        <input
              placeholder="Duration"
              value={med.duration}
              onChange={(e) =>
                handleMedicineChange(i, "duration", e.target.value)
              }
              className="border p-2 rounded"
            />
                            <button
                                type="button"
                                onClick={() => handleRemoveMedicine(index)}
                                className="col-span-12 sm:col-span-1 text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
                                disabled={medicines.length === 1}
                            >
                                <TimesCircleIcon className="w-5 h-5 mx-auto" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddMedicine}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm flex items-center gap-1 shadow-md"
                    >
                        <FileMedicalIcon className="w-4 h-4" /> Add Medicine
                    </button>
                </div>

                {/* Instructions/Notes */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">General Instructions / Notes</label>
                    <textarea
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        placeholder="Dietary recommendations, follow-up instructions, etc."
                    ></textarea>
                </div>
                
                {/* File Upload (Optional) */}
                <div className="p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Document / Scan (Optional)</label>
                    <input 
                        type="file" 
                        name="additionalFile" 
                        onChange={handleFileChange} 
                        className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition"
                    />
                    {additionalFile && <p className="text-xs text-gray-500 mt-2">Selected: {additionalFile.name}</p>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={prescribeLoading || !selectedPatientId}
                    className="w-full px-4 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl"
                >
                    {prescribeLoading ? (
                        <>
                            <SpinnerIcon className="w-5 h-5 animate-spin" /> Sending Prescription...
                        </>
                    ) : (
                        "Generate and Send Prescription"
                    )}
                </button>
            </form>
        </div>
    );
}
const ProfileView = ({ doctor }) => {
    if (!doctor) return <div className="p-4 text-gray-500">Loading profile details...</div>;

    const files = [
        { label: 'ID Proof', path: doctor.idProof },
        { label: 'License', path: doctor.license },
        { label: 'Degree/Certificates', path: doctor.degree || doctor.certificates },
    ].filter(f => f.path);

    const ProfileItem = ({ label, value }) => (
        <div className="p-2 border-b border-gray-100 last:border-b-0">
            <div className="text-sm font-medium text-gray-500">{label}</div>
            <div className="text-base font-semibold text-gray-800 mt-0.5">{value}</div>
        </div>
    );
    
    return (
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl border border-gray-100 space-y-8">
            <h2 className="text-3xl font-bold border-b pb-4 text-blue-700">My Profile Details</h2>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-200">
                    <img 
                        src={doctor.image || `https://placehold.co/100x100/4f46e5/ffffff?text=Dr`} 
                        alt={`${doctor.name} profile`} 
                        className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-md flex-shrink-0"
                    />
                    <div>
                        <h3 className="text-2xl font-extrabold text-gray-800">Dr. {doctor.name}</h3>
                        <p className="text-md text-gray-600">{doctor.specialization || 'Not Specified'}</p>
                        <span className={`mt-2 inline-flex items-center text-xs font-medium px-3 py-1 rounded-full ${doctor.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {doctor.verified ? 'Verified Professional' : 'Verification Pending'}
                        </span>
                    </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                <ProfileItem label="Email" value={doctor.email} />
                <ProfileItem label="Phone" value={doctor.phone || 'N/A'} />
                <ProfileItem label="Location" value={doctor.location || 'N/A'} />
                <ProfileItem label="Experience (Years)" value={doctor.experience || '0'} />
                <ProfileItem label="Consultation Fee" value={`₹${doctor.consultationFee || '0'}`} />
                <ProfileItem label="Joined On" value={fmtDate(doctor.createdAt) || 'N/A'} />
            </div>

             <div className="pt-4 border-t border-gray-200">
                 <h3 className="text-xl font-semibold text-gray-700 mb-3">Biography / Bio</h3>
                 <p className="text-gray-600 leading-relaxed">{doctor.bio || 'Please complete your professional bio.'}</p>
             </div>

            {files.length > 0 && (
                <div className="mt-6 border-t pt-4 border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">Supporting Documents</h3>
                    <div className="space-y-3">
                        {files.map(file => (
                            <a 
                                key={file.label}
                                href={file.path} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="block p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-600 hover:bg-blue-100 transition text-sm font-medium flex items-center gap-2"
                            >
                                <FileMedicalIcon className="w-5 h-5 flex-shrink-0" />
                                {file.label}: Click to View Document
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
const PatientsView = ({ appointments }) => {
    const uniquePatients = Array.from(
        new Map(appointments
            .filter(a => a.patient?._id)
            .map(a => [a.patient._id, a.patient]))
        .values()
    ).map(p => ({
        id: p._id,
        name: p.name || 'N/A',
        phone: p.phone || 'N/A',
        lastSeen: appointments.filter(a => a.patient?._id === p._id).pop()?.time
    })).sort((a, b) => new Date(b.lastSeen) - new Date(a.lastSeen)); // Sort by last appointment

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">My Patients List ({uniquePatients.length})</h2>
            <div className="space-y-3">
                {uniquePatients.length === 0 ? (
                    <p className="text-gray-500 italic text-center p-4">No patients recorded yet.</p>
                ) : (
                    uniquePatients.map(p => (
                        <div key={p.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-white hover:shadow-md transition flex justify-between items-center flex-wrap">
                            <div>
                                <div className="font-semibold text-lg text-blue-600">{p.name}</div>
                                <div className="text-sm text-gray-600">Phone: {p.phone}</div>
                            </div>
                            <div className="text-xs text-gray-500 text-right mt-2 sm:mt-0">
                                <div className="font-medium">Last Appointment:</div>
                                <div>{fmtDate(p.lastSeen)}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};


const ReviewsView = () => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [numReviews, setNumReviews] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
           `${API_BASE}/api/doctor/reviews`,
          { headers: authHeaders() }
        );

        setReviews(res.data.reviews);
        setRating(res.data.rating);
        setNumReviews(res.data.numReviews);

      } catch (err) {
        console.error(err);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>

      <div className="mb-4 text-yellow-600 font-semibold">
        ⭐ {rating.toFixed(1)} ({numReviews} reviews)
      </div>

      {reviews.length === 0 ? (
        <p>No reviews yet</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r, i) => (
            <div key={i} className="border p-3 rounded-lg">
              <p className="font-bold">{r.patient?.name || "Patient"}</p>
              <p className="text-yellow-500">⭐ {r.rating}</p>
              <p className="text-sm text-gray-600">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


/* ---------------- MAIN COMPONENT ---------------- */
export default function DoctorPortal() {
    const navigate = useNavigate();
    const socketRef = useRef(null);
    const doctorId = localStorage.getItem("doctorId");

    const [activeTab, setActiveTab] = useState("dashboard"); 
    const [doctor, setDoctor] = useState(null); // Contains profileCompleted and verified flags
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    
    // State to track if the doctor is authorized to view the main portal
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar open/close state

    /* ---------------- Data Loading Functions ---------------- */

    const loadDoctor = useCallback(async () => {
        try {
            const res = await axios.get(`${API_BASE}/doctor/${doctorId}`, { headers: authHeaders() });
            const docData = res.data;
            setDoctor(docData);
            
            // CRITICAL ROUTE PROTECTION CHECK
            if (docData.profileCompleted === false) {
                 navigate("/doctor/complete-profile");
                 setIsAuthorized(false); // Block dashboard view
                 return;
            } else if (docData.verified === false) {
                 navigate("/doctor/pending-verification");
                 setIsAuthorized(false); // Block dashboard view
                 return;
            }

            // If profile is complete AND verified, allow access
            setIsAuthorized(true);

        } catch (err) {
            console.error("Load Doctor Error:", err);
            if (err?.response?.status === 401) navigate("/login");
        }
    }, [doctorId, navigate]);

    const loadAppointments = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/doctor/appointments`, { headers: authHeaders() });
            const sortedAppts = Array.isArray(res.data) ? res.data.sort((a, b) => new Date(a.time) - new Date(b.time)) : [];
            setAppointments(sortedAppts);
        } catch (err) {
            console.error("Load Appointments Error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    /* ---------------- Lifecycle & Socket Setup ---------------- */

    useEffect(() => {
        if (doctorId) {
            loadDoctor();
            loadAppointments();
        } else {
            navigate("/login");
        }
    }, [doctorId, navigate, loadDoctor, loadAppointments]);

    useEffect(() => {
        if (doctorId && !socketRef.current && isAuthorized) { // Only connect if authorized
            try {
                const socket = io(SOCKET_BASE);
                socketRef.current = socket;

                socket.on('connect', () => {
                    socket.emit('registerDoctor', doctorId);
                });
                
                socket.on('newAppointment', (newAppt) => {
                    toast.success(`New Appointment Booked by ${newAppt.patient?.name || 'a patient'}!`);
                    setAppointments(prev => [newAppt, ...prev].sort((a, b) => new Date(a.time) - new Date(b.time)));
                });
                socket.on('appointmentUpdate', (updatedAppt) => {
                     setAppointments(prev => prev.map(a => 
                         a._id === updatedAppt._id ? updatedAppt : a
                     ));
                });
                socket.on('disconnect', () => {
                    console.log("Socket disconnected.");
                });

            } catch (error) {
                console.error("Socket connection error:", error);
            }
        }
        
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [doctorId, loadAppointments, isAuthorized]);


    /* ---------------- Appointment Actions ---------------- */

    const handleAction = async (apptId, action) => {
        setActionLoading(true);
        try {
            const url = `${API_BASE}/doctor/appointments/${apptId}/${action}`; 
            
            const res = await axios.put(url, {}, { headers: authHeaders() });
            const updatedAppt = res.data.appointment;

            setAppointments(prev => prev.map(a => 
                a._id === apptId ? updatedAppt : a
            ));
            
            toast.success(`Appointment ${updatedAppt.status} successfully.`);
            
        } catch (err) {
            console.error(`Appointment ${action} failed:`, err);
            toast.error(err.response?.data?.message || `Failed to ${action} appointment.`);
        } finally {
            setActionLoading(false);
        }
    };

    const handleAccept = (apptId) => handleAction(apptId, 'accept');
    const handleReject = (apptId) => handleAction(apptId, 'reject');

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("doctorId");
        if (socketRef.current) socketRef.current.disconnect();
        navigate("/login");
    };
    
    // Function to toggle sidebar (passed to Header)
    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);


    /* ---------------- Derived Data for UI ---------------- */
    const totalAppointments = appointments.length;
    const pendingAppointments = appointments.filter(a => a.status === 'Pending' || a.status === 'Scheduled').length;
    const confirmedAppointments = appointments.filter(a => a.status === 'Confirmed').length;
    const upcoming = appointments.filter(a => new Date(a.time) > new Date() && a.status === 'Confirmed').sort((a, b) => new Date(a.time) - new Date(b.time))[0];
    
    const recentAppointments = appointments
        .filter(a => a.status === 'Pending' || a.status === 'Scheduled')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
        
    // ----------------------------------------------------
    // CRITICAL RENDERING CHECKS (ROUTE PROTECTION)
    // ----------------------------------------------------
    if (!doctor) {
        // Show initial loading state
        return <div className="min-h-screen flex items-center justify-center text-xl text-blue-600"><SpinnerIcon className="w-6 h-6 animate-spin mr-2" /> Loading Doctor Profile...</div>;
    }

    if (!isAuthorized) {
        return <div className="min-h-screen flex items-center justify-center text-xl text-red-600">Access Restricted. Redirecting...</div>;
    }
    // ----------------------------------------------------
    
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            
            {/* 1. Header (Fixed Taskbar) */}
            <Header doctorName={doctor?.name} doctorImage={doctor?.image} toggleSidebar={toggleSidebar} />
            
            {/* 2. Sidebar (Fixed to left) */}
            <Sidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                logout={logout} 
                doctorName={doctor?.name} 
                isVerified={doctor?.verified} 
                isOpen={isSidebarOpen} // Pass state
                setIsOpen={setIsSidebarOpen} // Pass setter
            />

            {/* 3. Main Content Area */}
            {/* Added pt-20 (or pt-16+padding) to prevent content from hiding behind the fixed header */}
            <div className="flex-1 p-4 md:p-8 md:ml-64 pt-20 md:pt-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 mt-10 hidden md:block">Welcome back, Dr. {doctor?.name} 👋</h1>
                
                {activeTab === "dashboard" && (
                    <DashboardView
                        totalAppointments={totalAppointments}
                        pendingAppointments={pendingAppointments}
                        confirmedAppointments={confirmedAppointments}
                        upcoming={upcoming}
                        recentAppointments={recentAppointments}
                        loading={loading}
                        handleAccept={handleAccept}
                        handleReject={handleReject}
                        actionLoading={actionLoading}
                    />
                )}
                
                {activeTab === "appointments" && (
                    <AppointmentsView
                        appointments={appointments}
                        loading={loading}
                        handleAccept={handleAccept}
                        handleReject={handleReject}
                        actionLoading={actionLoading}
                    />
                )}
                
                {activeTab === "profile" && (
                    <ProfileView doctor={doctor} />
                )}

                {/* Integration of PrescriptionsView.jsx logic */}
                {activeTab === "prescriptions" && (
                    <PrescriptionsView appointments={appointments} doctorId={doctorId} doctorName={doctor?.name} />
                )}

                {activeTab === "patients" && (
                    <PatientsView appointments={appointments} />
                )}

                {activeTab === "reviews" && <ReviewsView />}
            </div>
        </div>
    );
}
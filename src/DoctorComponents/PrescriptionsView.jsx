import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

/* ---------------- CONSTANTS & HELPERS (Required from main file) ---------------- */
// Assume these are defined in your environment or parent component
const API_BASE = "https://medidost-smart-healthcare-app.onrender.com/api";
const authHeaders = () => {
    const t = localStorage.getItem("token");
    return t ? { Authorization: `Bearer ${t}` } : {};
};

// SVG Icons (You must define these in your global scope or copy them here)
const Icon = ({ children, className = "w-5 h-5" }) => <svg className={className} fill="currentColor" viewBox="0 0 24 24">{children}</svg>;
const TimesCircleIcon = (props) => <Icon {...props}><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" /></Icon>;
const SpinnerIcon = (props) => <Icon {...props}><path d="M12 4V2C6.48 2 2 6.48 2 12h2c0-3.31 2.69-6 6-6z" /></Icon>;
const FileMedicalIcon = (props) => <Icon {...props}><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-3 15h2v-3h3v-2h-3V9h-2v3H8v2h3v3zm4-10V3.5L18.5 9H15z"/></Icon>;
// ----------------------------------------------------------------------------------

/**
 * Component for Doctor to write and send prescriptions, including optional file upload.
 * It expects 'appointments', 'doctorId', and 'doctorName' as props.
 */
const PrescriptionsView = ({ appointments, doctorId, doctorName }) => {
    // Unique Patients from appointments list (to select who to prescribe to)
    const uniquePatients = Array.from(
        new Map(appointments
            .filter(a => a.patient?._id)
            .map(a => [a.patient._id, a.patient]))
        .values()
    ).map(p => ({
        id: p._id,
        name: p.name || 'N/A',
        info: p // Store full patient info for easy access
    }));
    
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [medicines, setMedicines] = useState([{ name: '', dosage: '', timing: '', duration: '' }]);
    const [instructions, setInstructions] = useState('');
    const [additionalFile, setAdditionalFile] = useState(null); // File state for optional upload
    const [prescribeLoading, setPrescribeLoading] = useState(false);

    const handleAddMedicine = () => {
        setMedicines([...medicines, { name: '', dosage: '', frequency: '' }]);
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
        
        // Filter out completely empty medicine rows
        const validMedicines = medicines.filter(m => m.name.trim() !== '');

        if (validMedicines.length === 0 && instructions.trim() === '' && !additionalFile) {
            return toast.error("Prescription must contain medicine, instruction, or a document.");
        }

        setPrescribeLoading(true);

        // We use FormData because we are sending both text fields and a file
        const formData = new FormData();
        
        // Append text fields
        formData.append('patient', selectedPatientId);
        formData.append('doctor', doctorId);
        formData.append('doctorName', doctorName);
        formData.append('notes', instructions);
        formData.append('title', `Prescription from Dr. ${doctorName || 'N/A'}`);
        formData.append('date', new Date().toISOString());
        
        // Append medicines array (stringified)
        formData.append('medicines', JSON.stringify(validMedicines.map(m => `${m.name} (${m.dosage}, ${m.frequency})`)));

        // Append file (optional)
        if (additionalFile) {
            formData.append('additionalFile', additionalFile);
        }

        try {
            // Using axios.post with FormData; Content-Type header is set automatically
            const response = await axios.post(`${API_BASE}/prescriptions`, formData, { 
                headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } 
            });

            // Assuming the backend returns the prescription object upon success
            toast.success(response.data.message || "Prescription successfully sent to patient!");
            
            // Reset form state
            setSelectedPatientId('');
            setMedicines([{ name: '', dosage: '', frequency: '' }]);
            setInstructions('');
            setAdditionalFile(null);
        } catch (error) {
            console.error("Prescription sending error:", error);
            toast.error(error.response?.data?.message || "Failed to send prescription. Check network/backend.");
        } finally {
            setPrescribeLoading(false);
        }
    };
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-4xl border border-gray-100 mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Write New Prescription</h2>
            
            <form onSubmit={handlePrescribe} className="space-y-6">
                
                {/* Patient Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Patient (from appointments)</label>
                    <select
                        value={selectedPatientId}
                        onChange={(e) => setSelectedPatientId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="">-- Choose Patient --</option>
                        {uniquePatients.map(p => (
                            <option key={p.id} value={p.id}>
  {p.name}
</option>
                        ))}
                    </select>
                </div>

                {/* Medicines List */}
                <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-700">Medicines ({medicines.length})</h3>
                    {medicines.map((med, index) => (
                        <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                            <input
                                type="text"
                                placeholder="Medicine Name"
                                value={med.name}
                                onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                                className="col-span-12 sm:col-span-5 px-3 py-2 border rounded-lg"
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
                            <button
                                type="button"
                                onClick={() => handleRemoveMedicine(index)}
                                className="col-span-12 sm:col-span-1 text-red-500 hover:text-red-700 disabled:opacity-50"
                                disabled={medicines.length === 1}
                            >
                                <TimesCircleIcon className="w-5 h-5 mx-auto" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddMedicine}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm flex items-center gap-1"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Dietary recommendations, follow-up instructions, etc."
                    ></textarea>
                </div>
                
                {/* File Upload (Optional) */}
                <div className="p-4 border border-dashed rounded-lg bg-gray-50">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Document / Scan (Optional)</label>
                    <input 
                        type="file" 
                        name="additionalFile" 
                        onChange={handleFileChange} 
                        className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {additionalFile && <p className="text-xs text-gray-500 mt-2">Selected: {additionalFile.name}</p>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={prescribeLoading || !selectedPatientId}
                    className="w-full px-4 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
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
};

export default PrescriptionsView;
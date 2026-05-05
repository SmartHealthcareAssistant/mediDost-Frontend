import { useState, useEffect } from "react";

export default function Prescriptions({ patients = [] }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [form, setForm] = useState({
    patient: "",
    medicine: "",
    dosage: "",
    notes: "",
  });

  // fetch prescriptions from backend
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await fetch("https://medidost-smart-healthcare-app.onrender.com/api/prescriptions", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
})
        const data = await res.json();
        setPrescriptions(data);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
      }
    };
    fetchPrescriptions();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patient || !form.medicine) return;

    const newPrescription = { ...form, id: Date.now() };

    try {
      const res = await fetch("https://medidost-smart-healthcare-app.onrender.com/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPrescription),
      });
      const saved = await res.json();
      setPrescriptions((prev) => [...prev, saved.data]);
    } catch (error) {
      console.error("Error saving prescription:", error);
    }

    setForm({ patient: "", medicine: "", dosage: "", notes: "" });
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Prescriptions</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-xl p-6 mb-6 space-y-4"
      >
        <div>
          <label className="block font-medium">Select Patient</label>
          <select
            name="patient"
            value={form.patient}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1"
          >
            <option value="">-- Choose Patient --</option>
            {patients.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name} (Age {p.age})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Medicine</label>
          <input
            type="text"
            name="medicine"
            value={form.medicine}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1"
            placeholder="Enter medicine"
          />
        </div>

        <div>
          <label className="block font-medium">Dosage</label>
          <input
            type="text"
            name="dosage"
            value={form.dosage}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1"
            placeholder="e.g. 2 times a day"
          />
        </div>

        <div>
          <label className="block font-medium">Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1"
            placeholder="Additional instructions"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Save Prescription
        </button>
      </form>

      {/* List */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">All Prescriptions</h2>
        {prescriptions.length === 0 ? (
          <p className="text-gray-500">No prescriptions yet.</p>
        ) : (
          <ul className="space-y-4">
            {prescriptions.map((p) => (
              <li
                key={p.id}
                className="border rounded-lg p-4 hover:shadow transition"
              >
                <p className="font-bold">{p.patient}</p>
                <p>
                  <span className="font-medium">Medicine:</span> {p.medicine}
                </p>
                <p>
                  <span className="font-medium">Dosage:</span> {p.dosage}
                </p>
                {p.notes && (
                  <p>
                    <span className="font-medium">Notes:</span> {p.notes}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

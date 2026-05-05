import { useEffect, useState } from "react";

export default function Patients({ patients }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [expandedPatient, setExpandedPatient] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await fetch("https://medidost-smart-healthcare-app-txxt.onrender.com/prescriptions");
        const data = await res.json();
        setPrescriptions(data);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
      }
    };

    fetchPrescriptions();
  }, []);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Patients</h1>

      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded-xl">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Age</th>
              <th className="p-3 text-left">Condition</th>
              <th className="p-3 text-left">History</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{patient.id}</td>
                <td className="p-3">{patient.name}</td>
                <td className="p-3">{patient.age}</td>
                <td className="p-3">{patient.condition}</td>
                <td className="p-3">
                  <button
                    onClick={() =>
                      setExpandedPatient(
                        expandedPatient === patient.id ? null : patient.id
                      )
                    }
                    className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                  >
                    {expandedPatient === patient.id
                      ? "Hide History"
                      : "View History"}
                  </button>

                  {expandedPatient === patient.id && (
                    <div className="mt-3 bg-gray-50 p-3 rounded-lg shadow-inner">
                      <h3 className="font-semibold mb-2">Prescriptions:</h3>
                      {prescriptions.filter((p) => p.patient === patient.name).length === 0 ? (
                        <p className="text-gray-500 text-sm">No prescriptions yet.</p>
                      ) : (
                        <ul className="list-disc pl-5 space-y-1">
                          {prescriptions
                            .filter((p) => p.patient === patient.name)
                            .map((p, index) => (
                              <li key={index} className="text-sm">
                                <span className="font-medium">{p.medicine}</span>{" "}
                                ({p.dosage}) – {p.notes || "No notes"}
                              </li>
                            ))}
                        </ul>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

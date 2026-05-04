import { useState } from "react";

export default function Profile({ profile, setProfile, doctorId }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`https://smart-healthcare-app-e0cx.onrender.com/api/doctor/${doctorId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const updated = await res.json();
      setProfile(updated);
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="bg-white shadow rounded-xl p-6 space-y-4">
        {editing ? (
          <>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              placeholder="Name"
            />
            <input
              name="specialty"
              value={form.specialty}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              placeholder="Specialty"
            />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              placeholder="Email"
            />
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Specialty:</strong> {profile.specialty}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <button
              onClick={() => setEditing(true)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
}

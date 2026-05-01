import { useState, useEffect } from 'react';

export default function Profile() {
  const [form, setForm] = useState({
    name: '',
    shopName: '',
    address: '',
    contact: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('pharmacistProfile');
    if (saved) setForm(JSON.parse(saved));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('pharmacistProfile', JSON.stringify(form));
    alert('Profile updated successfully!');
  };

  const handleLogout = () => {
    if (confirm('Do you want to clear your profile info?')) {
      localStorage.removeItem('pharmacistProfile');
      setForm({ name: '', shopName: '', address: '', contact: '' });
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Pharmacist Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange}
          placeholder="Your Name" className="border w-full rounded p-2" />

        <input name="shopName" value={form.shopName} onChange={handleChange}
          placeholder="Shop Name" className="border w-full rounded p-2" />

        <input name="address" value={form.address} onChange={handleChange}
          placeholder="Shop Address" className="border w-full rounded p-2" />

        <input name="contact" value={form.contact} onChange={handleChange}
          placeholder="Contact Number" className="border w-full rounded p-2" />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Save
        </button>
      </form>

      <button onClick={handleLogout} className="mt-6 bg-red-500 text-white px-4 py-2 rounded w-full">
        Clear Profile
      </button>
    </div>
  );
}

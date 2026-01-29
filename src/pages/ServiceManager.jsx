import { useEffect, useState } from "react";
const API = "http://localhost:5000";

export default function ServiceManager() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  function load() {
    fetch(`${API}/api/services`)
      .then(r => r.json())
      .then(setServices);
  }

  function handleSubmit() {
    if (!form.title.trim()) return;

    const url = editingId
      ? `${API}/api/services/${editingId}`
      : `${API}/api/services`;

    const method = editingId ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    }).then(() => {
      setEditingId(null);
      setForm({ title: "", description: "" });
      load();
    });
  }

  function editService(service) {
    setEditingId(service.id);
    setForm({
      title: service.title,
      description: service.description
    });
  }

  function deleteService(id) {
    fetch(`${API}/api/services/${id}`, { method: "DELETE" }).then(load);
  }

  useEffect(load, []);

  return (
    <div className="mt-14">

      {/* SECTION HEADER */}
      <h2 className="text-2xl font-semibold text-blue-400 mb-6">
        Services Manager
      </h2>

      {/* FORM CARD */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-8 backdrop-blur">

        <p className="text-gray-400 mb-4">
          {editingId ? "Edit Service" : "Add New Service"}
        </p>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Service Title"
            className="bg-[#0f172a] border border-white/20 px-3 py-2 rounded text-sm"
          />

          <input
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Service Description"
            className="bg-[#0f172a] border border-white/20 px-3 py-2 rounded text-sm"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded text-sm"
        >
          {editingId ? "Update Service" : "Add Service"}
        </button>
      </div>

      {/* SERVICES LIST */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-[#0f172a] text-gray-300">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {services.map(s => (
              <tr
                key={s.id}
                className="border-t border-white/10 hover:bg-white/5 transition"
              >
                <td className="p-3">{s.title}</td>

                <td className="p-3 text-gray-300 break-words">
                  {s.description}
                </td>

                <td className="p-3 text-center space-x-4">
                  <button
                    onClick={() => editService(s)}
                    className="text-yellow-400 hover:text-yellow-500"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteService(s.id)}
                    className="text-red-400 hover:text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

        {services.length === 0 && (
          <p className="p-4 text-gray-400">No services added yet.</p>
        )}
      </div>
    </div>
  );
}
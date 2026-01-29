import { useEffect, useState } from "react";
const API = "http://localhost:5000";

export default function PortfolioManager() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: "", image: "", link: "" });
  const [editingId, setEditingId] = useState(null);

  function load() {
    fetch(`${API}/api/projects`)
      .then(r => r.json())
      .then(setProjects);
  }

  function handleSubmit() {
    if (!form.title.trim()) return;

    const url = editingId
      ? `${API}/api/projects/${editingId}`
      : `${API}/api/projects`;

    const method = editingId ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    }).then(() => {
      setEditingId(null);
      setForm({ title: "", image: "", link: "" });
      load();
    });
  }

  function editProject(project) {
    setEditingId(project.id);
    setForm({
      title: project.title,
      image: project.image,
      link: project.link
    });
  }

  function deleteProject(id) {
    fetch(`${API}/api/projects/${id}`, { method: "DELETE" }).then(load);
  }

  useEffect(load, []);

  return (
    <div className="mt-14">

      {/* SECTION HEADER */}
      <h2 className="text-2xl font-semibold text-blue-400 mb-6">
        Portfolio Projects
      </h2> 


      {/* FORM CARD */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-8 backdrop-blur">

        <p className="text-gray-400 mb-4">
          {editingId ? "Edit Project" : "Add New Project"}
        </p>

        <div className="grid md:grid-cols-3 gap-4">

          <input
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Project Title"
            className="bg-[#0f172a] border border-white/20 px-3 py-2 rounded text-sm"
          />

          <input
            value={form.image}
            onChange={e => setForm({ ...form, image: e.target.value })}
            placeholder="Image URL"
            className="bg-[#0f172a] border border-white/20 px-3 py-2 rounded text-sm"
          />

          <input
            value={form.link}
            onChange={e => setForm({ ...form, link: e.target.value })}
            placeholder="Project Link"
            className="bg-[#0f172a] border border-white/20 px-3 py-2 rounded text-sm"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded text-sm"
        >
          {editingId ? "Update Project" : "Add Project"}
        </button>
      </div>

      {/* PROJECT LIST */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-[#0f172a] text-gray-300">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Link</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {projects.map(p => (
              <tr
                key={p.id}
                className="border-t border-white/10 hover:bg-white/5 transition"
              >
                <td className="p-3">{p.title}</td>

                <td className="p-3 text-blue-300 break-all">
                  {p.image}
                </td>

                <td className="p-3 text-green-300 break-all">
                  {p.link}
                </td>

                <td className="p-3 text-center space-x-4">
                  <button
                    onClick={() => editProject(p)}
                    className="text-yellow-400 hover:text-yellow-500"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteProject(p.id)}
                    className="text-red-400 hover:text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

        {projects.length === 0 && (
          <p className="p-4 text-gray-400">No projects added yet.</p>
        )}
      </div>
    </div>
  );
}  
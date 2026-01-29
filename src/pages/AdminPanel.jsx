import { useEffect, useState } from "react";

// Page imports
import ServiceManager from "./ServiceManager";
import PortfolioManager from "./PortfolioManager";

const API = "http://localhost:5000";

export default function AdminPanel() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load enquiries safely
  useEffect(() => {
    async function fetchEnquiries() {
      try {
        const res = await fetch(`${API}/api/contacts`);
        const data = await res.json();
        setEnquiries(data);
      } catch {
        alert("Failed to load enquiries");
      } finally {
        setLoading(false);
      }
    }

    fetchEnquiries();
  }, []);

  // Reload helper
  async function reloadEnquiries() {
    const res = await fetch(`${API}/api/contacts`);
    const data = await res.json();
    setEnquiries(data);
  }

  // Delete enquiry
  async function deleteEnquiry(id) {
    if (!window.confirm("Delete this enquiry?")) return;

    await fetch(`${API}/api/contact/${id}`, {
      method: "DELETE",
    });

    reloadEnquiries();
  }

  // Update status
  async function updateStatus(id, status) {
    await fetch(`${API}/api/contact/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    reloadEnquiries();
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-400">
          Zaarix Admin Dashboard
        </h1>

        <a
          href="/"
          className="bg-red-500 px-4 py-1 rounded hover:bg-red-600 transition"
        >
          Logout
        </a>
      </div>

      {/* DASHBOARD CARDS */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card title="Total" value={enquiries.length} />
        <Card title="New" value={enquiries.filter(e => e.status === "new").length} />
        <Card title="In Progress" value={enquiries.filter(e => e.status === "inprogress").length} />
        <Card title="Closed" value={enquiries.filter(e => e.status === "closed").length} />
      </div>

      {/* ENQUIRIES TABLE */}
      <div className="overflow-x-auto border border-white/10 rounded mb-14">

        {loading ? (
          <p className="p-4">Loading...</p>
        ) : enquiries.length === 0 ? (
          <p className="p-4">No enquiries found.</p>
        ) : (
          <table className="w-full text-sm border-collapse">

            <thead className="bg-[#0f172a] text-gray-300">
              <tr>
                <th className="p-3 text-left">Client</th>
                <th className="p-3 text-left">Contact</th>
                <th className="p-3 text-left">Service</th>
                <th className="p-3 text-left">Message</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {enquiries.map((e) => (
                <tr
                  key={e.id}
                  className="border-t border-white/10 hover:bg-white/5 transition"
                >
                  {/* Client */}
                  <td className="p-3">
                    <p className="font-medium">{e.name}</p>
                    <p className="text-gray-400 text-xs">
                      {new Date(e.created_at).toLocaleString()}
                    </p>
                  </td>

                  {/* Contact */}
                  <td className="p-3 text-blue-300 text-sm">
                    <p>{e.email}</p>
                    <p className="text-gray-400">{e.phone || "-"}</p>
                  </td>

                  {/* Service */}
                  <td className="p-3">
                    <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                      {e.service || "Not Selected"}
                    </span>
                  </td>

                  {/* Message */}
                  <td className="p-3 text-gray-300 break-words max-w-xs">
                    {e.message}
                  </td>

                  {/* Status */}
                  <td className="p-3 text-center">
                    <select
                      value={e.status}
                      onChange={(ev) => updateStatus(e.id, ev.target.value)}
                      className="bg-[#0f172a] border border-white/20 rounded px-2 py-1 text-sm"
                    >
                      <option value="new">New</option>
                      <option value="inprogress">In Progress</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>

                  {/* Action */}
                  <td className="p-3 text-center">
                    <button
                      onClick={() => deleteEnquiry(e.id)}
                      className="text-red-400 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>

      {/* SERVICES MANAGER */}
      <ServiceManager mode="admin" />

      {/* PROJECTS MANAGER */}
      <PortfolioManager mode="admin" />
    </div>
  );
}

/* CARD COMPONENT */
function Card({ title, value }) {
  return (
    <div className="bg-white/5 p-4 rounded border border-white/10">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-2xl text-blue-400">{value}</h2>
    </div>
  );
}

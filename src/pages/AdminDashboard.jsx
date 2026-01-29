import { useEffect, useState } from "react";

const API = "http://localhost:5000";

export default function AdminDashboard({ onLogout }) {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  function loadData() {
    fetch(`${API}/api/contacts`)
      .then(res => res.json())
      .then(setData);
  }

  useEffect(() => { loadData(); }, []);

  // Delete
  function deleteItem(id) {
    fetch(`${API}/api/contact/${id}`, { method: "DELETE" })
      .then(loadData);
  }

  // Mark Read / Unread
  function toggleRead(id, status) {
    fetch(`${API}/api/contact/${id}`, {
      method: "PATCH",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ isRead: !status })
    }).then(loadData);
  }

  const filtered = data.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6">

      {/* Header */}
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-400">Admin Dashboard</h1>
        <button onClick={onLogout}
          className="bg-red-500 px-4 py-1 rounded">
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/5 p-4 rounded">
          Total Submissions
          <h2 className="text-2xl text-blue-400">{data.length}</h2>
        </div>
        <div className="bg-white/5 p-4 rounded">
          Unread
          <h2 className="text-2xl text-yellow-400">
            {data.filter(d=>!d.isRead).length}
          </h2>
        </div>
        <div className="bg-white/5 p-4 rounded">
          Read
          <h2 className="text-2xl text-green-400">
            {data.filter(d=>d.isRead).length}
          </h2>
        </div>
      </div>

      {/* Search */}
      <input
        className="mb-4 p-2 rounded bg-[#0f172a] w-full md:w-1/3"
        placeholder="Search name or email..."
        onChange={(e)=>setSearch(e.target.value)}
      />

      {/* Table */}
      <div className="overflow-x-auto border border-white/10 rounded">
        <table className="w-full text-sm">
          <thead className="bg-[#0f172a]">
            <tr>
              <th className="p-3">Name</th>
              <th>Email</th>
              <th>Service</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map(item => (
              <tr key={item._id} className="border-t border-white/10">
                <td className="p-3">{item.name}</td>
                <td className="text-blue-300">{item.email}</td>
                <td>{item.service}</td>
                <td>
                  {item.isRead ?
                    <span className="text-green-400">Read</span> :
                    <span className="text-yellow-400">Unread</span>}
                </td>
                <td className="space-x-2">
                  <button
                    onClick={()=>toggleRead(item._id, item.isRead)}
                    className="bg-blue-500 px-2 rounded text-xs">
                    Toggle
                  </button>
                  <button
                    onClick={()=>deleteItem(item._id)}
                    className="bg-red-500 px-2 rounded text-xs">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

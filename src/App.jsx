import { useState, useEffect, useMemo } from 'react';
import UserCard from './components/UserCard';
import Loader from './components/Loader';

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtering & Sorting State
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("none"); // "asc", "desc", "none"

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', company: '', phone: '' });
  const [formError, setFormError] = useState("");

  // 1. Fetch Users on Mount
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/users');
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // 2. Manual Debounce Implementation
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 3. Logic: Filter and Sort (Client-Side)
  const processedUsers = useMemo(() => {
    let result = users.filter(u =>
      u.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    if (sortOrder === "asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "desc") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }
    return result;
  }, [users, debouncedSearch, sortOrder]);

  // 4. Action Handlers
  const handleReset = () => {
    setSearchTerm("");
    setSortOrder("none");
    fetchUsers(); // Restores all users from DB
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      setFormError("Name and Email are required!");
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      const data = await res.json();
      setUsers([data, ...users]); // Prepend
      setIsModalOpen(false);
      setNewUser({ name: '', email: '', company: '', phone: '' });
      setFormError("");
    } catch (err) {
      setFormError("Server error adding user.");
    }
  };

  return (<>
    {loading ? <Loader /> : <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
          <h1 className="text-3xl font-bold">User Directory</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-sky-500 hover:bg-sky-600 px-6 py-2 rounded-lg font-semibold transition"
          >
            + Add User
          </button>
        </header>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8 bg-slate-800 p-4 rounded-xl border border-slate-700">
          <input
            type="text"
            placeholder="Search by name..."
            className="bg-slate-700 border-none rounded-lg px-4 py-2 flex-grow focus:ring-2 focus:ring-sky-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="bg-slate-700 rounded-lg px-4 py-2 outline-none"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="none">Default Sort</option>
            <option value="asc">Name A → Z</option>
            <option value="desc">Name Z → A</option>
          </select>
          <button onClick={handleReset} className="text-slate-400 hover:text-white underline">Reset All</button>
        </div>

        {/* States: Error, Loading, Empty, or List */}
        {error && <div className="text-red-400 p-4 border border-red-400/20 bg-red-400/10 rounded-lg">Error: {error}</div>}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-40 bg-slate-800 animate-pulse rounded-xl" />)}
          </div>
        ) : processedUsers.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-xl">No users found matching "{debouncedSearch}"</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedUsers.map(user => <UserCard key={user._id || user.email} user={user} />)}
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleAddUser} className="bg-slate-800 p-8 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">New User</h2>
            {formError && <p className="text-red-400 mb-4 text-sm">{formError}</p>}
            <div className="space-y-4">
              <input type="text" placeholder="Name *" className="w-full bg-slate-700 p-3 rounded-lg outline-none" onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
              <input type="email" placeholder="Email *" className="w-full bg-slate-700 p-3 rounded-lg outline-none" onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
              <input type="text" placeholder="Company" className="w-full bg-slate-700 p-3 rounded-lg outline-none" onChange={e => setNewUser({ ...newUser, company: e.target.value })} />
              <input type="text" placeholder="Phone" className="w-full bg-slate-700 p-3 rounded-lg outline-none" onChange={e => setNewUser({ ...newUser, phone: e.target.value })} />
            </div>
            <div className="flex gap-3 mt-8">
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 text-slate-400 hover:text-white transition">Cancel</button>
              <button type="submit" className="flex-1 bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded-lg font-bold transition">Save User</button>
            </div>
          </form>
        </div>
      )}
    </div>
    }
  </>

  );
}
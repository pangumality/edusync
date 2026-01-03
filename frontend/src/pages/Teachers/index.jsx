import React, { useEffect, useMemo, useState } from 'react';
import api from '../../utils/api';

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function Teachers() {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '' });
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/teachers');
      setList(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const filtered = useMemo(() => {
    return list.filter(t =>
      `${t.name} ${t.email} ${t.subject}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [list, search]);

  const startAdd = () => {
    setEditingId('new');
    setForm({ name: '', email: '', subject: '' });
    setError('');
  };

  const startEdit = (t) => {
    setEditingId(t.id);
    setForm({ name: t.name, email: t.email, subject: t.subject });
    setError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', email: '', subject: '' });
    setError('');
  };

  const save = async () => {
    if (!form.name.trim() || !form.email.trim()) return;
    
    setLoading(true);
    try {
      if (editingId === 'new') {
        const response = await api.post('/teachers', form);
        setList([response.data, ...list]);
      } else {
        // Edit not fully implemented in backend yet, but UI supports it
        // We can just update local list for now or implement PUT
        // For now, let's just focus on create as requested
        // setList(list.map(t => (t.id === editingId ? { ...t, ...form } : t)));
        alert("Edit not implemented on backend yet");
      }
      cancelEdit();
    } catch (err) {
      console.error('Error saving teacher:', err);
      setError(err.response?.data?.error || 'Failed to save teacher');
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) return;
    
    try {
      await api.delete(`/teachers/${id}`);
      setList(list.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting teacher:', err);
      alert('Failed to delete teacher');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-700 uppercase">Teachers</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-soft p-6">
        <div className="flex items-center gap-3">
          <button
            className="px-3 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50"
            onClick={startAdd}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Add Teacher'}
          </button>
          <button
            className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            onClick={fetchTeachers}
          >
            Refresh
          </button>
          <input
            type="text"
            className="ml-auto w-64 border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:border-gray-400"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {editingId && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:border-gray-400"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="email"
              className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:border-gray-400"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="text"
              className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:border-gray-400"
              placeholder="Subject (Optional)"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
            <div className="flex items-center gap-3">
              <button
                className="px-3 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50"
                onClick={save}
                disabled={loading}
              >
                Save
              </button>
              <button
                className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={cancelEdit}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-sm text-gray-600 px-4 py-2 border-b">Name</th>
                <th className="text-left text-sm text-gray-600 px-4 py-2 border-b">Email</th>
                <th className="text-left text-sm text-gray-600 px-4 py-2 border-b">Subject</th>
                <th className="text-left text-sm text-gray-600 px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                 <tr>
                   <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                     No teachers found. Add one to get started.
                   </td>
                 </tr>
              ) : (
                filtered.map(t => (
                  <tr key={t.id} className="odd:bg-white even:bg-gray-50">
                    <td className="px-4 py-2 border-b text-gray-800">{t.name}</td>
                    <td className="px-4 py-2 border-b text-gray-700">{t.email}</td>
                    <td className="px-4 py-2 border-b text-gray-700">{t.subject}</td>
                    <td className="px-4 py-2 border-b">
                      <div className="flex items-center gap-3">
                        {/* 
                        <button
                          className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                          onClick={() => startEdit(t)}
                        >
                          Edit
                        </button>
                        */}
                        <button
                          className="px-3 py-1 rounded-md bg-gray-600 text-white hover:bg-gray-700"
                          onClick={() => remove(t.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

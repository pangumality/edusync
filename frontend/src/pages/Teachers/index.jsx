import React, { useEffect, useMemo, useState } from 'react';
import { seedTeachers } from '../../utils/seed';

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function Teachers() {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '' });
  const [list, setList] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('teachers:doonites');
    if (saved) {
      setList(JSON.parse(saved));
    } else {
      const initial = [
        { id: uid(), name: 'Alice Johnson', email: 'alice@doonites.com', subject: 'Mathematics' },
        { id: uid(), name: 'Bernard Mensah', email: 'bernard@doonites.com', subject: 'English' },
        { id: uid(), name: 'Chandra Patel', email: 'chandra@doonites.com', subject: 'Science' },
      ];
      setList(initial);
      localStorage.setItem('teachers:doonites', JSON.stringify(initial));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('teachers:doonites', JSON.stringify(list));
  }, [list]);

  const filtered = useMemo(() => {
    return list.filter(t =>
      `${t.name} ${t.email} ${t.subject}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [list, search]);

  const startAdd = () => {
    setEditingId('new');
    setForm({ name: '', email: '', subject: '' });
  };

  const startEdit = (t) => {
    setEditingId(t.id);
    setForm({ name: t.name, email: t.email, subject: t.subject });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', email: '', subject: '' });
  };

  const save = () => {
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim()) return;
    if (editingId === 'new') {
      setList([{ id: uid(), ...form }, ...list]);
    } else {
      setList(list.map(t => (t.id === editingId ? { ...t, ...form } : t)));
    }
    cancelEdit();
  };

  const remove = (id) => {
    setList(list.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-700 uppercase">Teachers</h2>

      <div className="bg-white rounded-xl shadow-soft p-6">
        <div className="flex items-center gap-3">
          <button
            className="px-3 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700"
            onClick={startAdd}
          >
            Add Teacher
          </button>
          <button
            className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            onClick={() => setList(seedTeachers())}
          >
            Seed Demo Data
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
              placeholder="Subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
            <div className="flex items-center gap-3">
              <button
                className="px-3 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700"
                onClick={save}
              >
                Save
              </button>
              <button
                className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={cancelEdit}
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
              {filtered.map(t => (
                <tr key={t.id} className="odd:bg-white even:bg-gray-50">
                  <td className="px-4 py-2 border-b text-gray-800">{t.name}</td>
                  <td className="px-4 py-2 border-b text-gray-700">{t.email}</td>
                  <td className="px-4 py-2 border-b text-gray-700">{t.subject}</td>
                  <td className="px-4 py-2 border-b">
                    <div className="flex items-center gap-3">
                      <button
                        className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                        onClick={() => startEdit(t)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 rounded-md bg-gray-600 text-white hover:bg-gray-700"
                        onClick={() => remove(t.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

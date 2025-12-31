import React, { useEffect, useMemo, useState } from 'react';
import { seedStudents } from '../../utils/seed';

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function Students() {
  const classesFromStore = JSON.parse(localStorage.getItem('classes:doonites') || '[]');
  const defaultClasses = classesFromStore.length
    ? classesFromStore
    : [
        { id: 'class-1', name: 'Grade 1', sections: ['A', 'B'] },
        { id: 'class-2', name: 'Grade 2', sections: ['A'] },
        { id: 'class-3', name: 'Grade 3', sections: ['A', 'B', 'C'] },
      ];
  const [classesList, setClassesList] = useState(defaultClasses);
  const [klass, setKlass] = useState(defaultClasses[0].id);
  const [section, setSection] = useState(defaultClasses[0].sections[0]);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', klass: defaultClasses[0].id, section: defaultClasses[0].sections[0] });
  const [list, setList] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('students:doonites');
    if (saved) {
      setList(JSON.parse(saved));
    } else {
      const seeded = seedStudents(classesList);
      setList(seeded);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('students:doonites', JSON.stringify(list));
  }, [list]);

  const filtered = useMemo(() => {
    return list
      .filter(s => s.klass === klass && s.section === section)
      .filter(s => `${s.name} ${s.email}`.toLowerCase().includes(search.toLowerCase()));
  }, [list, klass, section, search]);

  const startAdd = () => {
    setEditingId('new');
    setForm({ name: '', email: '', klass, section });
  };

  const startEdit = (s) => {
    setEditingId(s.id);
    setForm({ name: s.name, email: s.email || '', klass: s.klass, section: s.section });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', email: '', klass, section });
  };

  const save = () => {
    if (!form.name.trim()) return;
    if (editingId === 'new') {
      setList([{ id: uid(), ...form }, ...list]);
    } else {
      setList(list.map(s => (s.id === editingId ? { ...s, ...form } : s)));
    }
    cancelEdit();
  };

  const remove = (id) => {
    setList(list.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-700 uppercase">Students</h2>

      <div className="bg-white rounded-xl shadow-soft p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Class</label>
            <select
              className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:border-gray-400"
              value={klass}
              onChange={(e) => {
    const id = e.target.value;
    setKlass(id);
    setSection(classesList.find(c => c.id === id)?.sections[0] || '');
              }}
            >
              {classesList.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Section</label>
            <select
              className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:border-gray-400"
              value={section}
              onChange={(e) => setSection(e.target.value)}
            >
              {classesList.find(c => c.id === klass)?.sections.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Search</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:border-gray-400"
              placeholder="Search student"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <button
              className="px-3 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 w-full"
              onClick={startAdd}
            >
              Add Student
            </button>
            <button
              className="ml-3 px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
              onClick={() => setList(seedStudents(classesList))}
            >
              Seed Demo Data
            </button>
          </div>
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
            <select
              className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:border-gray-400"
              value={form.klass}
              onChange={(e) => {
                const id = e.target.value;
                setForm({ ...form, klass: id, section: baseClasses.find(c => c.id === id)?.sections[0] || '' });
              }}
            >
              {classesList.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select
              className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:border-gray-400"
              value={form.section}
              onChange={(e) => setForm({ ...form, section: e.target.value })}
            >
              {classesList.find(c => c.id === form.klass)?.sections.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
            <div className="md:col-span-4 flex items-center gap-3">
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
                <th className="text-left text-sm text-gray-600 px-4 py-2 border-b">Class</th>
                <th className="text-left text-sm text-gray-600 px-4 py-2 border-b">Section</th>
                <th className="text-left text-sm text-gray-600 px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="odd:bg-white even:bg-gray-50">
                  <td className="px-4 py-2 border-b text-gray-800">{s.name}</td>
                  <td className="px-4 py-2 border-b text-gray-700">{s.email || '-'}</td>
                  <td className="px-4 py-2 border-b text-gray-700">{classesList.find(c => c.id === s.klass)?.name || '-'}</td>
                  <td className="px-4 py-2 border-b text-gray-700">{s.section}</td>
                  <td className="px-4 py-2 border-b">
                    <div className="flex items-center gap-3">
                      <button
                        className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                        onClick={() => startEdit(s)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 rounded-md bg-gray-600 text-white hover:bg-gray-700"
                        onClick={() => remove(s.id)}
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

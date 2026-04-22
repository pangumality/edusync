import React, { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../../utils/api';
import { Users as UsersIcon, Search, RefreshCw } from 'lucide-react';

export default function Users() {
  const { currentUser } = useOutletContext() || {};
  const currentRole = currentUser?.role;
  const [list, setList] = useState([]);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [schoolFilter, setSchoolFilter] = useState('all');
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users');
      setList(data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err?.response?.data?.error || 'Failed to load users');
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchools = async () => {
    try {
      const { data } = await api.get('/schools');
      setSchools(data || []);
    } catch {
      setSchools([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (currentRole === 'admin') {
      fetchSchools();
    }
  }, [currentRole]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list.filter((u) => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;
      if (statusFilter !== 'all') {
        const wantActive = statusFilter === 'active';
        if (Boolean(u.isActive) !== wantActive) return false;
      }
      if (currentRole === 'admin' && schoolFilter !== 'all' && String(u.schoolId || '') !== schoolFilter) {
        return false;
      }
      if (!q) return true;
      return `${u.firstName} ${u.lastName} ${u.email || ''} ${u.role || ''} ${u.phone || ''} ${u.schoolId || ''}`
        .toLowerCase()
        .includes(q);
    });
  }, [list, query, roleFilter, statusFilter, schoolFilter, currentRole]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-700 uppercase flex items-center gap-2">
          <UsersIcon className="text-brand-700" size={20} />
          Users
        </h2>
        <button
          className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50"
          onClick={fetchUsers}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-soft p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              className="w-full border border-gray-200 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:border-gray-400"
              placeholder="Search users"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:border-gray-400"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Super Admin</option>
            <option value="staff">School Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
            <option value="parent">Parent</option>
          </select>
          <select
            className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:border-gray-400"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>

        {currentRole === 'admin' && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3">
            <select
              className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:border-gray-400 md:col-span-2"
              value={schoolFilter}
              onChange={(e) => setSchoolFilter(e.target.value)}
            >
              <option value="all">All Schools</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-sm text-gray-600 px-4 py-2 border-b">Name</th>
                <th className="text-left text-sm text-gray-600 px-4 py-2 border-b">Email</th>
                <th className="text-left text-sm text-gray-600 px-4 py-2 border-b">Role</th>
                <th className="text-left text-sm text-gray-600 px-4 py-2 border-b">Phone</th>
                <th className="text-left text-sm text-gray-600 px-4 py-2 border-b">Status</th>
                <th className="text-left text-sm text-gray-600 px-4 py-2 border-b">School</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={6}>
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={6}>
                    No users found
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="odd:bg-white even:bg-gray-50">
                    <td className="px-4 py-2 border-b text-gray-800 font-medium">
                      {`${u.firstName} ${u.lastName}`.trim()}
                    </td>
                    <td className="px-4 py-2 border-b text-gray-700">{u.email || '-'}</td>
                    <td className="px-4 py-2 border-b text-gray-700">
                      <span className="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-700">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b text-gray-700">{u.phone || '-'}</td>
                    <td className="px-4 py-2 border-b">
                      <span
                        className={
                          u.isActive
                            ? 'px-2 py-1 text-xs rounded-md bg-green-100 text-green-700'
                            : 'px-2 py-1 text-xs rounded-md bg-red-100 text-red-700'
                        }
                      >
                        {u.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b text-gray-700 font-mono text-xs">{u.schoolId || '-'}</td>
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

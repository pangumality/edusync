import React, { useEffect, useMemo, useState } from 'react';

const classes = [
  { id: 'class-1', name: 'Grade 1', sections: ['A', 'B'] },
  { id: 'class-2', name: 'Grade 2', sections: ['A'] },
  { id: 'class-3', name: 'Grade 3', sections: ['A', 'B', 'C'] },
];

const roster = {
  'class-1-A': [
    { id: 's-1', name: 'Amina Kora' },
    { id: 's-2', name: 'First Test' },
    { id: 's-3', name: 'Second Test' },
    { id: 's-4', name: 'Third Test' },
  ],
  'class-1-B': [
    { id: 's-5', name: 'Kofi Boateng' },
    { id: 's-6', name: 'Lilian Owusu' },
  ],
  'class-2-A': [
    { id: 's-7', name: 'Rahul Patel' },
    { id: 's-8', name: 'Yara Hassan' },
  ],
  'class-3-A': [
    { id: 's-9', name: 'Chen Li' },
    { id: 's-10', name: 'Maryam Ali' },
  ],
  'class-3-B': [
    { id: 's-11', name: 'Peter Kim' },
    { id: 's-12', name: 'Olivia Adebayo' },
  ],
  'class-3-C': [
    { id: 's-13', name: 'Kwame Darko' },
  ],
};

function storageKey(date, klass, section) {
  return `attendance:doonites:${date}:${klass}-${section}`;
}

export default function Attendance() {
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [date, setDate] = useState(todayStr);
  const [klass, setKlass] = useState(classes[0].id);
  const [section, setSection] = useState(classes[0].sections[0]);
  const [search, setSearch] = useState('');
  const [records, setRecords] = useState({});

  const currentKey = storageKey(date, klass, section);
  const currentStudents = (roster[`${klass}-${section}`] ?? []).filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const saved = localStorage.getItem(currentKey);
    setRecords(saved ? JSON.parse(saved) : {});
  }, [currentKey]);

  useEffect(() => {
    localStorage.setItem(currentKey, JSON.stringify(records));
  }, [records, currentKey]);

  const presentCount = Object.values(records).filter(v => v === 'P').length;
  const absentCount = Object.values(records).filter(v => v === 'A').length;
  const unmarkedCount = currentStudents.length - presentCount - absentCount;

  const markAll = (status) => {
    const newState = {};
    for (const s of currentStudents) newState[s.id] = status;
    setRecords(newState);
  };

  const exportCSV = () => {
    const rows = [
      ['Date', 'Class', 'Section', 'Student', 'Status'],
      ...currentStudents.map(s => [
        date,
        classes.find(c => c.id === klass)?.name || '',
        section,
        s.name,
        records[s.id] || '',
      ]),
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${date}_${klass}_${section}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-700 uppercase">Attendance</h2>

      <div className="bg-white rounded-xl shadow-soft p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Date</label>
            <input
              type="date"
              className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:border-gray-400"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Class</label>
            <select
              className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:border-gray-400"
              value={klass}
              onChange={(e) => {
                const id = e.target.value;
                setKlass(id);
                setSection(classes.find(c => c.id === id)?.sections[0] || '');
              }}
            >
              {classes.map(c => (
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
              {classes.find(c => c.id === klass)?.sections.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Search</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:border-gray-400"
              placeholder="Search student"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            className="px-3 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700"
            onClick={() => markAll('P')}
          >
            Mark all Present
          </button>
          <button
            className="px-3 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600"
            onClick={() => markAll('A')}
          >
            Mark all Absent
          </button>
          <button
            className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            onClick={() => setRecords({})}
          >
            Clear
          </button>
          <button
            className="ml-auto px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            onClick={exportCSV}
          >
            Export CSV
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600">Present</div>
            <div className="text-2xl font-bold text-gray-800">{presentCount}</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600">Absent</div>
            <div className="text-2xl font-bold text-gray-800">{absentCount}</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600">Unmarked</div>
            <div className="text-2xl font-bold text-gray-800">{unmarkedCount}</div>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-sm text-gray-600 px-4 py-2 border-b">#</th>
                <th className="text-left text-sm text-gray-600 px-4 py-2 border-b">Student</th>
                <th className="text-left text-sm text-gray-600 px-4 py-2 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((s, idx) => {
                const status = records[s.id] || '';
                return (
                  <tr key={s.id} className="odd:bg-white even:bg-gray-50">
                    <td className="px-4 py-2 border-b text-gray-600">{idx + 1}</td>
                    <td className="px-4 py-2 border-b text-gray-800">{s.name}</td>
                    <td className="px-4 py-2 border-b">
                      <div className="flex items-center gap-3">
                        <button
                          className={`px-3 py-1 rounded-md border ${status === 'P' ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                          onClick={() => setRecords({ ...records, [s.id]: 'P' })}
                        >
                          Present
                        </button>
                        <button
                          className={`px-3 py-1 rounded-md border ${status === 'A' ? 'bg-gray-600 text-white border-gray-600' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                          onClick={() => setRecords({ ...records, [s.id]: 'A' })}
                        >
                          Absent
                        </button>
                        <button
                          className="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                          onClick={() => {
                            const clone = { ...records };
                            delete clone[s.id];
                            setRecords(clone);
                          }}
                        >
                          Clear
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

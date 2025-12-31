import React, { useEffect, useMemo, useState } from 'react';
import Modal from '../../components/Modal';
import { seedClasses, seedStudents } from '../../utils/seed';
import { CreditCard, Search, Plus, ListChecks, Printer, Trash2, ChevronDown } from 'lucide-react';

const FEE_AMOUNT = 1200;

export default function Finance() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState({});
  const [query, setQuery] = useState('');
  const [klassFilter, setKlassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeStudent, setActiveStudent] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Cash');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [reference, setReference] = useState('');
  const [year, setYear] = useState(() => new Date().getFullYear().toString());
  const [term, setTerm] = useState(() => {
    const m = new Date().getMonth();
    return (m <= 3 ? 1 : m <= 7 ? 2 : 3).toString();
  });

  useEffect(() => {
    const cls = JSON.parse(localStorage.getItem('classes:doonites') || '[]');
    if (!cls.length) {
      const seeded = seedClasses();
      setClasses(seeded);
    } else {
      setClasses(cls);
    }
    const std = JSON.parse(localStorage.getItem('students:doonites') || '[]');
    if (!std.length) {
      const seeded = seedStudents(cls.length ? cls : undefined);
      setStudents(seeded);
    } else {
      setStudents(std);
    }
    const pay = JSON.parse(localStorage.getItem('payments:doonites') || '{}');
    setPayments(pay);
  }, []);

  useEffect(() => {
    localStorage.setItem('payments:doonites', JSON.stringify(payments));
  }, [payments]);

  const classesById = useMemo(() => {
    const map = {};
    for (const c of classes) map[c.id] = c;
    return map;
  }, [classes]);

  function totalPaidFor(studentId) {
    const list = payments[studentId] || [];
    return list.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  }
  function lastPaymentDateFor(studentId) {
    const list = payments[studentId] || [];
    if (!list.length) return null;
    return list[list.length - 1].date;
  }
  function statusFor(studentId) {
    const paid = totalPaidFor(studentId);
    if (paid === 0) return 'Not Paid';
    if (paid >= FEE_AMOUNT) return 'Paid';
    return 'Partial';
  }

  const filtered = useMemo(() => {
    return students
      .filter(s => {
        if (klassFilter !== 'all' && s.klass !== klassFilter) return false;
        if (query && !s.name.toLowerCase().includes(query.toLowerCase())) return false;
        const st = statusFor(s.id);
        if (statusFilter !== 'all' && st !== statusFilter) return false;
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [students, query, klassFilter, statusFilter, payments]);

  const totals = useMemo(() => {
    const due = students.length * FEE_AMOUNT;
    let paid = 0;
    const label = selectedTermLabel();
    for (const s of students) paid += totalPaidForTerm(s.id, label);
    const balance = Math.max(due - paid, 0);
    return { due, paid, balance };
  }, [students, payments, year, term]);

  function klassLabel(id) {
    const c = classesById[id];
    return c ? c.name : '';
  }
  function initials(name) {
    const parts = (name || '').split(' ');
    return ((parts[0] || '').charAt(0) + (parts[1] || '').charAt(0)).toUpperCase();
  }
  function termLabelFromDate(d) {
    if (!d) return '';
    const date = new Date(d);
    const y = date.getFullYear();
    const m = date.getMonth();
    const t = m <= 3 ? 1 : m <= 7 ? 2 : 3;
    return `${y} Term ${t}`;
  }
  function currentTermLabel() {
    return termLabelFromDate(new Date().toISOString().slice(0, 10));
  }
  function selectedTermLabel() {
    return `${year} Term ${term}`;
  }
  function totalPaidForTerm(studentId, label) {
    const list = payments[studentId] || [];
    return list
      .filter(p => termLabelFromDate(p.date) === label)
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);
  }

  function openAddPayment(student) {
    setActiveStudent(student);
    setAmount('');
    setMethod('Cash');
    setDate(new Date().toISOString().slice(0, 10));
    setReference('');
    setAddOpen(true);
  }
  function openView(student) {
    setActiveStudent(student);
    setViewOpen(true);
  }
  function savePayment() {
    if (!activeStudent) return;
    const amt = Number(amount || 0);
    if (!amt || amt <= 0) return;
    const entry = { amount: amt, method, date, reference };
    const list = payments[activeStudent.id] ? [...payments[activeStudent.id]] : [];
    list.push(entry);
    const next = { ...payments, [activeStudent.id]: list };
    setPayments(next);
    setAddOpen(false);
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-700 uppercase">Finance</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex items-center gap-3">
            <CreditCard className="text-gray-500" size={20} />
            <span className="text-sm text-gray-500">Total Due</span>
          </div>
          <div className="mt-2 text-2xl font-semibold text-gray-800">ZMW {totals.due.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex items-center gap-3">
            <CreditCard className="text-green-600" size={20} />
            <span className="text-sm text-gray-500">Total Paid</span>
          </div>
          <div className="mt-2 text-2xl font-semibold text-gray-800">ZMW {totals.paid.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex items-center gap-3">
            <CreditCard className="text-red-600" size={20} />
            <span className="text-sm text-gray-500">Outstanding</span>
          </div>
          <div className="mt-2 text-2xl font-semibold text-gray-800">ZMW {totals.balance.toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-soft p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search pupil by name"
                className="pl-9 pr-3 py-2 border rounded-md bg-white text-gray-700 placeholder-gray-400 w-64"
              />
            </div>
            <div className="relative w-28">
              <select
                value={year}
                onChange={e => setYear(e.target.value)}
                className="w-full px-3 py-2 pr-9 rounded-xl bg-gray-50 text-gray-800 border border-gray-200 shadow-soft hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-300 transition-colors text-sm appearance-none"
              >
                {Array.from({ length: 5 }).map((_, i) => {
                  const y = (new Date().getFullYear() - i).toString();
                  return <option key={y} value={y}>{y}</option>;
                })}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative w-28">
              <select
                value={term}
                onChange={e => setTerm(e.target.value)}
                className="w-full px-3 py-2 pr-9 rounded-xl bg-gray-50 text-gray-800 border border-gray-200 shadow-soft hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-300 transition-colors text-sm appearance-none"
              >
                <option value="1">Term 1</option>
                <option value="2">Term 2</option>
                <option value="3">Term 3</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative w-40">
              <select
                value={klassFilter}
                onChange={e => setKlassFilter(e.target.value)}
                className="w-full px-3 py-2 pr-9 rounded-xl bg-gray-50 text-gray-800 border border-gray-200 shadow-soft hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-300 transition-colors text-sm appearance-none"
              >
                <option value="all">All Classes</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative w-36">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 pr-9 rounded-xl bg-gray-50 text-gray-800 border border-gray-200 shadow-soft hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-300 transition-colors text-sm appearance-none"
              >
                <option value="all">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Not Paid">Not Paid</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 flex items-center gap-2"
              onClick={() => {
                const first = filtered[0] || students[0];
                if (first) openAddPayment(first);
              }}
            >
              <Plus size={18} /> Add Payment
            </button>
            <button
              className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              onClick={() => {
                const first = filtered[0] || students[0];
                if (first) openView(first);
              }}
            >
              <ListChecks size={18} /> View History
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 border-b text-gray-600">Pupil</th>
                <th className="text-left px-4 py-2 border-b text-gray-600">Class</th>
                <th className="text-right px-4 py-2 border-b text-gray-600">Due</th>
                <th className="text-right px-4 py-2 border-b text-gray-600">Paid</th>
                <th className="text-right px-4 py-2 border-b text-gray-600">Balance</th>
                <th className="text-left px-4 py-2 border-b text-gray-600">Last Payment</th>
                <th className="text-left px-4 py-2 border-b text-gray-600">Status</th>
                <th className="text-left px-4 py-2 border-b text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const label = selectedTermLabel();
                const paid = totalPaidForTerm(s.id, label);
                const balance = Math.max(FEE_AMOUNT - paid, 0);
                const last = lastPaymentDateFor(s.id);
                const st = statusFor(s.id);
                return (
                  <tr key={s.id} className="odd:bg-white even:bg-gray-50">
                    <td className="px-4 py-2 border-b">
                      <div className="font-medium text-gray-800">{s.name}</div>
                      <div className="text-xs text-gray-500">{s.section}</div>
                    </td>
                    <td className="px-4 py-2 border-b text-gray-700">{klassLabel(s.klass)}</td>
                    <td className="px-4 py-2 border-b text-right text-gray-700">ZMW {FEE_AMOUNT.toLocaleString()}</td>
                    <td className="px-4 py-2 border-b text-right text-gray-700">ZMW {paid.toLocaleString()}</td>
                    <td className="px-4 py-2 border-b text-right text-gray-700">ZMW {balance.toLocaleString()}</td>
                    <td className="px-4 py-2 border-b text-gray-700">{last || '-'}</td>
                    <td className="px-4 py-2 border-b">
                      <span
                        className={
                          st === 'Paid'
                            ? 'px-2 py-1 text-xs rounded-md bg-green-100 text-green-700'
                            : st === 'Partial'
                            ? 'px-2 py-1 text-xs rounded-md bg-yellow-100 text-yellow-700'
                            : 'px-2 py-1 text-xs rounded-md bg-red-100 text-red-700'
                        }
                      >
                        {st}
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b">
                      <div className="flex items-center gap-2">
                        <button
                          className="px-3 py-1.5 rounded-md bg-gray-800 text-white hover:bg-gray-700 text-sm"
                          onClick={() => openAddPayment(s)}
                        >
                          Add Payment
                        </button>
                        <button
                          className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm"
                          onClick={() => openView(s)}
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-gray-500" colSpan={8}>
                    No pupils found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title={activeStudent ? `Add Payment · ${activeStudent.name}` : 'Add Payment'}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Amount (ZMW)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Method</label>
              <select
                value={method}
                onChange={e => setMethod(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white text-gray-700"
              >
                <option>Cash</option>
                <option>Mobile Money</option>
                <option>Bank Transfer</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Reference</label>
              <input
                type="text"
                value={reference}
                onChange={e => setReference(e.target.value)}
                placeholder="Ref or receipt number"
                className="w-full px-3 py-2 border rounded-md bg-white text-gray-700"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100" onClick={() => setAddOpen(false)}>Cancel</button>
            <button className="px-3 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700" onClick={savePayment}>Save</button>
          </div>
        </div>
      </Modal>

      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title={activeStudent ? `Finance · ${activeStudent.name}` : 'Finance'}>
        {activeStudent ? (
          <div className="space-y-6">
            <div className="bg-gray-50 border rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 text-white flex items-center justify-center text-lg font-semibold">
                  {initials(activeStudent.name)}
                </div>
                <div className="flex-1">
                  <div className="text-xl font-semibold text-gray-800">{activeStudent.name}</div>
                  <div className="text-sm text-gray-600">{klassLabel(activeStudent.klass)} · {activeStudent.section}</div>
                </div>
                <div className="px-3 py-1 rounded-md bg-gray-800 text-white text-sm">{selectedTermLabel()}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-soft p-5 border">
                <div className="text-sm text-gray-500">Amount Due (Current Term)</div>
                <div className="mt-2 text-2xl font-semibold text-gray-800">ZMW {FEE_AMOUNT.toLocaleString()}</div>
              </div>
              <div className="bg-white rounded-xl shadow-soft p-5 border">
                <div className="text-sm text-gray-500">Paid (Current Term)</div>
                <div className="mt-2 text-2xl font-semibold text-gray-800">ZMW {totalPaidForTerm(activeStudent.id, selectedTermLabel()).toLocaleString()}</div>
              </div>
              <div className="bg-white rounded-xl shadow-soft p-5 border">
                <div className="text-sm text-gray-500">Balance (Current Term)</div>
                <div className="mt-2 text-2xl font-semibold text-gray-800">ZMW {Math.max(FEE_AMOUNT - totalPaidForTerm(activeStudent.id, selectedTermLabel()), 0).toLocaleString()}</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-soft p-6 border">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold text-gray-800">Payment History</div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => window.print()}
                  >
                    <Printer size={18} /> Print
                  </button>
                </div>
              </div>
              <div className="mt-4 overflow-x-auto">
                {(payments[activeStudent.id] || []).length > 0 ? (
                  <table className="min-w-full border rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-4 py-2 border-b text-gray-600">Date</th>
                        <th className="text-left px-4 py-2 border-b text-gray-600">Term</th>
                        <th className="text-left px-4 py-2 border-b text-gray-600">Method</th>
                        <th className="text-left px-4 py-2 border-b text-gray-600">Reference</th>
                        <th className="text-right px-4 py-2 border-b text-gray-600">Amount</th>
                        <th className="text-left px-4 py-2 border-b text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(payments[activeStudent.id] || [])
                        .slice()
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((p, i) => (
                          <tr key={i} className="odd:bg-white even:bg-gray-50">
                            <td className="px-4 py-2 border-b text-gray-700">{p.date}</td>
                            <td className="px-4 py-2 border-b text-gray-700">{termLabelFromDate(p.date)}</td>
                            <td className="px-4 py-2 border-b text-gray-700">{p.method}</td>
                            <td className="px-4 py-2 border-b text-gray-700">{p.reference || '-'}</td>
                            <td className="px-4 py-2 border-b text-right text-gray-700">ZMW {Number(p.amount).toLocaleString()}</td>
                            <td className="px-4 py-2 border-b">
                              <button
                                className="px-2 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs flex items-center gap-1"
                                onClick={() => {
                                  const list = (payments[activeStudent.id] || []).slice();
                                  list.splice(i, 1);
                                  const next = { ...payments, [activeStudent.id]: list };
                                  setPayments(next);
                                }}
                              >
                                <Trash2 size={14} /> Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-gray-600">No payments recorded</div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-end">
                <div className="text-sm">
                  <span className="text-gray-600">Total Paid:</span>{' '}
                  <span className="font-semibold text-gray-800">ZMW {totalPaidFor(activeStudent.id).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-600">No pupil selected</div>
        )}
      </Modal>
    </div>
  );
}

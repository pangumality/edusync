import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Calendar, Plus, Trash2, User } from 'lucide-react';
import api from '../../utils/api';

const TimeTable = () => {
  const outletContext = useOutletContext() || {};
  const fallbackCurrentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  const currentUser = outletContext.currentUser || fallbackCurrentUser;
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  
  // Admin filters/form
  const [selectedClassId, setSelectedClassId] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [formError, setFormError] = useState('');
  const toastTimerRef = useRef(null);
  const [formData, setFormData] = useState({
    classId: '',
    subjectId: '',
    teacherId: '',
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '09:45'
  });

  const canManage = ['admin', 'staff'].includes(currentUser?.role);
  const isTeacher = currentUser?.role === 'teacher';

  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const WORK_DAYS = [1, 2, 3, 4, 5]; // Mon-Fri

  const showSuccessToast = (message) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(message);
    toastTimerRef.current = setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    fetchTimetable();
    if (canManage) {
      fetchMetadata();
    }
  }, [selectedClassId]);

  const fetchMetadata = async () => {
    const [classRes, subjectRes, teacherRes] = await Promise.allSettled([
      api.get('/classes'),
      api.get('/subjects'),
      api.get('/teachers')
    ]);

    if (classRes.status === 'fulfilled') {
      setClasses(classRes.value.data || []);
    } else {
      console.error('Failed to fetch classes metadata:', classRes.reason);
    }

    if (subjectRes.status === 'fulfilled') {
      setSubjects(subjectRes.value.data || []);
    } else {
      console.error('Failed to fetch subjects metadata:', subjectRes.reason);
    }

    if (teacherRes.status === 'fulfilled') {
      const normalizedTeachers = (teacherRes.value.data || []).map((t) => ({
        ...t,
        teacherId: t.teacherId || t.id,
        name: t.name || `${t.user?.firstName || ''} ${t.user?.lastName || ''}`.trim()
      }));
      setTeachers(normalizedTeachers);
    } else {
      console.error('Failed to fetch teachers metadata:', teacherRes.reason);
      setTeachers([]);
    }
  };

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedClassId) params.classId = selectedClassId;
      
      const response = await api.get('/timetable', { params });
      setTimetable(response.data);
    } catch (error) {
      console.error('Failed to fetch timetable:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPeriod = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setFormError('');
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        teacherId: formData.teacherId
      };
      await api.post('/timetable', payload);
      setShowAddModal(false);
      fetchTimetable();
      showSuccessToast('Period added to schedule successfully');
    } catch (error) {
      const message = error?.response?.data?.error || 'Failed to add period';
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPeriodsForDay = (dayIndex) => {
    return timetable.filter(t => t.dayOfWeek === dayIndex);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Time Table</h1>
          <p className="text-gray-500">
            {isTeacher ? 'My Schedule' : 'Class Schedule'}
          </p>
        </div>
        <div className="flex gap-4">
          {canManage && (
            <>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="ui-input max-w-xs"
              >
                <option value="">Select Class...</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name} - {c.section}</option>
                ))}
              </select>
              <button
                onClick={() => setShowAddModal(true)}
                className="ui-btn ui-btn-primary"
              >
                <Plus size={20} /> Add Period
              </button>
            </>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="ui-card max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Add Time Table Period</h2>
            {formError && (
              <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                <span className="mt-0.5 shrink-0">⚠</span>
                <span>{formError}</span>
              </div>
            )}
            <form onSubmit={handleAddPeriod} className="space-y-4">
              <fieldset disabled={isSubmitting} className="space-y-4 disabled:opacity-70">
              <div>
                <label className="block text-sm font-medium mb-1">Class</label>
                <select
                  required
                  value={formData.classId}
                  onChange={(e) => setFormData({...formData, classId: e.target.value})}
                  className="ui-input"
                >
                  <option value="">Select Class</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name} - {c.section}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <select
                    required
                    value={formData.subjectId}
                    onChange={(e) => setFormData({...formData, subjectId: e.target.value})}
                    className="ui-input"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Teacher</label>
                  <select
                    required
                    value={formData.teacherId}
                    onChange={(e) => { setFormError(''); setFormData({...formData, teacherId: e.target.value}); }}
                    className="ui-input"
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.teacherId}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Day</label>
                <select
                  required
                  value={formData.dayOfWeek}
                  onChange={(e) => setFormData({...formData, dayOfWeek: e.target.value})}
                  className="ui-input"
                >
                  {WORK_DAYS.map(day => (
                    <option key={day} value={day}>{DAYS[day]}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    className="ui-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    className="ui-input"
                  />
                </div>
              </div>
              </fieldset>
               
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setFormError(''); }}
                  className="ui-btn ui-btn-secondary"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ui-btn ui-btn-primary inline-flex items-center gap-2 disabled:opacity-70"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add to Schedule'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed top-4 right-4 z-[60] bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg">
          {toastMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {WORK_DAYS.map(day => (
          <div key={day} className="ui-card ui-card-muted p-4">
            <h3 className="font-bold text-lg mb-3 pb-2 border-b text-center text-gray-700">
              {DAYS[day]}
            </h3>
            <div className="space-y-3">
              {getPeriodsForDay(day).length === 0 ? (
                <p className="text-sm text-gray-400 text-center italic py-4">No classes</p>
              ) : (
                getPeriodsForDay(day).map(period => (
                  <div key={period.id} className="bg-brand-50 p-3 rounded-xl border border-brand-100 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-slate-900">{period.subject?.name}</span>
                      <span className="text-xs bg-white px-1.5 py-0.5 rounded text-brand-700 font-mono border border-brand-200">
                        {period.startTime}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                      <User size={14} />
                      {period.teacher?.user?.firstName} {period.teacher?.user?.lastName?.charAt(0)}.
                    </div>
                    {isTeacher && (
                      <div className="text-xs text-gray-500 mt-1 pt-1 border-t border-brand-100">
                        Class: {period.klass?.name}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeTable;

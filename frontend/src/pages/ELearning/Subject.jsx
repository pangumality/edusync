import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, FileText, Edit2, Volume2, Play, Pause, StopCircle } from 'lucide-react';
import api from '../../utils/api';

export default function Subject() {
  const { subjectId } = useParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subjectName, setSubjectName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [currentUser, setCurrentUser] = useState(null);
  const [speakingId, setSpeakingId] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [query, setQuery] = useState('');
  const [teacherCanManageSubject, setTeacherCanManageSubject] = useState(false);
  const [exams, setExams] = useState([]);
  const [showExamModal, setShowExamModal] = useState(false);
  const [newExam, setNewExam] = useState({ name: '', term: '', year: new Date().getFullYear() });
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setCurrentUser(user);
    fetchData();
  }, [subjectId]);

  const speakNote = (note) => {
    try {
      window.speechSynthesis.cancel();
      const text = [note.title, note.content].filter(Boolean).join('. ');
      const utter = new SpeechSynthesisUtterance(text);
      utter.onend = () => {
        setSpeakingId(null);
        setIsPaused(false);
      };
      window.speechSynthesis.speak(utter);
      setSpeakingId(note.id);
      setIsPaused(false);
    } catch (e) {}
  };

  const pauseSpeak = () => {
    try {
      window.speechSynthesis.pause();
      setIsPaused(true);
    } catch (e) {}
  };

  const resumeSpeak = () => {
    try {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } catch (e) {}
  };

  const stopSpeak = () => {
    try {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      setIsPaused(false);
    } catch (e) {}
  };

  const fetchData = async () => {
    try {
      // Fetch subject details (optional, or filter from list if passed, but simpler to just set name if we had it. 
      // We can fetch subjects to find name or just show ID/Generic header)
      // Let's try to fetch subjects to find the name
      const { data: subjects } = await api.get('/subjects');
      const subject = subjects.find(s => s.id === subjectId);
      if (subject) setSubjectName(subject.name);
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (user?.role === 'teacher') {
        setTeacherCanManageSubject(!!subject);
      } else {
        setTeacherCanManageSubject(false);
      }

      const { data: notesData } = await api.get(`/class-notes?subjectId=${subjectId}`);
      setNotes(notesData);
      const { data: examsData } = await api.get('/exams');
      setExams(examsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/class-notes/${editingId}`, {
            ...newNote,
            subjectId // Keep subjectId same
        });
      } else {
        await api.post('/class-notes', {
            ...newNote,
            subjectId
        });
      }
      setNewNote({ title: '', content: '' });
      setEditingId(null);
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save note:', error);
      alert('Failed to save note');
    }
  };

  const handleEdit = (note) => {
    setNewNote({ title: note.title, content: note.content });
    setEditingId(note.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setNewNote({ title: '', content: '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/class-notes/${id}`);
      fetchData();
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const canManage = currentUser?.role === 'admin' || teacherCanManageSubject;
  const canManageExam = currentUser?.role === 'teacher' || currentUser?.role === 'staff';

  if (loading) return <div>Loading...</div>;

  const filteredNotes = notes.filter(n => {
    const t = (n.title || '').toLowerCase();
    const c = (n.content || '').toLowerCase();
    const q = query.toLowerCase();
    return t.includes(q) || c.includes(q);
  });

  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/exams', newExam);
      const created = res.data;
      setShowExamModal(false);
      setNewExam({ name: '', term: '', year: new Date().getFullYear() });
      navigate(`/exams/${created.id}/setup?subjectId=${subjectId}`);
    } catch (error) {
      alert('Failed to create exam');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/e-learning" className="p-2 bg-white/10 hover:bg-white/20 rounded-full">
              <ArrowLeft size={20} className="text-white" />
            </Link>
            <div>
              <div className="text-xs opacity-80">E-Learning</div>
              <h2 className="text-2xl font-semibold tracking-wide">{subjectName || 'Subject'}</h2>
              <div className="text-xs opacity-80 mt-1">{notes.length} {notes.length === 1 ? 'note' : 'notes'}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {canManage && (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50"
              >
                <Plus size={18} />
                Add Note
              </button>
            )}
            {canManageExam && (
              <>
                <button
                  onClick={() => setShowExamModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50"
                >
                  <Plus size={18} />
                  Set Exam
                </button>
                <Link
                  to={`/exams?subjectId=${subjectId}`}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50"
                >
                  Results
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes"
              className="flex-1 px-3 py-2 rounded-lg bg-white/10 placeholder-white/70 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
            />
          </div>
        </div>
      </div>

      {speakingId && (
        <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Volume2 size={20} />
              </div>
              <div className="text-sm text-gray-700">
                Listening: {filteredNotes.find(n => n.id === speakingId)?.title || 'Note'}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isPaused ? (
                <button onClick={pauseSpeak} className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700">
                  <Pause size={16} />
                </button>
              ) : (
                <button onClick={resumeSpeak} className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700">
                  <Play size={16} />
                </button>
              )}
              <button onClick={stopSpeak} className="px-3 py-2 rounded-md bg-red-100 hover:bg-red-200 text-red-700">
                <StopCircle size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotes.length === 0 ? (
          <p className="text-gray-500">No notes available.</p>
        ) : (
          filteredNotes.map((note) => (
            <div key={note.id} className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <FileText size={22} />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{note.title}</div>
                      <div className="text-xs text-gray-500">{new Date(note.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => speakNote(note)}
                      className="px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                      title="Listen"
                    >
                      <div className="flex items-center gap-1">
                        <Volume2 size={16} />
                        <span className="text-xs">Listen</span>
                      </div>
                    </button>
                    {speakingId === note.id && !isPaused && (
                      <button
                        onClick={pauseSpeak}
                        className="px-2 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
                        title="Pause"
                      >
                        <Pause size={16} />
                      </button>
                    )}
                    {speakingId === note.id && isPaused && (
                      <button
                        onClick={resumeSpeak}
                        className="px-2 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
                        title="Resume"
                      >
                        <Play size={16} />
                      </button>
                    )}
                    {speakingId === note.id && (
                      <button
                        onClick={stopSpeak}
                        className="px-2 py-2 rounded-md bg-red-100 hover:bg-red-200 text-red-700"
                        title="Stop"
                      >
                        <StopCircle size={16} />
                      </button>
                    )}
                    {canManage && (
                      <>
                        <button
                          onClick={() => handleEdit(note)}
                          className="px-2 py-2 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-700"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(note.id)}
                          className="px-2 py-2 rounded-md bg-red-100 hover:bg-red-200 text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-3 text-gray-700 text-sm whitespace-pre-wrap">
                  {String(note.content || '').split(/\s+/).slice(0, 120).join(' ')}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Class Note' : 'Add Class Note'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg h-40"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {editingId ? 'Update Note' : 'Save Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showExamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Exam</h2>
            <form onSubmit={handleCreateExam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name</label>
                <input
                  type="text"
                  required
                  value={newExam.name}
                  onChange={e => setNewExam({ ...newExam, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g. Mid-Term"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
                <input
                  type="text"
                  required
                  value={newExam.term}
                  onChange={e => setNewExam({ ...newExam, term: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g. Spring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <input
                  type="number"
                  required
                  value={newExam.year}
                  onChange={e => setNewExam({ ...newExam, year: parseInt(e.target.value) || '' })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowExamModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

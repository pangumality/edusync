import React, { useState, useEffect } from 'react';
import { Newspaper, Plus, Trash2, Calendar, Send } from 'lucide-react';
import api from '../../utils/api';
import { useOutletContext } from 'react-router-dom';

const Newsletter = () => {
  const { currentUser } = useOutletContext();
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [submitting, setSubmitting] = useState(false);

  // Check if user can manage newsletters (Admin/Staff)
  // Assuming 'staff' role corresponds to School Admin in this context based on app logic
  // or explicitly check permissions if available in currentUser context.
  // For simplicity, checking roles.
  const canManage = ['admin', 'staff'].includes(currentUser?.role);

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const fetchNewsletters = async () => {
    try {
      const response = await api.get('/newsletters');
      setNewsletters(response.data);
    } catch (error) {
      console.error('Failed to fetch newsletters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/newsletters', formData);
      setFormData({ title: '', content: '' });
      setShowForm(false);
      fetchNewsletters();
    } catch (error) {
      console.error('Failed to create newsletter:', error);
      const msg = error.response?.data?.details || error.response?.data?.error || 'Failed to create newsletter';
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this newsletter?')) return;
    try {
      await api.delete(`/newsletters/${id}`);
      setNewsletters(newsletters.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to delete newsletter:', error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading newsletters...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">School Newsletters</h1>
          <p className="text-gray-500">Latest updates and announcements from the school</p>
        </div>
        {canManage && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="ui-btn ui-btn-primary"
          >
            {showForm ? 'Cancel' : <><Plus size={20} /> Create Newsletter</>}
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">New Announcement</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                required
                className="ui-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., End of Term Exam Schedule"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                required
                rows={6}
                className="ui-textarea"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your announcement here..."
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="ui-btn ui-btn-primary disabled:opacity-50"
              >
                {submitting ? 'Publishing...' : <><Send size={18} /> Publish Newsletter</>}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6">
        {newsletters.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <Newspaper size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No newsletters have been published yet.</p>
          </div>
        ) : (
          newsletters.map((newsletter) => (
            <div key={newsletter.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-bold text-gray-800">{newsletter.title}</h2>
                {canManage && (
                  <button
                    onClick={() => handleDelete(newsletter.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Delete Newsletter"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Calendar size={14} />
                <span>{new Date(newsletter.publishedAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
              <div className="prose prose-slate max-w-none text-gray-600 whitespace-pre-wrap">
                {newsletter.content}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Newsletter;

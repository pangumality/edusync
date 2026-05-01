import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Mail, Phone, Send } from 'lucide-react';
import api from '../utils/api';

const Container = ({ children, className = '' }) => (
  <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>
);

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });

  const isValid = useMemo(() => {
    const nameOk = form.name.trim().length >= 2;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    const msgOk = form.message.trim().length >= 10;
    return nameOk && emailOk && msgOk;
  }, [form.email, form.message, form.name]);

  const onChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || submitting) return;
    setSubmitting(true);
    setStatus({ type: null, message: '' });
    try {
      await api.post('/contact', {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        subject: form.subject.trim() || null,
        message: form.message.trim(),
      });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setStatus({ type: 'success', message: 'Message sent. We will get back to you shortly.' });
    } catch (error) {
      const msg =
        error?.response?.data?.error ||
        error?.message ||
        'Failed to send message. Please try again.';
      setStatus({ type: 'error', message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-surface-100 to-surface-50 text-text-base">
      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/80 backdrop-blur">
        <Container className="py-3 flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-sidebar-bg via-sidebar-bg-mid to-sidebar-bg-2 shadow-lg shadow-sidebar-bg-2/20 flex items-center justify-center">
              <span className="text-white font-black tracking-tight">E</span>
            </div>
            <div className="text-base font-black text-slate-900 tracking-tight">EduSync</div>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600 ml-auto">
            <Link to="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <Link to="/services" className="hover:text-slate-900 transition-colors">
              Services
            </Link>
            <span className="text-slate-900">Contact</span>
          </nav>

          <div className="flex items-center gap-2 ml-auto lg:ml-0">
            <Link to="/login" className="ui-btn ui-btn-primary px-4 py-2">
              Sign In <ArrowRight size={16} />
            </Link>
          </div>
        </Container>
      </header>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(10,147,167,0.14),transparent_55%)]" />
        <Container className="py-14 sm:py-18">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-sm font-bold text-sidebar-bg">
              <Mail size={16} />
              Contact
            </div>
            <h1 className="mt-2 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Talk to the EduSync team.
            </h1>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Send a message and we will respond as soon as possible.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-14">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 ui-card ui-card-muted p-7">
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-slate-700">Name</label>
                    <input
                      value={form.name}
                      onChange={onChange('name')}
                      className="mt-2 w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/25 focus:border-brand-400"
                      placeholder="Your name"
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700">Email</label>
                    <input
                      value={form.email}
                      onChange={onChange('email')}
                      className="mt-2 w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/25 focus:border-brand-400"
                      placeholder="you@example.com"
                      autoComplete="email"
                      inputMode="email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-slate-700">Phone (optional)</label>
                    <input
                      value={form.phone}
                      onChange={onChange('phone')}
                      className="mt-2 w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/25 focus:border-brand-400"
                      placeholder="+000 000 000"
                      autoComplete="tel"
                      inputMode="tel"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700">Subject (optional)</label>
                    <input
                      value={form.subject}
                      onChange={onChange('subject')}
                      className="mt-2 w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/25 focus:border-brand-400"
                      placeholder="How can we help?"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">Message</label>
                  <textarea
                    value={form.message}
                    onChange={onChange('message')}
                    className="mt-2 w-full min-h-[140px] resize-y rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/25 focus:border-brand-400"
                    placeholder="Tell us what you need..."
                  />
                  <div className="mt-2 text-xs text-slate-500">Minimum 10 characters.</div>
                </div>

                {status.type && (
                  <div
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                      status.type === 'success'
                        ? 'border-success/25 bg-success/10 text-success'
                        : 'border-red-200 bg-red-50 text-red-700'
                    }`}
                  >
                    {status.message}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <Link to="/" className="ui-btn ui-btn-secondary">
                    <ArrowLeft size={16} /> Back to home
                  </Link>
                  <button
                    type="submit"
                    disabled={!isValid || submitting}
                    className="ui-btn ui-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Sending…' : 'Send message'} <Send size={16} />
                  </button>
                </div>
              </form>
            </div>

            <div className="ui-card ui-card-muted p-7">
              <div className="text-sm font-bold text-sidebar-bg">Direct contact</div>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-sidebar-bg" />
                  <span>support@edusync.local</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-sidebar-bg" />
                  <span>+000 000 000</span>
                </div>
              </div>
              <div className="mt-6">
                <Link to="/login" className="ui-btn ui-btn-primary w-full justify-center">
                  Open system <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}


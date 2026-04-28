import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Bell, CalendarCheck2, FileText, Image as ImageIcon, MessageSquare, Users, Wallet } from 'lucide-react';

const Container = ({ children, className = '' }) => (
  <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>
);

const ServiceCard = ({ icon: Icon, title, desc }) => (
  <div className="group ui-card ui-card-muted p-7 relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(51,207,224,0.16),transparent_55%)] opacity-70" />
    <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-sidebar-bg-2/10 blur-2xl" />
    <div className="relative flex items-start gap-4">
      <div className="rounded-2xl border border-sidebar-bg-2/25 bg-white p-3 text-sidebar-bg shadow-sm shadow-sidebar-bg-2/10 group-hover:bg-sidebar-bg-2/10 transition-colors">
        <Icon size={22} />
      </div>
      <div>
        <h3 className="text-base font-black text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">{desc}</p>
      </div>
    </div>
  </div>
);

export default function Services() {
  const services = [
    { icon: CalendarCheck2, title: 'Attendance', desc: 'Track attendance status, history, and daily summaries.' },
    { icon: MessageSquare, title: 'Messaging', desc: 'Keep communication centralized with messages and notifications.' },
    { icon: Wallet, title: 'Finance', desc: 'Record fees and payments, with clean status tracking.' },
    { icon: FileText, title: 'Exams', desc: 'Setup exams and manage results and reporting workflows.' },
    { icon: ImageIcon, title: 'Gallery', desc: 'Share school moments and updates with a consistent UI.' },
    { icon: Bell, title: 'Newsletters', desc: 'Publish announcements and keep everyone informed.' },
    { icon: Users, title: 'Users & Roles', desc: 'Role-based access for admins, staff, teachers, parents, and students.' },
    { icon: BarChart3, title: 'Dashboards', desc: 'Quick summaries and insights without clutter.' },
  ];

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
            <span className="text-slate-900">Services</span>
            <a href="#contact" className="hover:text-slate-900 transition-colors">
              Contact
            </a>
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
          <div className="max-w-2xl">
            <div className="text-sm font-bold text-sidebar-bg">Services</div>
            <h1 className="mt-2 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Modules designed for school workflows.
            </h1>
            <p className="mt-3 text-slate-600 leading-relaxed">
              EduSync brings the tools you need into one consistent system—clean UI, modern interactions, and role-based access.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s) => (
              <ServiceCard key={s.title} icon={s.icon} title={s.title} desc={s.desc} />
            ))}
          </div>
        </Container>
      </section>

      <section id="contact" className="border-t border-surface-200 bg-white/80 backdrop-blur">
        <Container className="py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm font-semibold text-slate-600">Need help setting up EduSync for your school?</div>
          <Link to="/login" className="ui-btn ui-btn-primary px-4 py-2">
            Open system <ArrowRight size={16} />
          </Link>
        </Container>
      </section>
    </div>
  );
}


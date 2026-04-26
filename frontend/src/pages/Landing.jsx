import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  CalendarCheck2,
  FileText,
  GraduationCap,
  Image as ImageIcon,
  MessageSquare,
  ShieldCheck,
  Users,
  Wallet,
} from 'lucide-react';

const Wave = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 1440 180"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <path
      fill="currentColor"
      d="M0,96L60,117.3C120,139,240,181,360,176C480,171,600,117,720,85.3C840,53,960,43,1080,48C1200,53,1320,75,1380,85.3L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
    />
  </svg>
);

const Container = ({ children, className = '' }) => (
  <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>
);

const StatPill = ({ label, value }) => (
  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
    <span className="text-white/80">{label}</span>
    <span className="rounded-full bg-white/15 px-2 py-0.5">{value}</span>
  </div>
);

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="ui-card ui-card-muted p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
    <div className="flex items-start gap-4">
      <div className="rounded-2xl border border-sidebar-bg-2/25 bg-sidebar-bg-2/15 p-3 text-sidebar-bg">
        <Icon size={22} />
      </div>
      <div>
        <h3 className="text-base font-extrabold text-slate-800">{title}</h3>
        <p className="mt-1 text-sm text-slate-600 leading-relaxed">{desc}</p>
      </div>
    </div>
  </div>
);

const TestimonialCarousel = () => {
  const slides = useMemo(
    () => [
      {
        quote:
          'Attendance, messaging, and finance in one place. Our admins spend less time chasing data and more time supporting teachers.',
        name: 'School Admin',
        role: 'Operations',
      },
      {
        quote:
          'Parents love the transparency — results, fees, and notices are easy to access, and communication is instant.',
        name: 'Teacher',
        role: 'Academic',
      },
      {
        quote:
          'Everything feels modern and simple. Students can focus on learning while the system keeps everything organized.',
        name: 'Student',
        role: 'Learner',
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((v) => (v + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <div className="ui-card ui-card-muted p-8 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(51,207,224,0.14),transparent_55%)]" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sidebar-bg-2/10 blur-3xl" />

      <div className="relative">
        <div className="text-sm font-bold text-sidebar-bg">Trusted across roles</div>
        <p className="mt-3 text-lg sm:text-xl font-black text-slate-900 leading-snug">
          “{slides[index].quote}”
        </p>
        <div className="mt-5 flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-extrabold text-slate-800">{slides[index].name}</div>
            <div className="text-xs text-slate-500 font-semibold">{slides[index].role}</div>
          </div>
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-2.5 w-2.5 rounded-full transition-all ${
                  i === index ? 'bg-sidebar-bg-2' : 'bg-surface-200 hover:bg-surface-100'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-surface-100 to-surface-50 text-text-base">
      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/75 backdrop-blur">
        <Container className="py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-sidebar-bg via-sidebar-bg-mid to-sidebar-bg-2 shadow-lg shadow-sidebar-bg-2/20 flex items-center justify-center">
              <span className="text-white font-black tracking-tight">E</span>
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-900 tracking-tight">EduSync</div>
              <div className="text-[11px] text-slate-500 font-semibold">School management platform</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">
              Features
            </a>
            <a href="#modules" className="hover:text-slate-900 transition-colors">
              Modules
            </a>
            <a href="#security" className="hover:text-slate-900 transition-colors">
              Security
            </a>
            <a href="#contact" className="hover:text-slate-900 transition-colors">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/login" className="ui-btn ui-btn-primary">
              Sign In <ArrowRight size={16} />
            </Link>
          </div>
        </Container>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sidebar-bg via-sidebar-bg-mid to-sidebar-bg-2" />
        <div className="absolute inset-0 opacity-90 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_55%)]" />
        <div className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-[420px] w-[420px] rounded-full bg-white/10 blur-3xl" />

        <Container className="relative py-14 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <StatPill label="Attendance" value="Live" />
                <StatPill label="Messaging" value="Instant" />
                <StatPill label="Finance" value="Tracked" />
                <StatPill label="Results" value="Organized" />
              </div>

              <h1 className="mt-6 text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Run your school with clarity, speed, and a modern experience.
              </h1>
              <p className="mt-4 text-white/85 text-base sm:text-lg leading-relaxed max-w-xl">
                EduSync brings attendance, learning resources, newsletters, gallery, exams, and finance into one system—
                built for admins, staff, teachers, parents, and students.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Link to="/login" className="ui-btn ui-btn-primary">
                  Sign In <ArrowRight size={16} />
                </Link>
                <a href="#features" className="ui-btn ui-btn-secondary border-white/25 bg-white/10 text-white hover:bg-white/15">
                  Explore Features
                </a>
              </div>

              <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
                  <div className="text-white text-lg font-black">All-in-one</div>
                  <div className="text-white/75 text-xs font-semibold">Core modules</div>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
                  <div className="text-white text-lg font-black">Role-based</div>
                  <div className="text-white/75 text-xs font-semibold">Access control</div>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
                  <div className="text-white text-lg font-black">Mobile-ready</div>
                  <div className="text-white/75 text-xs font-semibold">Responsive UI</div>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
                  <div className="text-white text-lg font-black">Fast</div>
                  <div className="text-white/75 text-xs font-semibold">Smooth workflows</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="ui-card p-6 sm:p-8 border-white/25 bg-white/10 text-white shadow-2xl shadow-black/20">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-extrabold tracking-tight">What you can do</div>
                  <div className="text-xs font-semibold text-white/75">Quick preview</div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                    <div className="flex items-center gap-2 text-sm font-extrabold">
                      <CalendarCheck2 size={18} />
                      Attendance
                    </div>
                    <div className="mt-1 text-xs text-white/75">Track presence and history</div>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                    <div className="flex items-center gap-2 text-sm font-extrabold">
                      <MessageSquare size={18} />
                      Messages
                    </div>
                    <div className="mt-1 text-xs text-white/75">Notify and coordinate</div>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                    <div className="flex items-center gap-2 text-sm font-extrabold">
                      <Wallet size={18} />
                      Finance
                    </div>
                    <div className="mt-1 text-xs text-white/75">Fees and payments overview</div>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                    <div className="flex items-center gap-2 text-sm font-extrabold">
                      <FileText size={18} />
                      Exams
                    </div>
                    <div className="mt-1 text-xs text-white/75">Setup, results, reporting</div>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-white/15 bg-white/10 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-sm font-extrabold flex items-center gap-2">
                      <Bell size={18} />
                      Updates & newsletters
                    </div>
                    <div className="text-xs font-semibold text-white/75">Always in sync</div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold">
                      Newsletters
                    </span>
                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold">
                      Gallery
                    </span>
                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold">
                      Certificates
                    </span>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute -bottom-8 -right-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            </div>
          </div>
        </Container>

        <Wave className="absolute -bottom-1 left-0 right-0 h-20 text-surface-50" />
      </section>

      <section id="features" className="py-14 sm:py-18">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-sidebar-bg">Features</div>
              <h2 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Everything your school needs, organized.
              </h2>
              <p className="mt-2 text-slate-600 max-w-2xl">
                Streamline daily operations with a consistent, modern interface across dashboards, forms, and modals.
              </p>
            </div>
            <Link to="/login" className="ui-btn ui-btn-secondary">
              Get started
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard
              icon={Users}
              title="Role-based access"
              desc="Admins, staff, teachers, parents, and students each get the tools they need—nothing more."
            />
            <FeatureCard
              icon={MessageSquare}
              title="Messaging & notices"
              desc="Keep communication fast and centralized with notifications and messages."
            />
            <FeatureCard
              icon={CalendarCheck2}
              title="Attendance tracking"
              desc="Track attendance status, history, and reports with clean workflows."
            />
            <FeatureCard
              icon={BookOpen}
              title="Learning resources"
              desc="Organize e-learning materials and subjects in a structured way."
            />
            <FeatureCard
              icon={ImageIcon}
              title="Gallery & updates"
              desc="Share moments and announcements with a consistent look and feel."
            />
            <FeatureCard
              icon={BarChart3}
              title="Dashboards & insights"
              desc="See quick summaries for key metrics without visual clutter."
            />
          </div>
        </Container>
      </section>

      <section id="modules" className="py-14 sm:py-18 bg-white/60 border-y border-white/70">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <div className="text-sm font-bold text-sidebar-bg">Modules</div>
              <h2 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Services built for real workflows.
              </h2>
              <p className="mt-2 text-slate-600">
                From admissions to daily operations—use what you need today and scale as you grow.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="ui-card ui-card-muted p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-brand-200 bg-brand-50 p-3 text-brand-800">
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-slate-800">Students & Classes</div>
                      <div className="text-xs text-slate-500 font-semibold">Records, sections, organization</div>
                    </div>
                  </div>
                </div>
                <div className="ui-card ui-card-muted p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-sidebar-bg-2/25 bg-sidebar-bg-2/15 p-3 text-sidebar-bg">
                      <FileText size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-slate-800">Exams & Certificates</div>
                      <div className="text-xs text-slate-500 font-semibold">Setup, results, downloads</div>
                    </div>
                  </div>
                </div>
                <div className="ui-card ui-card-muted p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-success/25 bg-success/10 p-3 text-success">
                      <Wallet size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-slate-800">Finance</div>
                      <div className="text-xs text-slate-500 font-semibold">Fees, payments, status</div>
                    </div>
                  </div>
                </div>
                <div className="ui-card ui-card-muted p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-brand-200 bg-brand-50 p-3 text-brand-800">
                      <Bell size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-slate-800">Newsletters</div>
                      <div className="text-xs text-slate-500 font-semibold">Share updates instantly</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <TestimonialCarousel />
          </div>
        </Container>
      </section>

      <section id="security" className="py-14 sm:py-18">
        <Container>
          <div className="ui-card ui-card-muted p-8 overflow-hidden relative">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(10,147,167,0.12),transparent_55%)]" />
            <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-sidebar-bg-2/25 bg-sidebar-bg-2/15 p-3 text-sidebar-bg">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-sidebar-bg">Security</div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Access control that fits your roles.
                    </h3>
                  </div>
                </div>
                <p className="mt-3 text-slate-600 leading-relaxed">
                  Keep sensitive data protected with role-based access. Teachers see their workflows, admins manage the
                  system, and parents access only their children’s information.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Link to="/login" className="ui-btn ui-btn-primary w-full">
                  Sign In
                </Link>
                <a href="#contact" className="ui-btn ui-btn-secondary w-full">
                  Contact us
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <footer id="contact" className="border-t border-surface-200 bg-white/80 backdrop-blur">
        <Container className="py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-sidebar-bg via-sidebar-bg-mid to-sidebar-bg-2 shadow-lg shadow-sidebar-bg-2/20 flex items-center justify-center">
                  <span className="text-white font-black tracking-tight">E</span>
                </div>
                <div>
                  <div className="text-sm font-extrabold text-slate-900 tracking-tight">EduSync</div>
                  <div className="text-[11px] text-slate-500 font-semibold">Modern school management</div>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-sm">
                A unified platform for attendance, communication, finance, learning resources, and reporting.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-extrabold text-slate-800">Product</div>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li>
                    <a href="#features" className="hover:text-slate-900">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#modules" className="hover:text-slate-900">
                      Modules
                    </a>
                  </li>
                  <li>
                    <a href="#security" className="hover:text-slate-900">
                      Security
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <div className="text-sm font-extrabold text-slate-800">Access</div>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li>
                    <Link to="/login" className="hover:text-slate-900">
                      Sign in
                    </Link>
                  </li>
                  <li className="text-slate-500">Admin • Staff • Teacher</li>
                  <li className="text-slate-500">Parent • Student</li>
                </ul>
              </div>
            </div>

            <div>
              <div className="text-sm font-extrabold text-slate-800">Contact</div>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <div>Support: support@edusync.local</div>
                <div>Phone: +000 000 000</div>
              </div>
              <div className="mt-4">
                <Link to="/login" className="ui-btn ui-btn-primary">
                  Open system <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-surface-200 pt-6 text-xs text-slate-500">
            <div>© {new Date().getFullYear()} EduSync. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <a href="#contact" className="hover:text-slate-700">
                Privacy
              </a>
              <a href="#contact" className="hover:text-slate-700">
                Terms
              </a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}


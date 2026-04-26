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
  Search,
  ShieldCheck,
  Users,
  Wallet,
} from 'lucide-react';
import heroStudent from '../../school_girl-removebg-preview.png';

const Container = ({ children, className = '' }) => (
  <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 ${className}`}>{children}</div>
);

const FeatureCard = ({ icon: Icon, title, desc }) => (
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

const ModuleCard = ({ icon: Icon, title, desc, tone = 'sidebar' }) => (
  <div className="group ui-card ui-card-muted p-6 relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
    <div
      className={`pointer-events-none absolute inset-x-0 top-0 h-1 ${
        tone === 'success'
          ? 'bg-success/60'
          : tone === 'brand'
          ? 'bg-brand-500/60'
          : 'bg-sidebar-bg-2/60'
      }`}
    />
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(10,147,167,0.10),transparent_55%)] opacity-70" />
    <div className="relative flex items-start gap-4">
      <div
        className={`rounded-2xl border p-3 ${
          tone === 'success'
            ? 'border-success/25 bg-success/10 text-success'
            : tone === 'brand'
            ? 'border-brand-200 bg-brand-50 text-brand-800'
            : 'border-sidebar-bg-2/25 bg-sidebar-bg-2/15 text-sidebar-bg'
        }`}
      >
        <Icon size={20} />
      </div>
      <div>
        <div className="text-sm font-black text-slate-900">{title}</div>
        <div className="mt-1 text-sm text-slate-600 leading-relaxed">{desc}</div>
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
  const [query, setQuery] = useState('');

  const popular = useMemo(
    () => ['Attendance', 'Finance', 'Messaging', 'Exams'],
    []
  );

  const features = useMemo(
    () => [
      {
        icon: Users,
        title: 'Role-based access',
        desc: 'Admins, staff, teachers, parents, and students each get the tools they need—nothing more.',
      },
      {
        icon: MessageSquare,
        title: 'Messaging & notices',
        desc: 'Keep communication fast and centralized with notifications and messages.',
      },
      {
        icon: CalendarCheck2,
        title: 'Attendance tracking',
        desc: 'Track attendance status, history, and reports with clean workflows.',
      },
      {
        icon: BookOpen,
        title: 'Learning resources',
        desc: 'Organize e-learning materials and subjects in a structured way.',
      },
      {
        icon: ImageIcon,
        title: 'Gallery & updates',
        desc: 'Share moments and announcements with a consistent look and feel.',
      },
      {
        icon: BarChart3,
        title: 'Dashboards & insights',
        desc: 'See quick summaries for key metrics without visual clutter.',
      },
    ],
    []
  );

  const filteredFeatures = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return features;
    return features.filter((f) => `${f.title} ${f.desc}`.toLowerCase().includes(q));
  }, [features, query]);

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onSearch = (e) => {
    e.preventDefault();
    scrollToFeatures();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-surface-100 to-surface-50 text-text-base">
      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/80 backdrop-blur">
        <Container className="py-3 flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-sidebar-bg via-sidebar-bg-mid to-sidebar-bg-2 shadow-lg shadow-sidebar-bg-2/20 flex items-center justify-center">
              <span className="text-white font-black tracking-tight">E</span>
            </div>
            <div className="text-base font-black text-slate-900 tracking-tight">EduSync</div>
          </div>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600 ml-auto">
            <a href="#features" className="hover:text-slate-900 transition-colors">
              Features
            </a>
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

      <section className="relative overflow-hidden bg-surface-50">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-surface-50 via-surface-50 to-surface-100" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 -skew-x-12 origin-top-right translate-x-10 bg-gradient-to-br from-sidebar-bg-mid to-sidebar-bg-2" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 -skew-x-12 origin-top-right translate-x-10 opacity-65 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_55%)]" />
        <div className="pointer-events-none absolute -top-32 -left-32 h-[380px] w-[380px] rounded-full bg-sidebar-bg-2/10 blur-3xl" />

        <Container className="relative pt-14 sm:pt-20 pb-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                Find the perfect school management platform for your institution.
              </h1>
              <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
                EduSync brings attendance, communication, exams, newsletters, galleries, and finance into one clean system.
              </p>

              <form onSubmit={onSearch} className="mt-7 pb-14 sm:pb-20">
                <div className="flex items-stretch overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-[0_14px_32px_-22px_rgba(15,23,42,0.55)]">
                  <div className="flex items-center gap-2 px-4 text-slate-400">
                    <Search size={18} />
                  </div>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Try “attendance”, “finance”, “messaging”…"
                    className="flex-1 py-3 pr-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-6 sm:px-8 font-extrabold text-white bg-sidebar-bg hover:bg-sidebar-bg-mid transition-colors"
                  >
                    Search
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-slate-500 font-semibold">Popular:</span>
                  {popular.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setQuery(tag);
                        scrollToFeatures();
                      }}
                      className="rounded-full border border-surface-200 bg-white px-3 py-1 text-xs font-bold text-slate-700 hover:border-sidebar-bg-2/40 hover:bg-sidebar-bg-2/10 hover:text-slate-900 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </form>
            </div>

            <div className="relative hidden lg:flex justify-end items-end self-stretch min-h-[520px]">
              <img
                src={heroStudent}
                alt="Student"
                className="w-[540px] xl:w-[660px] max-w-none object-contain drop-shadow-[0_34px_60px_rgba(15,23,42,0.28)]"
              />
            </div>
          </div>
        </Container>
      </section>

      <section id="features" className="py-16 sm:py-24">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-sidebar-bg">Features</div>
              <h2 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Everything your school needs, organized.
              </h2>
              <p className="mt-2 text-slate-600 max-w-2xl">
                Search above to quickly find a feature, or browse the essentials below.
              </p>
            </div>
            <Link to="/login" className="ui-btn ui-btn-secondary">
              Get started
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFeatures.map((f) => (
              <FeatureCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} />
            ))}
          </div>
        </Container>
      </section>

      <section id="modules" className="py-16 sm:py-24 bg-white/60 border-y border-white/70">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
            <div>
              <div className="text-sm font-bold text-sidebar-bg">Modules</div>
              <h2 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Services built for real workflows.
              </h2>
              <p className="mt-2 text-slate-600">
                From admissions to daily operations—use what you need today and scale as you grow.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ModuleCard
                  icon={GraduationCap}
                  title="Students & Classes"
                  desc="Records, sections, organization"
                  tone="brand"
                />
                <ModuleCard
                  icon={FileText}
                  title="Exams & Certificates"
                  desc="Setup, results, downloads"
                  tone="sidebar"
                />
                <ModuleCard icon={Wallet} title="Finance" desc="Fees, payments, status" tone="success" />
                <ModuleCard icon={Bell} title="Newsletters" desc="Share updates instantly" tone="brand" />
              </div>
            </div>

            <TestimonialCarousel />
          </div>
        </Container>
      </section>

      <section id="security" className="py-16 sm:py-24">
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
                <div className="text-base font-black text-slate-900 tracking-tight">EduSync</div>
              </div>
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

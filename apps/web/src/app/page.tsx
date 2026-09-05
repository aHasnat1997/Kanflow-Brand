import Link from "next/link";
import {
  PlayCircle,
  RefreshCw,
  MousePointer2,
  Shield,
  Star,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white min-h-screen">
      {/* 1. Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white">
                  <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor" opacity="0.9" />
                  <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor" opacity="0.6" />
                  <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.6" />
                  <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.3" />
                </svg>
              </div>
              <span className="text-lg font-bold text-[#0d1c2f] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Kanflow
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              className="inline-flex items-center justify-center bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-semibold shadow-sm hover:bg-indigo-500 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
              href="/boards"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* 2. Hero Section */}
        <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden">
          {/* Subtle top gradient glow */}
          <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-200 to-indigo-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Announcement badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100/80 transition-all cursor-pointer mb-8">
              <span>✨ Kanflow 2.0 is now live</span>
              <span className="text-indigo-400">→</span>
            </div>
            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Workflow management designed for <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">clarity</span>
            </h1>
            {/* Subtitle */}
            <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed">
              A fast, flexible, and intuitive Kanban board for engineering and product teams. Prioritize tasks, track progress, and ship faster together.
            </p>
            {/* CTA group */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base shadow-sm hover:shadow-indigo-500/20 transition-all"
                href="/boards"
              >
                Start Free Trial
              </Link>
              <a className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-base transition-all shadow-sm" href="#demo">
                <PlayCircle className="w-5 h-5 mr-2 text-slate-500" />
                Watch Demo
              </a>
            </div>
            {/* Social proof subtext */}
            <p className="mt-4 text-xs font-medium text-slate-500 tracking-wide">
              No credit card required · Free 14-day trial · Setup in 2 minutes
            </p>
          </div>
        </section>

        {/* 4. Trusted By / Social Proof */}
        <section className="py-14 border-y border-slate-200/80 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
              Trusted by innovative teams worldwide
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-70 grayscale hover:grayscale-0 transition-all">
              {/* Vercel style */}
              <div className="flex items-center gap-2 font-display font-bold tracking-tight text-slate-800 text-lg">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 116 100"><polygon points="58 0 116 100 0 100"></polygon></svg>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>VERCEL</span>
              </div>
              {/* Linear style */}
              <div className="flex items-center gap-2 font-display font-bold tracking-tight text-slate-800 text-lg">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 100 100"><path d="M10 50 A40 40 0 0 1 90 50 A40 40 0 0 1 10 50 Z" fillOpacity="0.2"></path><path d="M25 50 A25 25 0 0 1 75 50" fill="none" stroke="currentColor" strokeWidth="8"></path></svg>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Linear</span>
              </div>
              {/* Stripe style */}
              <div className="flex items-center gap-2 font-display font-extrabold tracking-tight text-slate-800 text-2xl lowercase">
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>stripe</span>
              </div>
              {/* Supabase style */}
              <div className="flex items-center gap-2 font-display font-bold tracking-tight text-slate-800 text-lg">
                <svg className="h-5 w-5 fill-current text-emerald-600" viewBox="0 0 24 24"><path d="M13.4 2.1a1 1 0 0 0-1.8.6L9.8 12.3h7.9a1 1 0 0 1 .8 1.6L7.4 23.3a1 1 0 0 1-1.7-.7l1.8-9.4H.9a1 1 0 0 1-.8-1.6L11.6 2.3a1 1 0 0 1 1.8-.2z"></path></svg>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>supabase</span>
              </div>
              {/* Figma style */}
              <div className="flex items-center gap-2 font-display font-bold tracking-tight text-slate-800 text-lg">
                <span className="w-4 h-4 rounded-full bg-slate-900 inline-block"></span>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Figma</span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Key Features Grid */}
        <section className="py-24 bg-slate-50" id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-display text-xs font-semibold tracking-widest text-indigo-600 uppercase" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Engineered for Velocity</h2>
              <p className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Everything your team needs to ship on schedule
              </p>
              <p className="mt-4 text-base text-slate-600">
                Cut out the project management bloat. Focus on high-impact work with high-velocity tools.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-6">
                    <MousePointer2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Effortless Drag & Drop</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    Reorder tasks with smooth animations and zero lag. Re-architect sprints and backlog priorities in seconds with instant visual feedback.
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center text-xs font-semibold text-indigo-600">
                  <span>Explore drag ergonomics</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
              {/* Card 2 */}
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 mb-6">
                    <RefreshCw className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Real-Time Sync</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    Work synchronously with teammates without conflicts or page refreshes. Real-time presence indicators show who is actively updating which task.
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center text-xs font-semibold text-indigo-600">
                  <span>View sync architecture</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
              {/* Card 3 */}
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-6">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Granular Permissions</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    Role-based access control (Admin, Member, Viewer) tailored for organizations. Protect core roadmaps while keeping cross-functional teams aligned.
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center text-xs font-semibold text-indigo-600">
                  <span>Learn about RBAC</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Testimonial Section */}
        <section className="py-24 bg-white border-t border-slate-200/80" id="customers">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* 5-star rating */}
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <blockquote className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug sm:leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              “Kanflow helped our engineering team cut sprint planning time in half. It is fast, intuitive, and stays out of the way.”
            </blockquote>
            <div className="mt-8 flex items-center justify-center gap-4">
              <img alt="Sarah Jenkins" className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-500/20 shadow-sm" src="https://lh3.googleusercontent.com/aida/AEtjO1WcNpb1TLluv4vOkF5zvY7rXz0p7v01wuwhPrM8jcJVZjuPvIeq5M8UA8Qgj-8OUCLyeWH-k9H7kbjpj148CzmBjJfICFLPdxiVY3t0yObFd0ZnWiBCJQcZhsej4q9lGcigwOLlJ7H6gqiX_Cl2BvpoVaKX9F6Xx6d-576vxcffi4Fu8ITLG_zsyBw925-4stj5TgE5kYm84gmg_AJVaXGKCVjbMBymCihEKLOHg-2MSkPOjLy_xk0e0Ja9" />
              <div className="text-left">
                <div className="font-display font-semibold text-slate-900 text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Sarah Jenkins</div>
                <div className="text-slate-500 text-sm">VP of Product at HyperScale Labs</div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Call To Action Banner */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-14 text-center shadow-2xl">
              {/* Background decorative radial glow */}
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Ready to streamline your workflow?
                </h2>
                <p className="mt-4 text-slate-300 text-base sm:text-lg">
                  Join thousands of high-performing product and engineering teams shipping with Kanflow today.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-base shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    href="/boards"
                  >
                    Get Started for Free
                  </Link>
                  <a className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-white border border-slate-700 font-semibold text-base transition-all" href="#contact">
                    Talk to Sales
                  </a>
                </div>
                <p className="mt-4 text-xs text-slate-400">
                  No credit card required · Instant 2-minute onboarding
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 8. Comprehensive Footer */}
      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Logo & Description */}
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white">
                    <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor" opacity="0.9" />
                    <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor" opacity="0.6" />
                    <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.6" />
                    <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.3" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-[#0d1c2f] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Kanflow
                </span>
              </Link>
              <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
                The next-generation project management platform built for software teams who value speed, focus, and clean visual execution.
              </p>
              <div className="mt-5 flex items-center gap-4 text-slate-400">
                <a className="hover:text-slate-600 transition-colors" href="#">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd"></path></svg>
                </a>
                <a className="hover:text-slate-600 transition-colors" href="#">
                  <span className="sr-only">Twitter / X</span>
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                </a>
              </div>
            </div>
            {/* Product links */}
            <div>
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Product</h4>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
                <li><a className="hover:text-slate-900 transition-colors" href="#features">Features</a></li>
                <li><a className="hover:text-slate-900 transition-colors" href="#board">Kanban Board</a></li>
                <li><a className="hover:text-slate-900 transition-colors" href="#integrations">Integrations</a></li>
                <li><a className="hover:text-slate-900 transition-colors" href="#changelog">Changelog</a></li>
              </ul>
            </div>
            {/* Resources links */}
            <div>
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Resources</h4>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
                <li><a className="hover:text-slate-900 transition-colors" href="#docs">Documentation</a></li>
                <li><a className="hover:text-slate-900 transition-colors" href="#guides">Guides</a></li>
                <li><a className="hover:text-slate-900 transition-colors" href="#api">API Reference</a></li>
                <li><a className="hover:text-slate-900 transition-colors" href="#community">Community</a></li>
              </ul>
            </div>
            {/* Company & Legal */}
            <div>
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Company</h4>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
                <li><a className="hover:text-slate-900 transition-colors" href="#about">About Us</a></li>
                <li><a className="hover:text-slate-900 transition-colors" href="#privacy">Privacy Policy</a></li>
                <li><a className="hover:text-slate-900 transition-colors" href="#terms">Terms of Service</a></li>
                <li><a className="hover:text-slate-900 transition-colors" href="#security">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
            <p>© 2025 Kanflow, Inc. All rights reserved.</p>
            <div className="flex items-center gap-6 mt-4 sm:mt-0">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

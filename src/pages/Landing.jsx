import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Button from '../components/ui/Button'
import LiveDemo from '../components/LiveDemo'
import PricingCard from '../components/PricingCard'
import Testimonials from '../components/Testimonials'

/**
 * Landing page - clean, focused, conversion-optimized
 * @returns {JSX.Element}
 */
function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-16 sm:pt-24 pb-16 sm:pb-20">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              Powered by ChatGPT
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 tracking-tight mb-6 text-balance">
              AI Resume Editor That{' '}
              <span className="text-primary-600">Actually Works</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-stone-600 mb-8 max-w-2xl mx-auto text-balance">
              Write, improve, and polish your resume with AI that suggests changes in real-time.
              No fluff. No hidden pricing. Just results.
            </p>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button as={Link} to="/editor" size="lg" className="w-full sm:w-auto">
                Start Building — Free
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </div>

            {/* Secondary link */}
            <p className="mt-4 text-sm text-stone-500">
              Already have a resume?{' '}
              <Link to="/editor" className="text-primary-600 font-medium hover:underline">
                Upload & improve it
              </Link>
            </p>
          </div>

          {/* Hero Visual - Editor Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
                {/* Window Chrome */}
                <div className="px-4 py-3 bg-stone-100 border-b border-stone-200 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <div className="flex-1 text-center text-xs text-stone-500">resume-editor</div>
                </div>

                {/* Mock Editor */}
                <div className="flex">
                  {/* Document Area */}
                  <div className="flex-1 p-6 bg-white">
                    <div className="space-y-4">
                      <div className="h-8 bg-stone-100 rounded w-48" />
                      <div className="h-4 bg-stone-100 rounded w-full" />
                      <div className="h-4 bg-stone-100 rounded w-5/6" />
                      <div className="h-4 bg-stone-100 rounded w-4/6" />
                      <div className="mt-6 h-6 bg-stone-100 rounded w-32" />
                      <div className="h-4 bg-primary-100 rounded w-full" />
                      <div className="h-4 bg-primary-100 rounded w-5/6" />
                    </div>
                  </div>

                  {/* AI Sidebar Mock */}
                  <div className="w-72 bg-stone-50 border-l border-stone-200 p-4 hidden sm:block">
                    <div className="text-xs font-medium text-stone-500 mb-3">AI Assistant</div>
                    <div className="space-y-3">
                      <div className="chat-message chat-message-assistant">
                        <div className="text-xs">
                          I've improved your bullet point to include quantified achievements...
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <span className="px-2 py-1 bg-white rounded-full border border-stone-200 text-xs text-stone-600">Improve</span>
                        <span className="px-2 py-1 bg-white rounded-full border border-stone-200 text-xs text-stone-600">Shorten</span>
                        <span className="px-2 py-1 bg-white rounded-full border border-stone-200 text-xs text-stone-600">Expand</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <LiveDemo />

      {/* How It Works */}
      <section className="py-16 sm:py-24">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-3">
              Three Steps. That's It.
            </h2>
            <p className="text-stone-600">
              No complicated setup. No learning curve.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '1',
                title: 'Paste or start fresh',
                description: 'Drop in your existing resume or start from one of our templates.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                ),
              },
              {
                step: '2',
                title: 'Select & improve',
                description: 'Highlight any text and let AI enhance it with one click.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                ),
              },
              {
                step: '3',
                title: 'Export polished resume',
                description: 'Download as PDF or DOCX, ready for your next application.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                ),
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    {item.icon}
                  </svg>
                </div>
                <div className="text-sm font-medium text-primary-600 mb-1">Step {item.step}</div>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">{item.title}</h3>
                <p className="text-stone-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Pricing */}
      <PricingCard />

      {/* Final CTA */}
      <section className="py-16 sm:py-24 bg-stone-900">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to land your next job?
          </h2>
          <p className="text-stone-400 mb-8 max-w-xl mx-auto">
            Join thousands of job seekers who improved their resumes and got more interviews.
          </p>
          <Button as={Link} to="/editor" size="lg">
            Start Building — Free
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-stone-200">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-stone-500 text-sm">
              <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span className="font-semibold text-stone-900">ResumeAI</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-stone-500">
              <a href="#" className="hover:text-stone-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-stone-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-stone-900 transition-colors">Contact</a>
            </div>

            <div className="text-sm text-stone-400">
              Built with ChatGPT
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-stone-200 sm:hidden z-50">
        <Button as={Link} to="/editor" className="w-full justify-center">
          Start Building — Free
        </Button>
      </div>
    </div>
  )
}

export default Landing

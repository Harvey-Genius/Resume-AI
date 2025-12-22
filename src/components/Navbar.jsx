import { Link, useLocation } from 'react-router-dom'
import Button from './ui/Button'

/**
 * Navigation bar component
 * Adapts based on current route (landing vs editor)
 * @returns {JSX.Element}
 */
function Navbar() {
  const location = useLocation()
  const isEditor = location.pathname === '/editor'

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-semibold text-stone-900 hover:text-primary-600 transition-colors"
          >
            <svg
              className="w-8 h-8 text-primary-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            <span>ResumeAI</span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {!isEditor && (
              <>
                <a
                  href="#demo"
                  className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
                >
                  See Demo
                </a>
                <a
                  href="#pricing"
                  className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Pricing
                </a>
              </>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            {isEditor ? (
              <>
                <Button variant="ghost" size="sm">
                  Save
                </Button>
                <Button variant="outline" size="sm">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Export
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/editor"
                  className="hidden sm:block text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Sign In
                </Link>
                <Button as={Link} to="/editor" size="sm">
                  Start Free
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

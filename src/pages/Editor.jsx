import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import DocumentEditor from '../components/Editor/DocumentEditor'
import AISidebar from '../components/Editor/AISidebar'

/**
 * Main Editor page with split-view layout
 * @returns {JSX.Element}
 */
function Editor() {
  const [documentContent, setDocumentContent] = useState('')
  const [documentTitle, setDocumentTitle] = useState('Untitled Resume')
  const [selection, setSelection] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeEmail, setUpgradeEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)

  // Handle upgrade email submission
  const handleUpgradeSubmit = (e) => {
    e.preventDefault()
    if (upgradeEmail) {
      // Store email for later
      const emails = JSON.parse(localStorage.getItem('upgradeEmails') || '[]')
      emails.push({ email: upgradeEmail, date: new Date().toISOString() })
      localStorage.setItem('upgradeEmails', JSON.stringify(emails))
      setEmailSubmitted(true)
    }
  }

  // Handle inserting AI-generated content
  const handleInsert = useCallback((content, selectionInfo) => {
    if (selectionInfo) {
      // Replace selected text
      const before = documentContent.slice(0, selectionInfo.start)
      const after = documentContent.slice(selectionInfo.end)
      setDocumentContent(before + content + after)
      setSelection(null)
    } else {
      // Append to document
      setDocumentContent((prev) => {
        if (prev.trim()) {
          return prev + '\n\n' + content
        }
        return content
      })
    }
  }, [documentContent])

  return (
    <div className="h-screen flex flex-col bg-stone-100">
      {/* Top Navigation */}
      <nav className="flex items-center justify-between px-4 py-2 bg-white border-b border-stone-200 flex-shrink-0">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold text-stone-900 hover:text-primary-600 transition-colors"
        >
          <svg
            className="w-7 h-7 text-primary-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
          <span className="hidden sm:inline">ResumeAI</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Upgrade button */}
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="hidden sm:block px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            Upgrade to Pro
          </button>

          {/* AI Sidebar Toggle (Mobile) */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Open AI Assistant"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Document Editor */}
        <main className="flex-1 overflow-hidden">
          <DocumentEditor
            content={documentContent}
            setContent={setDocumentContent}
            selection={selection}
            setSelection={setSelection}
            title={documentTitle}
            setTitle={setDocumentTitle}
          />
        </main>

        {/* AI Sidebar */}
        <AISidebar
          documentContent={documentContent}
          selection={selection}
          onInsert={handleInsert}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onUpgradeClick={() => setShowUpgradeModal(true)}
        />
      </div>

      {/* Mobile AI Button (Fixed) */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors flex items-center justify-center z-30"
        aria-label="Open AI Assistant"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      </button>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowUpgradeModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {!emailSubmitted ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-stone-900 mb-2">
                    Pro Plan Launching Soon!
                  </h3>
                  <p className="text-stone-600 text-sm">
                    Get notified when Pro launches and receive <span className="font-semibold text-primary-600">50% off</span> your first month.
                  </p>
                </div>

                <form onSubmit={handleUpgradeSubmit} className="space-y-4">
                  <input
                    type="email"
                    value={upgradeEmail}
                    onChange={(e) => setUpgradeEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="w-full px-4 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Notify Me
                  </button>
                </form>

                <p className="text-xs text-stone-500 text-center mt-4">
                  We'll never spam you. Unsubscribe anytime.
                </p>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-stone-900 mb-2">
                  You're on the list!
                </h3>
                <p className="text-stone-600 text-sm mb-4">
                  We'll email you as soon as Pro is available.
                </p>
                <button
                  onClick={() => {
                    setShowUpgradeModal(false)
                    setEmailSubmitted(false)
                    setUpgradeEmail('')
                  }}
                  className="px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Editor

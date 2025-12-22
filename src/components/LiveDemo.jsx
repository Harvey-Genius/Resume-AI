import { useState, useEffect, useRef } from 'react'
import Button from './ui/Button'

const SAMPLE_BULLET = "Responsible for managing team projects and ensuring deadlines were met on time."

const IMPROVED_BULLET = "Led cross-functional team of 8 engineers to deliver 12 projects on schedule, reducing time-to-market by 23% through streamlined workflows."

/**
 * Live Demo component - shows AI in action on the landing page
 * Users can see the AI rewrite a sample bullet point in real-time
 * @returns {JSX.Element}
 */
function LiveDemo() {
  const [currentText, setCurrentText] = useState(SAMPLE_BULLET)
  const [isTyping, setIsTyping] = useState(false)
  const [hasImproved, setHasImproved] = useState(false)
  const typingRef = useRef(null)

  const handleTryIt = () => {
    if (isTyping) return

    setIsTyping(true)
    setHasImproved(false)

    // Simulate deletion
    let deleteIndex = currentText.length
    const deleteInterval = setInterval(() => {
      deleteIndex--
      if (deleteIndex <= 0) {
        clearInterval(deleteInterval)
        setCurrentText('')

        // Start typing improved text
        let typeIndex = 0
        const typeInterval = setInterval(() => {
          typeIndex++
          setCurrentText(IMPROVED_BULLET.slice(0, typeIndex))

          if (typeIndex >= IMPROVED_BULLET.length) {
            clearInterval(typeInterval)
            setIsTyping(false)
            setHasImproved(true)
          }
        }, 20)

        typingRef.current = typeInterval
      } else {
        setCurrentText(SAMPLE_BULLET.slice(0, deleteIndex))
      }
    }, 15)

    typingRef.current = deleteInterval
  }

  const handleReset = () => {
    if (typingRef.current) {
      clearInterval(typingRef.current)
    }
    setCurrentText(SAMPLE_BULLET)
    setIsTyping(false)
    setHasImproved(false)
  }

  useEffect(() => {
    return () => {
      if (typingRef.current) {
        clearInterval(typingRef.current)
      }
    }
  }, [])

  return (
    <section id="demo" className="py-16 sm:py-24 bg-stone-50">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-3 text-balance">
            See the AI in Action
          </h2>
          <p className="text-stone-600 max-w-xl mx-auto">
            No sign-up required. Watch how our AI transforms weak bullet points into powerful, quantified achievements.
          </p>
        </div>

        {/* Demo Container */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-xs text-stone-500 font-medium">Resume Preview</span>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-2 text-xs font-medium text-stone-500 uppercase tracking-wide">
                Experience Bullet Point
              </div>

              <div
                className="min-h-[80px] p-4 rounded-lg border border-stone-200 bg-stone-50 font-document text-stone-800 text-[15px] leading-relaxed"
                role="region"
                aria-label="Demo text area"
                aria-live="polite"
              >
                {currentText}
                {isTyping && (
                  <span className="inline-block w-0.5 h-5 bg-primary-600 ml-0.5 animate-pulse" aria-hidden="true" />
                )}
              </div>

              {/* Status indicator */}
              {hasImproved && (
                <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Added quantified metrics and action verbs</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex flex-wrap gap-3 items-center justify-between">
              <div className="flex gap-2">
                <Button
                  onClick={handleTryIt}
                  disabled={isTyping}
                  size="sm"
                >
                  {isTyping ? (
                    <>
                      <span className="thinking-dot" />
                      <span className="thinking-dot" />
                      <span className="thinking-dot" />
                      <span className="ml-2">Improving...</span>
                    </>
                  ) : hasImproved ? (
                    'Try Again'
                  ) : (
                    'Try It — Improve This'
                  )}
                </Button>

                {hasImproved && (
                  <Button
                    onClick={handleReset}
                    variant="ghost"
                    size="sm"
                  >
                    Reset
                  </Button>
                )}
              </div>

              <span className="text-xs text-stone-500">
                Powered by ChatGPT
              </span>
            </div>
          </div>

          {/* Callout */}
          <p className="text-center mt-6 text-stone-600 text-sm">
            This is just a preview.{' '}
            <a href="/editor" className="text-primary-600 font-medium hover:underline">
              Try the full editor
            </a>{' '}
            with your own resume.
          </p>
        </div>
      </div>
    </section>
  )
}

export default LiveDemo

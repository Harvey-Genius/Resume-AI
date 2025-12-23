import { useState } from 'react'

/**
 * Job Description Keyword Matcher component
 * @param {Object} props
 * @param {string} props.documentContent - Current resume content
 * @param {function} props.onAddKeywords - Callback to trigger AI to add missing keywords
 * @returns {JSX.Element}
 */
function JobMatcher({ documentContent, onAddKeywords }) {
  const [isOpen, setIsOpen] = useState(false)
  const [jobDescription, setJobDescription] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)

  const analyzeJob = async () => {
    if (!jobDescription.trim()) return

    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: `You are a resume keyword analyzer. Extract important keywords from job descriptions.

Return ONLY valid JSON in this exact format, no other text:
{
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "skills": ["skill1", "skill2"],
  "tools": ["tool1", "tool2"],
  "softSkills": ["soft skill 1", "soft skill 2"]
}

Extract:
- Technical skills and technologies
- Tools and software mentioned
- Soft skills and qualities
- Industry-specific terms
- Required qualifications

Keep each array to 5-10 most important items.`,
          messages: [{
            role: 'user',
            content: `Extract keywords from this job description:\n\n${jobDescription}`
          }]
        })
      })

      const data = await response.json()
      const aiResponse = data.content || ''

      // Parse JSON from response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])

        // Check which keywords are in the resume
        const allKeywords = [
          ...(parsed.keywords || []),
          ...(parsed.skills || []),
          ...(parsed.tools || []),
          ...(parsed.softSkills || [])
        ]

        const contentLower = documentContent.toLowerCase()

        const matched = allKeywords.filter(kw =>
          contentLower.includes(kw.toLowerCase())
        )

        const missing = allKeywords.filter(kw =>
          !contentLower.includes(kw.toLowerCase())
        )

        setAnalysis({
          ...parsed,
          matched,
          missing,
          matchPercent: Math.round((matched.length / allKeywords.length) * 100) || 0
        })
      }
    } catch (error) {
      console.error('Job analysis error:', error)
    }

    setLoading(false)
  }

  const handleAddMissing = () => {
    if (analysis?.missing && onAddKeywords) {
      onAddKeywords(analysis.missing)
    }
  }

  return (
    <div className="border border-stone-200 rounded-lg bg-white overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-stone-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="font-medium text-stone-800">Match to Job Description</span>
        </div>
        <svg
          className={`w-5 h-5 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-3">
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            className="w-full h-32 p-3 text-sm border border-stone-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />

          <button
            onClick={analyzeJob}
            disabled={loading || !jobDescription.trim()}
            className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Analyzing...' : 'Analyze Keywords'}
          </button>

          {analysis && (
            <div className="space-y-3 pt-2">
              {/* Match Score */}
              <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                <span className="text-sm font-medium text-stone-700">Keyword Match</span>
                <span className={`text-lg font-bold ${
                  analysis.matchPercent >= 70 ? 'text-emerald-500' :
                  analysis.matchPercent >= 40 ? 'text-amber-500' : 'text-red-500'
                }`}>
                  {analysis.matchPercent}%
                </span>
              </div>

              {/* Matched Keywords */}
              {analysis.matched.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
                    Found in your resume ({analysis.matched.length})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {analysis.matched.map((kw, i) => (
                      <span key={i} className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Keywords */}
              {analysis.missing.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
                    Missing ({analysis.missing.length})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {analysis.missing.map((kw, i) => (
                      <span key={i} className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                        {kw}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={handleAddMissing}
                    className="mt-3 w-full py-2 px-4 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-200 transition-colors"
                  >
                    Help me add missing keywords
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default JobMatcher

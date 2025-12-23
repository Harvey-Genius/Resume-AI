import { useState, useEffect } from 'react'

/**
 * ATS Score indicator component - shows real-time ATS compatibility
 * @param {Object} props
 * @param {string} props.documentContent - Current resume content
 * @returns {JSX.Element}
 */
function ATSScore({ documentContent }) {
  const [score, setScore] = useState(0)
  const [issues, setIssues] = useState([])
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const result = calculateATSScore(documentContent)
    setScore(result.score)
    setIssues(result.issues)
  }, [documentContent])

  const calculateATSScore = (content) => {
    if (!content || !content.trim()) {
      return { score: 0, issues: [{ type: 'empty', text: 'Add content to your resume', priority: 'high' }] }
    }

    let score = 100
    const issues = []
    const wordCount = content.split(/\s+/).filter(w => w.length > 0).length

    // Section checks
    const hasSummary = /summary|profile|objective/i.test(content)
    const hasExperience = /experience|work history|employment/i.test(content)
    const hasSkills = /skills|technical skills|core competencies/i.test(content)
    const hasEducation = /education|academic/i.test(content)

    if (!hasSummary) {
      score -= 10
      issues.push({ type: 'section', text: 'Add a professional summary', priority: 'high' })
    }
    if (!hasExperience) {
      score -= 20
      issues.push({ type: 'section', text: 'Add work experience section', priority: 'high' })
    }
    if (!hasSkills) {
      score -= 10
      issues.push({ type: 'section', text: 'Add a skills section', priority: 'medium' })
    }
    if (!hasEducation) {
      score -= 5
      issues.push({ type: 'section', text: 'Add education section', priority: 'low' })
    }

    // Length checks
    if (wordCount < 150) {
      score -= 15
      issues.push({ type: 'length', text: 'Resume is too short (aim for 400-700 words)', priority: 'high' })
    } else if (wordCount < 300) {
      score -= 5
      issues.push({ type: 'length', text: 'Consider adding more detail', priority: 'medium' })
    } else if (wordCount > 1000) {
      score -= 10
      issues.push({ type: 'length', text: 'Resume may be too long (aim for 1-2 pages)', priority: 'medium' })
    }

    // Quantified achievements
    const hasMetrics = /\d+%|\$[\d,]+|\d+\+?\s*(years|months|clients|customers|users|projects|team|people|members)/i.test(content)
    if (!hasMetrics) {
      score -= 15
      issues.push({ type: 'content', text: 'Add quantified achievements (%, $, numbers)', priority: 'high' })
    }

    // Action verbs check
    const actionVerbs = /\b(led|managed|developed|created|built|increased|decreased|improved|designed|implemented|launched|achieved|delivered|generated|reduced|streamlined|coordinated|established|negotiated|trained|mentored)\b/i
    if (!actionVerbs.test(content)) {
      score -= 10
      issues.push({ type: 'content', text: 'Use strong action verbs (Led, Built, Increased, etc.)', priority: 'medium' })
    }

    // Contact info
    const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(content)
    const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(content)
    if (!hasEmail) {
      score -= 5
      issues.push({ type: 'contact', text: 'Add email address', priority: 'high' })
    }
    if (!hasPhone) {
      score -= 5
      issues.push({ type: 'contact', text: 'Add phone number', priority: 'medium' })
    }

    // ATS formatting issues
    const hasSpecialChars = /[│┃┆┇┊┋╎╏║▎▏]/.test(content)
    if (hasSpecialChars) {
      score -= 10
      issues.push({ type: 'format', text: 'Remove special characters (may confuse ATS)', priority: 'high' })
    }

    return { score: Math.max(0, Math.min(100, score)), issues }
  }

  const getScoreColor = () => {
    if (score >= 80) return 'text-emerald-500'
    if (score >= 60) return 'text-amber-500'
    return 'text-red-500'
  }

  const getPriorityColor = (priority) => {
    if (priority === 'high') return 'text-red-600 bg-red-50'
    if (priority === 'medium') return 'text-amber-600 bg-amber-50'
    return 'text-stone-600 bg-stone-50'
  }

  return (
    <div className="border border-stone-200 rounded-lg bg-white overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-stone-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="#e5e7eb"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${(score / 100) * 125.6} 125.6`}
                className={getScoreColor()}
              />
            </svg>
            <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${getScoreColor()}`}>
              {score}
            </span>
          </div>
          <div className="text-left">
            <div className="font-medium text-stone-800">ATS Score</div>
            <div className="text-xs text-stone-500">
              {score >= 80 ? 'Looking good!' : score >= 60 ? 'Needs improvement' : 'Needs work'}
            </div>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-stone-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && issues.length > 0 && (
        <div className="px-4 pb-4 space-y-2">
          <div className="text-xs font-medium text-stone-500 uppercase tracking-wide">Suggestions</div>
          {issues.map((issue, i) => (
            <div
              key={i}
              className={`text-sm px-3 py-2 rounded-lg ${getPriorityColor(issue.priority)}`}
            >
              {issue.text}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ATSScore

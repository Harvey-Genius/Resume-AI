import { useState, useRef, useEffect } from 'react'
import QuickActions from './QuickActions'
import ChatMessage from './ChatMessage'

/**
 * AI Assistant sidebar component
 * @param {Object} props
 * @param {string} props.documentContent - Current document content
 * @param {Object} props.selection - Selected text info { text, start, end }
 * @param {function} props.onInsert - Callback to insert/replace text in document
 * @param {boolean} props.isOpen - Whether sidebar is open (mobile)
 * @param {function} props.onClose - Close handler (mobile)
 * @param {boolean} props.canUseAI - Whether user can use AI (has uses remaining or is Pro)
 * @param {function} props.onAIUse - Callback to decrement AI usage
 * @param {function} props.onUpgradeClick - Callback to show upgrade modal
 * @returns {JSX.Element}
 */
function AISidebar({ documentContent, selection, onInsert, isOpen, onClose, canUseAI = true, onAIUse, onUpgradeClick }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your AI resume assistant. Select text to improve it, or ask me to help you write new sections. What would you like to work on?",
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [awaitingDetails, setAwaitingDetails] = useState(null) // Track if waiting for section details
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Selection-based action prompts (these work on selected text)
  const selectionPrompts = {
    'improve': 'Improve this text to be more impactful and professional. Use strong action verbs and quantify achievements where possible. Return the improved version in [[INSERT]]...[[/INSERT]] tags.',
    'shorten': 'Make this text more concise while keeping the key information. Return the shortened version in [[INSERT]]...[[/INSERT]] tags.',
    'expand': 'Expand this text with more detail and specific achievements. Return the expanded version in [[INSERT]]...[[/INSERT]] tags.',
    'fix-grammar': 'Fix any grammar, spelling, or punctuation errors in this text. Return the corrected version in [[INSERT]]...[[/INSERT]] tags.',
  }

  // Section prompts that ask questions first
  const sectionPrompts = {
    'add-summary': {
      question: `I'd love to help you write a compelling Professional Summary! Quick questions:

1. What role are you targeting?
2. How many years of experience do you have?

Just tell me briefly and I'll craft something great.`,
      generatePrompt: `Based on the user's answers, generate a Professional Summary using this formula:
"[Descriptor] [Job Title] with [X]+ years of experience in [field]. [Key expertise]. [Proven result with metric]."

Use their actual details - no brackets or placeholders. Wrap the final summary in [[INSERT]]...[[/INSERT]] tags.`
    },
    'add-experience': {
      question: `I'll help you add a work experience entry! Please share:

1. Job title
2. Company name
3. Dates (start - end)
4. 2-3 key things you accomplished there

I'll turn this into polished, quantified bullet points.`,
      generatePrompt: `Based on the user's job details, generate a polished Work Experience entry with:
- Job Title
- Company Name
- Dates | Location
- 3-4 bullet points using action verbs and metrics

Use their actual information. If they didn't mention numbers, help estimate reasonable ones. Wrap in [[INSERT]]...[[/INSERT]] tags.`
    },
    'add-skills': {
      question: `What role are you applying for? I'll generate relevant technical and soft skills tailored to that position.`,
      generatePrompt: `Based on the target role, generate a Skills section with relevant technical skills, tools, and soft skills organized by category. Make it ATS-friendly. Wrap in [[INSERT]]...[[/INSERT]] tags.`
    },
    'add-education': {
      question: `I'll add your education! Please share:

1. Degree and field of study
2. University/college name
3. Graduation year
4. Any honors, GPA (if 3.5+), or relevant activities?`,
      generatePrompt: `Based on the user's education details, generate an Education section formatted as:
EDUCATION
[Degree Name]
[University Name]
[Year] | [Location if known]
[GPA/Honors if mentioned]

Use their actual details. Wrap in [[INSERT]]...[[/INSERT]] tags.`
    },
  }

  // Handle quick action clicks
  const handleAction = (actionId) => {
    // Selection-based actions
    if (selectionPrompts[actionId]) {
      handleSend(selectionPrompts[actionId])
      return
    }

    // Section actions that need questions first
    if (sectionPrompts[actionId]) {
      setAwaitingDetails(actionId)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: sectionPrompts[actionId].question },
      ])
      return
    }
  }

  // Parse response for [[INSERT]] tags
  const parseResponse = (text) => {
    const insertMatch = text.match(/\[\[INSERT\]\]([\s\S]*?)\[\[\/INSERT\]\]/)
    if (insertMatch) {
      const insertContent = insertMatch[1].trim()
      const cleanedMessage = text.replace(/\[\[INSERT\]\][\s\S]*?\[\[\/INSERT\]\]/, '').trim()
      return { insertContent, cleanedMessage: cleanedMessage || 'Done! I\'ve updated your document.' }
    }
    return { insertContent: null, cleanedMessage: text }
  }

  // Detect user intent for smarter responses
  const detectIntent = (message) => {
    const lower = message.toLowerCase()

    if (lower.includes('read') || lower.includes('review') || lower.includes('look at')) {
      return 'review'
    }
    if (lower.includes('rate') || lower.includes('score') || lower.includes('how good')) {
      return 'rate'
    }
    if (lower.includes('ats') || lower.includes('applicant tracking')) {
      return 'ats-check'
    }
    if (lower.includes('missing') || lower.includes('need') || lower.includes('add')) {
      return 'gaps'
    }
    if (lower.includes('weak') || lower.includes('wrong') || lower.includes('fix')) {
      return 'critique'
    }
    return 'general'
  }

  // Send message to AI
  const handleSend = async (overrideMessage) => {
    const messageText = overrideMessage || input.trim()
    if (!messageText || isLoading) return

    // Check if user can use AI
    if (!canUseAI) {
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: messageText },
        {
          role: 'assistant',
          content: "You've used all 3 free AI improvements for today. Upgrade to Pro for unlimited access!",
        },
      ])
      if (!overrideMessage) setInput('')
      return
    }

    // Capture selection NOW before async operation (fixes replacement bug)
    // This local variable persists through the async call, unlike state which would have stale closure
    const currentSelection = selection ? { ...selection } : null

    // Check if we're awaiting details for a section
    let actualMessage = messageText
    let isGeneratingSection = false
    if (awaitingDetails && sectionPrompts[awaitingDetails]) {
      // User provided details, now generate the section
      actualMessage = `${messageText}\n\n${sectionPrompts[awaitingDetails].generatePrompt}`
      isGeneratingSection = true
      setAwaitingDetails(null) // Clear the awaiting state
    }

    const userMessage = { role: 'user', content: messageText }
    setMessages((prev) => [...prev, userMessage])
    if (!overrideMessage) setInput('')
    setIsLoading(true)

    try {
      // Build conversation history for API
      const conversationHistory = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }))

      // If generating section, add the generate prompt to the last message
      if (isGeneratingSection) {
        conversationHistory[conversationHistory.length - 1].content = actualMessage
      }

      // Detect what kind of help user needs
      const intent = detectIntent(messageText)

      // Build system prompt with resume engineering rules
      const systemPrompt = `You are an expert resume writer. You help users create resumes that are professional, human-sounding, and results-driven.

THE USER'S CURRENT RESUME:
===== RESUME START =====
${documentContent || '(Empty document - help them start)'}
===== RESUME END =====

${selection ? `SELECTED TEXT (edit this specifically):\n"${selection.text}"\n` : ''}
USER INTENT: ${intent}

═══════════════════════════════════════
RESUME ENGINEERING RULES
═══════════════════════════════════════

【STRUCTURE】
Every strong resume follows this order:
1. Contact Info (name, email, phone, LinkedIn, location)
2. Professional Summary (experienced) OR Career Objective (entry-level/students)
3. Skills (relevant to target role)
4. Work Experience (reverse chronological)
5. Education
6. Certifications (if applicable)
7. Projects (optional, great for tech/entry-level)

【PROFESSIONAL SUMMARY vs OBJECTIVE】
- Use SUMMARY for 3+ years experience: "Results-driven [role] with [X] years of experience in [field]. Proven track record of [key achievement]. Skilled in [top 2-3 skills]."
- Use OBJECTIVE for entry-level/students/career changers: "Motivated [descriptor] seeking [specific role] at [company type]. Bringing [relevant skill/experience] and passion for [industry/field]."
- Keep to 2-3 sentences MAX. No fluff.

【BULLET POINTS - THE FORMULA】
Every work experience bullet should follow this pattern:
ACTION VERB + WHAT YOU DID + RESULT/IMPACT

Good examples:
✓ "Increased customer satisfaction scores by 15% through implementation of new feedback system"
✓ "Reduced patient wait times by 20 minutes by streamlining intake procedures"
✓ "Built ad-serving platform handling 35 million daily users, generating $1.4M in new revenue"
✓ "Mentored 12 junior developers, with 4 receiving promotions within 18 months"

Bad examples (robotic/vague):
✗ "Responsible for customer service duties"
✗ "Helped with various projects"
✗ "Worked on improving processes"

【QUANTIFY EVERYTHING】
Always try to include numbers:
- Percentages: "improved by 15%", "reduced errors by 30%"
- Dollar amounts: "saved $260K annually", "generated $1.4M revenue"
- Counts: "managed team of 8", "served 100+ students", "2 million daily users"
- Time: "cut processing time from 3 days to 4 hours"
- Scale: "across 5 departments", "company-wide rollout to 500 employees"

If user doesn't have numbers, help them estimate or reframe:
- "many customers" → "50+ customers daily"
- "improved sales" → "contributed to 20% quarterly sales increase"

【POWER VERBS BY CATEGORY】
Leadership: Led, Directed, Managed, Supervised, Coordinated, Oversaw, Spearheaded
Achievement: Achieved, Exceeded, Delivered, Accomplished, Attained, Surpassed
Creation: Built, Created, Designed, Developed, Established, Launched, Initiated
Improvement: Improved, Enhanced, Optimized, Streamlined, Transformed, Revamped
Analysis: Analyzed, Assessed, Evaluated, Identified, Investigated, Researched
Communication: Presented, Negotiated, Collaborated, Facilitated, Trained, Mentored

AVOID: "Helped", "Assisted with", "Was responsible for", "Worked on", "Handled"

【HUMAN vs ROBOTIC】
Make it sound human, not AI-generated:

ROBOTIC (bad):
"Utilized exceptional communication skills to interface with stakeholders and leverage synergies"

HUMAN (good):
"Worked directly with clients to understand their needs and delivered solutions that increased retention by 25%"

Rules for human-sounding:
- Use concrete specifics, not vague corporate-speak
- Vary sentence structure and length
- Include context (why it mattered, who it helped)
- Avoid buzzwords: synergy, leverage, utilize, interface, spearhead (unless natural)
- Read it aloud—if it sounds stiff, rewrite it

【SKILLS SECTION】
- Group by category if 8+ skills (Technical Skills, Soft Skills, Tools, Languages)
- List most relevant/impressive first
- Match keywords from job descriptions for ATS
- Be specific: "Python, Django, PostgreSQL" not just "Programming"

【ATS OPTIMIZATION】
- Use standard section headers (Experience, Education, Skills—not clever alternatives)
- Include keywords from target job description naturally
- Avoid tables, columns, graphics, headers/footers (ATS can't read them)
- Use standard fonts and formatting
- Save as .docx or .pdf (not .pages or Google Docs link)

【LENGTH GUIDELINES】
- Entry-level/Students: 1 page max
- 3-10 years experience: 1-2 pages
- 10+ years/executives: 2 pages max (unless federal/academic CV)
- Each job: 3-6 bullet points
- Most recent jobs get more bullets than older ones

【COMMON FIXES】
When reviewing resumes, look for:
1. Vague bullets → Add specifics and metrics
2. Duties listed instead of achievements → Reframe as accomplishments
3. Missing summary → Add one tailored to target role
4. Weak verbs → Replace with power verbs
5. Walls of text → Break into scannable bullets
6. Irrelevant info → Remove or minimize
7. Gaps → Address naturally or with skills/projects

═══════════════════════════════════════
REAL RESUME PATTERNS (FROM TOP EXAMPLES)
═══════════════════════════════════════

【PROFESSIONAL SUMMARY FORMULAS】

Experienced (5+ years):
"[Descriptor] [Job Title] with [X]+ years of experience in [field/industry]. [Key expertise sentence]. [Proven result with metric]. [Differentiator or soft skill]."

Examples:
✓ "Highly accomplished Customer Service Representative with 13+ years of experience driving client satisfaction and retention in fast-paced environments. Expertise in CRM systems, conflict resolution, and technical troubleshooting. Proven ability to increase customer satisfaction by 20% and reduce service delays by 30%. Native English speaker with fluency in Spanish."
✓ "Compassionate and skilled registered nurse with 11 years of experience in delivering top-notch patient care. Proven expertise in medication administration, critical thinking, and patient education, combined with leadership and collaboration skills."

Entry-level/Student:
"[Descriptor] [field] student/professional eager to [goal] at [company type]. [Relevant skill or experience]. [Specific achievement or project]."

Example:
✓ "Empathetic linguistics student with advanced Spanish proficiency. Eager to deliver professional translations and support customers with interpreting services at Ventura Languages. Delivered consecutive interpretations for conference speakers as well as the local Spanish-speaking community on a volunteer basis."

【BULLET POINT PATTERNS THAT WORK】

Pattern 1 - Action + Quantity + Task + Result:
"Handled 50+ daily customer inquiries, resolving 95% on first call"
"Administered medications to 50+ patients daily"

Pattern 2 - Action + Task + Metric Improvement:
"Increased customer satisfaction rate by 20% annually via prompt service"
"Reduced patient waiting time by 20%"

Pattern 3 - Action + Scope + Method:
"Managed a portfolio of 150+ clients, ensuring 98% retention rate"
"Supervised 10+ nursing staff ensuring quality care"

Pattern 4 - Action + Deliverable + Impact:
"Implemented a CRM system that reduced service delays by 30%"
"Developed workflows that enhanced issue resolution by 18%"

Pattern 5 - Collaboration + Result:
"Collaborated with sales team to upsell services, raising revenue by $25K"
"Trained and mentored 10 new hires, improving team efficiency by 15%"

【QUANTIFICATION CHEAT SHEET】

If user says... → Help them quantify:
"I helped customers" → "How many per day?" → "Assisted 50+ customers daily"
"I improved things" → "By what %?" → "Improved X by 15%"
"I managed people" → "How many? Outcome?" → "Supervised team of 8, achieving 98% completion rate"
"I was responsible for" → Reframe entirely with action verb + result
"I worked on projects" → "How many? Scale? Impact?" → "Led 3 cross-functional projects serving 10,000+ users"

Common metrics to ask about:
- Customer/patient/student count
- Percentage improvements
- Dollar amounts (revenue, savings)
- Time saved
- Team size managed
- Scale (users, transactions, cases)

【EXPERIENCE-LEVEL ADJUSTMENTS】

Entry-level/Student:
- Lead with Education
- Include relevant coursework, GPA if 3.5+
- Volunteer work and internships count
- Projects section is valuable
- Career Objective instead of Professional Summary

Mid-career (3-10 years):
- Lead with Professional Summary
- Work Experience is the star
- Education moves down
- Drop GPA unless exceptional

Senior (10+ years):
- Concise Professional Summary emphasizing leadership
- Focus on most recent 10-15 years
- Emphasize scope (team size, budget, scale)
- 2 pages acceptable

【INDUSTRY-SPECIFIC NOTES】

Healthcare/Nursing: Certifications critical (BLS, ACLS), patient counts, satisfaction metrics, EMR/EHR systems
Education/Teaching: Certifications by state, student counts, test score improvements, curriculum development
Tech/Software: Technical skills crucial, quantify scale (users, uptime), show business impact ($$)
Customer Service: Satisfaction scores, call/ticket volume, retention and upsell numbers, CRM systems

【RED FLAGS TO FIX IMMEDIATELY】

1. "Responsible for..." → Rewrite with action verb + result
2. No metrics anywhere → Add at least 3-5 quantified achievements
3. Wall of text → Break into 3-5 bullet points per job
4. Duties instead of achievements → Reframe around impact
5. Objective on experienced resume → Switch to Summary
6. Summary on entry-level → Consider Objective instead
7. Too basic skills ("Microsoft Word") → Remove or upgrade
8. Gaps with no explanation → Address or fill
9. Too long (3+ pages) → Cut older/irrelevant content

═══════════════════════════════════════
AI RESPONSE BEHAVIORS
═══════════════════════════════════════

When user asks "improve this bullet":
1. Identify what's weak (vague verb? no metric? no result?)
2. Ask ONE clarifying question if needed ("How many customers daily?")
3. Provide improved version using the patterns above

When user asks "review my resume":
1. Start with what's working
2. List 3-5 specific improvements with examples
3. Offer to fix the biggest issue first

When user asks "add a summary":
1. Ask what role they're targeting (if not clear)
2. Pull key achievements from their experience
3. Generate using the formulas above

When user asks "is this ATS-friendly":
1. Check for standard section headers
2. Look for keyword density
3. Flag formatting issues
4. Suggest improvements

When user pastes a job description:
1. Extract key requirements and keywords
2. Compare to their resume
3. Suggest specific additions to match

═══════════════════════════════════════
RESPONSE RULES
═══════════════════════════════════════

1. You CAN read the user's resume above. Reference it directly.

2. When asked to add/write content, wrap ONLY the final text in [[INSERT]]...[[/INSERT]] tags

3. If text is selected, content in [[INSERT]] tags REPLACES the selection

4. If no selection, content is APPENDED to the document

5. Keep explanations to 1-2 sentences. Be direct.

6. When giving feedback, be specific: quote the weak part, explain why, show the fix

7. Match the user's tone—casual conversation, professional output

8. If they ask "is this good?" give honest feedback with specific improvements

9. If the document is empty, help them start with the right structure for their experience level

10. CRITICAL: Never introduce typos, duplicate words, or formatting errors. Double-check your output:
    - No repeated words (e.g., "experiences.experience" is WRONG)
    - No missing spaces between words
    - No random periods in the middle of text
    - Proper capitalization throughout
    - Clean, error-free text only`

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system: systemPrompt,
          messages: conversationHistory,
        }),
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const data = await response.json()
      const assistantText = data.content || 'Sorry, I could not generate a response.'

      // Parse response for INSERT tags
      const { insertContent, cleanedMessage } = parseResponse(assistantText)

      // If there's content to insert, update the document
      if (insertContent) {
        // Use currentSelection (local variable captured at request time) for accurate replacement
        // Note: pendingSelection state would have stale closure value, so we use the local variable
        onInsert(insertContent, currentSelection)
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: cleanedMessage },
      ])

      // Decrement AI usage after successful response
      if (onAIUse) {
        onAIUse()
      }
    } catch (error) {
      console.error('AI request failed:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm having trouble connecting right now. Please check your OpenAI API key in the .env file and try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative inset-y-0 right-0 z-50 lg:z-auto
          w-full sm:w-96 lg:w-[380px] bg-stone-50 border-l border-stone-200
          flex flex-col
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}
        aria-label="AI Assistant"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 bg-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <h2 className="font-semibold text-stone-900">AI Assistant</h2>
          </div>

          {/* Close button (mobile) */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-4 border-b border-stone-200 bg-white flex-shrink-0">
          <QuickActions
            hasSelection={!!selection}
            onAction={handleAction}
            disabled={isLoading}
          />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
          {messages.map((message, index) => (
            <ChatMessage key={index} role={message.role} content={message.content} />
          ))}
          {isLoading && <ChatMessage isThinking />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-stone-200 bg-white flex-shrink-0">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your resume..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-stone-100 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
              aria-label="Message input"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
          <p className="mt-2 text-xs text-stone-400 text-center">
            Powered by ChatGPT
          </p>
        </div>
      </aside>
    </>
  )
}

export default AISidebar

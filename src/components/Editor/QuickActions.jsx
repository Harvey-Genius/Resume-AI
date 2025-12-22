/**
 * Quick action buttons for common AI operations
 * @param {Object} props
 * @param {boolean} props.hasSelection - Whether text is selected in the editor
 * @param {function} props.onAction - Callback when an action is clicked
 * @param {boolean} props.disabled - Whether all actions should be disabled
 * @returns {JSX.Element}
 */
function QuickActions({ hasSelection, onAction, disabled }) {
  const selectionActions = [
    {
      id: 'improve',
      label: 'Improve',
      tooltip: 'Make the selected text more impactful',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      ),
    },
    {
      id: 'shorten',
      label: 'Shorten',
      tooltip: 'Make the selected text more concise',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
      ),
    },
    {
      id: 'expand',
      label: 'Expand',
      tooltip: 'Add more detail to the selected text',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
      ),
    },
    {
      id: 'fix-grammar',
      label: 'Fix Grammar',
      tooltip: 'Correct grammar and spelling errors',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      ),
    },
  ]

  const templateActions = [
    {
      id: 'add-summary',
      label: '+ Summary',
      tooltip: 'Generate a professional summary section',
    },
    {
      id: 'add-experience',
      label: '+ Experience',
      tooltip: 'Add a new work experience entry',
    },
    {
      id: 'add-skills',
      label: '+ Skills',
      tooltip: 'Generate a skills section',
    },
    {
      id: 'add-education',
      label: '+ Education',
      tooltip: 'Add an education entry',
    },
  ]

  return (
    <div className="space-y-4">
      {/* Selection-required actions */}
      <div>
        <div className="text-xs font-medium text-stone-500 mb-2 flex items-center gap-1">
          Edit Selection
          {!hasSelection && (
            <span className="text-stone-400">(select text first)</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {selectionActions.map((action) => (
            <button
              key={action.id}
              onClick={() => onAction(action.id)}
              disabled={disabled || !hasSelection}
              className="quick-action-btn flex items-center gap-1.5"
              title={action.tooltip}
              aria-label={action.tooltip}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                {action.icon}
              </svg>
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Template actions - always available */}
      <div>
        <div className="text-xs font-medium text-stone-500 mb-2">
          Add Section
        </div>
        <div className="flex flex-wrap gap-2">
          {templateActions.map((action) => (
            <button
              key={action.id}
              onClick={() => onAction(action.id)}
              disabled={disabled}
              className="quick-action-btn quick-action-btn-template"
              title={action.tooltip}
              aria-label={action.tooltip}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default QuickActions

/**
 * Individual chat message component
 * @param {Object} props
 * @param {'user' | 'assistant'} props.role - Message sender role
 * @param {string} props.content - Message content
 * @param {boolean} props.isThinking - Whether to show thinking animation
 * @returns {JSX.Element}
 */
function ChatMessage({ role, content, isThinking }) {
  if (isThinking) {
    return (
      <div className="chat-message chat-message-assistant" aria-live="polite" aria-label="AI is thinking">
        <div className="flex items-center gap-1">
          <span className="thinking-dot" />
          <span className="thinking-dot" />
          <span className="thinking-dot" />
          <span className="ml-2 text-sm text-stone-500">Thinking...</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`chat-message ${
        role === 'user' ? 'chat-message-user' : 'chat-message-assistant'
      }`}
      role="article"
      aria-label={`${role === 'user' ? 'Your' : 'AI'} message`}
    >
      <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
  )
}

export default ChatMessage

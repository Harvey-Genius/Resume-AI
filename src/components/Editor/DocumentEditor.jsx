import { useState, useRef, useEffect, useCallback } from 'react'
import html2pdf from 'html2pdf.js'
import { Document, Packer, Paragraph, TextRun } from 'docx'
import { saveAs } from 'file-saver'

/**
 * Main document editor component
 * @param {Object} props
 * @param {string} props.content - Document content
 * @param {function} props.setContent - Content setter
 * @param {Object} props.selection - Selected text info { text, start, end }
 * @param {function} props.setSelection - Selection setter
 * @param {string} props.title - Document title
 * @param {function} props.setTitle - Title setter
 * @returns {JSX.Element}
 */
function DocumentEditor({ content, setContent, selection, setSelection, title, setTitle }) {
  const textareaRef = useRef(null)
  const [showClearModal, setShowClearModal] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  // Handle text selection
  const handleSelect = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    if (start !== end) {
      const selectedText = content.slice(start, end)
      setSelection({ text: selectedText, start, end })
    } else {
      setSelection(null)
    }
  }, [content, setSelection])

  // Word count
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Export as TXT
  const exportTxt = () => {
    if (!content.trim()) return
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${title || 'resume'}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  // Export as PDF
  const exportPdf = () => {
    if (!content.trim()) return
    try {
      // Create a formatted div for PDF export
      const element = document.createElement('div')
      element.innerHTML = content
        .split('\n')
        .map(line => `<p style="margin: 0 0 8px 0; font-family: Georgia, serif; font-size: 11pt; line-height: 1.4;">${line || '&nbsp;'}</p>`)
        .join('')
      element.style.padding = '40px'

      const opt = {
        margin: 0.5,
        filename: `${title || 'resume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      }

      html2pdf().set(opt).from(element).save()
    } catch (error) {
      // Fallback: use browser print dialog
      console.error('PDF export failed, using print fallback:', error)
      const printWindow = window.open('', '_blank')
      printWindow.document.write(`
        <html>
          <head>
            <title>${title || 'Resume'}</title>
            <style>
              body {
                font-family: Georgia, serif;
                max-width: 8.5in;
                margin: 0.5in auto;
                line-height: 1.6;
                white-space: pre-wrap;
              }
            </style>
          </head>
          <body>${content.replace(/\n/g, '<br>')}</body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  // Export as DOCX
  const exportDocx = async () => {
    if (!content.trim()) return
    try {
      const paragraphs = content.split('\n').map(line =>
        new Paragraph({
          children: [new TextRun({ text: line, font: 'Calibri', size: 24 })]
        })
      )

      const doc = new Document({
        sections: [{
          properties: {},
          children: paragraphs
        }]
      })

      const blob = await Packer.toBlob(doc)
      saveAs(blob, `${title || 'resume'}.docx`)
    } catch (error) {
      console.error('DOCX export failed:', error)
      // Fallback to TXT if DOCX fails
      exportTxt()
    }
  }

  // Clear document
  const handleClear = () => {
    setContent('')
    setSelection(null)
    setShowClearModal(false)
  }

  // Keep selection in sync
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.addEventListener('select', handleSelect)
    textarea.addEventListener('mouseup', handleSelect)
    textarea.addEventListener('keyup', handleSelect)

    return () => {
      textarea.removeEventListener('select', handleSelect)
      textarea.removeEventListener('mouseup', handleSelect)
      textarea.removeEventListener('keyup', handleSelect)
    }
  }, [handleSelect])

  return (
    <div className="flex flex-col h-full">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 bg-stone-50 flex-shrink-0">
        <div className="flex items-center gap-4">
          {/* Editable title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold text-stone-900 bg-transparent border-none focus:outline-none focus:ring-0 w-48 sm:w-64"
            aria-label="Document title"
          />
          <span className="text-sm text-stone-500 hidden sm:inline">
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="p-2 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
            title="Copy to clipboard"
            aria-label="Copy to clipboard"
          >
            {copySuccess ? (
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
            )}
          </button>

          {/* Export dropdown */}
          <div className="relative group">
            <button
              className="p-2 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1"
              title="Export document"
              aria-label="Export document"
              aria-haspopup="true"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown menu - pt-2 creates hover bridge, -mt-1 overlaps with button */}
            <div className="absolute right-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <div className="bg-white rounded-lg shadow-lg border border-stone-200 py-1 min-w-[120px]">
              <button
                onClick={exportPdf}
                disabled={!content}
                className="w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Export as PDF
              </button>
              <button
                onClick={exportDocx}
                disabled={!content}
                className="w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Export as DOCX
              </button>
              <button
                onClick={exportTxt}
                disabled={!content}
                className="w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Export as TXT
              </button>
              </div>
            </div>
          </div>

          {/* Clear button */}
          <button
            onClick={() => content && setShowClearModal(true)}
            disabled={!content}
            className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Clear document"
            aria-label="Clear document"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      </div>

      {/* Selection indicator */}
      {selection && (
        <div className="px-4 py-2 bg-primary-50 border-b border-primary-100 flex-shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
            </svg>
            <span className="text-primary-700">
              Selected: "{selection.text.length > 50 ? selection.text.slice(0, 50) + '...' : selection.text}"
            </span>
          </div>
        </div>
      )}

      {/* Editor Area */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-stone-200 min-h-[500px]">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your resume or start typing...

You can:
• Highlight text and use AI to improve it
• Ask the AI to add sections like Summary, Experience, or Skills
• Get help with grammar, tone, and impact"
              className="w-full h-full min-h-[500px] p-6 sm:p-8 document-editor resize-none focus:outline-none"
              aria-label="Resume content editor"
            />
          </div>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowClearModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-modal-title"
        >
          <div
            className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="clear-modal-title" className="text-lg font-semibold text-stone-900 mb-2">
              Clear document?
            </h3>
            <p className="text-stone-600 text-sm mb-6">
              This will remove all content from your resume. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DocumentEditor

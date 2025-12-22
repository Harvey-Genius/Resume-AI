import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from './ui/Button'

/**
 * Pricing section with transparent tier comparison
 * @returns {JSX.Element}
 */
function PricingCard() {
  const [isYearly, setIsYearly] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeEmail, setUpgradeEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const navigate = useNavigate()

  const handleUpgradeSubmit = (e) => {
    e.preventDefault()
    if (upgradeEmail) {
      const emails = JSON.parse(localStorage.getItem('upgradeEmails') || '[]')
      emails.push({ email: upgradeEmail, date: new Date().toISOString() })
      localStorage.setItem('upgradeEmails', JSON.stringify(emails))
      setEmailSubmitted(true)
    }
  }

  const handleProClick = () => {
    setShowUpgradeModal(true)
  }

  const monthlyPrice = 12
  const yearlyPrice = 10 // per month, billed annually
  const currentPrice = isYearly ? yearlyPrice : monthlyPrice

  const plans = [
    {
      name: 'Free',
      price: 0,
      description: 'Perfect for getting started',
      features: [
        { text: 'Unlimited editing', included: true },
        { text: '3 AI improvements per day', included: true },
        { text: 'Export as .txt', included: true },
        { text: 'Basic templates', included: true },
      ],
      cta: 'Start Free',
      ctaVariant: 'outline',
      popular: false,
    },
    {
      name: 'Pro',
      price: currentPrice,
      description: 'For serious job seekers',
      features: [
        { text: 'Everything in Free', included: true },
        { text: 'Unlimited AI improvements', included: true },
        { text: 'Export as PDF & DOCX', included: true },
        { text: 'Priority support', included: true },
        { text: 'Advanced templates', included: true },
        { text: 'Cover letter generator', included: true },
      ],
      cta: 'Try Pro Free for 7 Days',
      ctaVariant: 'primary',
      popular: true,
    },
  ]

  return (
    <section id="pricing" className="py-16 sm:py-24">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-3 text-balance">
            Simple, Transparent Pricing
          </h2>
          <p className="text-stone-600 max-w-xl mx-auto">
            No hidden fees. No surprise charges. Cancel anytime.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <span className={`text-sm font-medium ${!isYearly ? 'text-stone-900' : 'text-stone-500'}`}>
            Monthly
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={isYearly}
            onClick={() => setIsYearly(!isYearly)}
            className="pricing-toggle"
            data-checked={isYearly}
          >
            <span className="sr-only">Toggle yearly billing</span>
            <span className="pricing-toggle-thumb" />
          </button>
          <span className={`text-sm font-medium ${isYearly ? 'text-stone-900' : 'text-stone-500'}`}>
            Yearly
          </span>
          {isYearly && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
              Save 2 months
            </span>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`
                relative rounded-2xl p-6 sm:p-8
                ${plan.popular
                  ? 'bg-stone-900 text-white ring-2 ring-stone-900'
                  : 'bg-white border border-stone-200'}
              `}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary-600 text-white text-xs font-medium">
                  Most Popular
                </span>
              )}

              <div className="mb-6">
                <h3 className={`text-lg font-semibold ${plan.popular ? 'text-white' : 'text-stone-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mt-1 ${plan.popular ? 'text-stone-400' : 'text-stone-600'}`}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-stone-900'}`}>
                  ${plan.price}
                </span>
                {plan.price > 0 && (
                  <span className={`text-sm ${plan.popular ? 'text-stone-400' : 'text-stone-600'}`}>
                    /month{isYearly ? ', billed yearly' : ''}
                  </span>
                )}
              </div>

              <ul className="space-y-3 mb-8" role="list">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg
                      className={`w-5 h-5 flex-shrink-0 ${
                        plan.popular ? 'text-emerald-400' : 'text-emerald-600'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className={`text-sm ${plan.popular ? 'text-stone-300' : 'text-stone-700'}`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {plan.popular ? (
                <Button
                  onClick={handleProClick}
                  variant="secondary"
                  className="w-full justify-center"
                >
                  {plan.cta}
                </Button>
              ) : (
                <Button
                  as={Link}
                  to="/editor"
                  variant="outline"
                  className="w-full justify-center"
                >
                  {plan.cta}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Money-back guarantee */}
        <p className="text-center mt-8 text-sm text-stone-500 flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          30-day money-back guarantee. No questions asked.
        </p>

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
                      navigate('/editor')
                    }}
                    className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Try Free Version Now
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default PricingCard

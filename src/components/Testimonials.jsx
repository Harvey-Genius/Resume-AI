/**
 * Testimonials section with social proof
 * @returns {JSX.Element}
 */
function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer',
      company: 'Hired at Stripe',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      text: "The AI actually understood what I was trying to say and made it sound more professional. Got 3x more callbacks after using this.",
      rating: 5,
    },
    {
      name: 'Marcus Johnson',
      role: 'Product Manager',
      company: 'Hired at Airbnb',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      text: "Finally, a resume tool that doesn't feel like it's from 2010. Clean interface, actually helpful AI suggestions.",
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Marketing Director',
      company: 'Hired at HubSpot',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      text: "I was skeptical about AI tools, but this one showed me exactly what it was doing. Transparent and effective.",
      rating: 5,
    },
  ]

  const companyLogos = [
    { name: 'Google', initial: 'G' },
    { name: 'Microsoft', initial: 'M' },
    { name: 'Amazon', initial: 'A' },
    { name: 'Meta', initial: 'M' },
    { name: 'Apple', initial: 'A' },
  ]

  return (
    <section className="py-16 sm:py-24 bg-stone-50">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-6 h-6 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-stone-900 font-semibold">
            4.8/5 from 2,400+ users
          </p>
          <p className="text-stone-600 text-sm mt-1">
            Join 10,000+ job seekers who landed their dream job
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <article
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-stone-100"
            >
              {/* Rating */}
              <div className="flex gap-0.5 mb-4" aria-label={`${testimonial.rating} out of 5 stars`}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-stone-700 text-sm leading-relaxed mb-4">
                "{testimonial.text}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <p className="font-medium text-stone-900 text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-stone-500 text-xs">
                    {testimonial.role} • {testimonial.company}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Company Logos */}
        <div className="text-center">
          <p className="text-sm text-stone-500 mb-4">
            Our users have been hired at
          </p>
          <div className="flex items-center justify-center gap-6 sm:gap-8 flex-wrap">
            {companyLogos.map((company, index) => (
              <div
                key={index}
                className="w-12 h-12 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-400 font-bold text-xl"
                title={company.name}
                aria-label={company.name}
              >
                {company.initial}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials

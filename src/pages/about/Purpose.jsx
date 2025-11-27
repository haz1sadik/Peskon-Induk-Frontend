import React from 'react'


const Purpose = () => {
  return (
    <section className="w-full py-5 md:py-16">
      <div className="lg:w-4xl md:w-[45rem] w-[20rem] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Title */}
        <h2 className="text-peskon-primary text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-10">
          Purpose of this website
        </h2>

        {/* Cards Container */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-9">

          {/* Card 1 */}
          <div className="flex-1 bg-peskon-accent rounded-3xl shadow-md px-9 py-8 sm:px-8 sm:py-10">
            <h3 className="text-peskon-primary text-xl sm:text-2xl font-semibold mb-4 text-center md:text-left">
              Information Hub
            </h3>
            <p className="text-peskon-primary text-sm sm:text-base leading-relaxed">
              The platform serves as the main information centre for PESKON UPM,
              providing visitors with updated details on activities, schedules,
              programmes, and event highlights.
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex-1 bg-peskon-accent rounded-3xl shadow-md px-9 py-8 sm:px-8 sm:py-10">
            <h3 className="text-peskon-primary text-xl sm:text-2xl font-semibold mb-4 text-center md:text-left">
              Digital Event Book
            </h3>
            <p className="text-peskon-primary text-sm sm:text-base leading-relaxed">
              The website also functions as a digital event book, offering a
              structured and accessible guide to all PESKON UPM activities for
              graduates, families, and the UPM community.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Purpose

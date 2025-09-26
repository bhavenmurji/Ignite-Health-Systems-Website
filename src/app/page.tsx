import InterestForm from '../components/InterestForm'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#36454F] via-[#2a363f] to-[#36454F] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-[#F5F5F5] mb-6">
              The Clinical Co-pilot for Independent Medicine
            </h1>
            <h2 className="text-2xl md:text-3xl text-[#00A8E8] mb-8">
              The system is broken. Your time is invaluable. Stop the busy-work and get back to healing.
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-5xl mx-auto mb-12 leading-relaxed">
              Healthcare technology has failed physicians. Instead of facilitating care, it has created a crisis of documentation, burnout, and fragmentation. Ignite Health Systems is the answer. We are a physician-founded company delivering a revolutionary AI co-pilot that unifies your workflow, eliminates 60% of administrative overhead, and restores the vital time needed for clinical thought and patient connection. This is not just a tool; it's the new architecture for independent medicine.
            </p>

            {/* Key Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-[#2a363f] p-6 rounded-lg">
                <div className="text-4xl font-bold text-[#00A8E8] mb-2">42.2%</div>
                <p className="text-gray-300">of physicians remain in private practice, a stark decline driven by administrative and financial pressures that make independence unsustainable.</p>
              </div>
              <div className="bg-[#2a363f] p-6 rounded-lg">
                <div className="text-4xl font-bold text-[#00A8E8] mb-2">15.4 hours/week</div>
                <p className="text-gray-300">is spent by the average physician on paperwork and administrative tasks, time stolen directly from patient care and personal well-being.</p>
              </div>
              <div className="bg-[#2a363f] p-6 rounded-lg">
                <div className="text-4xl font-bold text-[#00A8E8] mb-2">$100,000+</div>
                <p className="text-gray-300">in annual revenue per physician is lost to the inefficiencies of current EMRs and the documentation burden they create.</p>
              </div>
            </div>

            <a href="#join" className="bg-[#00A8E8] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors inline-block">
              Join the Innovation Council
            </a>
          </div>
        </div>
      </section>

      {/* The Crisis We Solve */}
      <section className="bg-[#2a363f] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-[#F5F5F5] text-center mb-8">
            The Great Unraveling of Private Practice
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-5xl mx-auto text-center leading-relaxed">
            The tools meant to serve you have become your greatest burden. Your focus is shattered across a half-dozen disconnected platforms: an EMR built for billing, a separate transcription AI, clinical guideline websites, research portals, and board prep software. This is the Platform Fragmentation Crisis, and it's forcing the most dedicated healers to become data entry clerks. The result? A system where only 42.2% of physicians remain independent, crushed by technology that serves large hospital systems, not the practitioner at the point of care.
          </p>
        </div>
      </section>

      {/* The Burnout Epidemic */}
      <section className="bg-[#36454F] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-[#F5F5F5] text-center mb-8">
            The Unseen Cost: A Global Burnout Epidemic
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-5xl mx-auto text-center mb-12 leading-relaxed">
            This system failure has a deeply human cost. The administrative burden is the primary driver of a chronic burnout crisis that plagues medicine globally, with the U.S. reporting some of the highest rates in the world. While the acute pressures of the pandemic have subsided, burnout has settled back to unsustainable pre-pandemic levels, proving this is a systemic issue, not a temporary event. This isn't just a statistic; it's a threat to the stability of our entire healthcare system. It's a crisis of moral injury and professional dissatisfaction driven by technology that obstructs, rather than enables, the practice of medicine.
          </p>

          {/* Burnout Statistics Table */}
          <div className="bg-[#2a363f] rounded-lg overflow-hidden max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-[#00A8E8] p-6 pb-4">U.S. Physician Burnout Rates</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#36454F]">
                  <tr>
                    <th className="px-6 py-4 text-left text-[#F5F5F5] font-semibold">Period</th>
                    <th className="px-6 py-4 text-left text-[#F5F5F5] font-semibold">Burnout Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-600">
                    <td className="px-6 py-4 text-gray-300">Pre-pandemic (2019)</td>
                    <td className="px-6 py-4 text-gray-300">~44%</td>
                  </tr>
                  <tr className="border-t border-gray-600">
                    <td className="px-6 py-4 text-gray-300">Pandemic Peak (2021)</td>
                    <td className="px-6 py-4 text-gray-300">62.8%</td>
                  </tr>
                  <tr className="border-t border-gray-600">
                    <td className="px-6 py-4 text-gray-300">Post-pandemic (2024)</td>
                    <td className="px-6 py-4 text-gray-300">~48%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Must Be Solved Now */}
      <section className="bg-[#2a363f] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-[#F5F5F5] text-center mb-16">
            Why This Must Be Solved Now
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-[#36454F] p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-[#00A8E8] mb-4">Fundamentally Flawed</h3>
              <p className="text-gray-300 leading-relaxed">
                Current EMRs, dominated by giants like Epic, are broken by design. Built on a document-centric foundation from a bygone era, they force you into a maze of clicks and templates. 67% of your time in the EMR is wasted on navigation, not clinical synthesis.
              </p>
            </div>
            <div className="bg-[#36454F] p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-[#00A8E8] mb-4">A Universal Crisis</h3>
              <p className="text-gray-300 leading-relaxed">
                This technological failure is universal. It's the primary driver behind physician burnout rates chronically hovering near 48%, creating a crisis that threatens the very foundation of patient care and trust in medicine.
              </p>
            </div>
            <div className="bg-[#36454F] p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-[#00A8E8] mb-4">An Accelerating Collapse</h3>
              <p className="text-gray-300 leading-relaxed">
                The administrative load is a key reason physicians are fleeing private practice for hospital employment. This consolidation of healthcare reduces patient choice and physician autonomy. The time for a viable alternative is now.
              </p>
            </div>
            <div className="bg-[#36454F] p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-[#00A8E8] mb-4">A Neglected Market</h3>
              <p className="text-gray-300 leading-relaxed">
                No one is building for the independent physician. Existing AI offers piecemeal solutions—transcription without intelligence, recommendations without integration. They don't solve the core workflow problem. The solo and DPC practitioner market is a massive, underserved segment desperate for a unified solution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Ignite Solution */}
      <section className="bg-[#36454F] py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#F5F5F5] mb-8">
            A Unified Intelligence Layer, Built for Clinical Excellence
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-5xl mx-auto mb-12 leading-relaxed">
            Ignite is not another app. It's an AI-native operating system for your practice, built on a revolutionary Mamba-based architecture that understands medicine. It is:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-[#2a363f] p-8 rounded-lg text-left">
              <h3 className="text-2xl font-bold text-[#00A8E8] mb-4">Chart-Aware</h3>
              <p className="text-gray-300">Instantly synthesizes a patient's entire longitudinal history, surfacing what's critical.</p>
            </div>
            <div className="bg-[#2a363f] p-8 rounded-lg text-left">
              <h3 className="text-2xl font-bold text-[#00A8E8] mb-4">Evidence-Integrated</h3>
              <p className="text-gray-300">Bakes clinical guidelines and research directly into your workflow, eliminating platform switching.</p>
            </div>
            <div className="bg-[#2a363f] p-8 rounded-lg text-left">
              <h3 className="text-2xl font-bold text-[#00A8E8] mb-4">A Lifelong Learning Partner</h3>
              <p className="text-gray-300">Transforms your daily cases into personalized, adaptive learning modules for continuous improvement.</p>
            </div>
            <div className="bg-[#2a363f] p-8 rounded-lg text-left">
              <h3 className="text-2xl font-bold text-[#00A8E8] mb-4">An Autonomous Administrative Agent</h3>
              <p className="text-gray-300">Handles scheduling, billing, and membership management, liberating you from back-office tasks.</p>
            </div>
          </div>

          <a href="/platform/" className="bg-[#00A8E8] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors inline-block">
            Explore the Platform
          </a>
        </div>
      </section>

      {/* Physician Testimonials */}
      <section className="bg-[#2a363f] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-[#F5F5F5] text-center mb-16">
            From the Front Lines of Medicine
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#36454F] p-8 rounded-lg">
              <p className="text-gray-300 mb-6 italic leading-relaxed">
                "Ignite is the only platform that understands that my biggest challenge isn't just documentation—it's the cognitive load of juggling five different systems. It gives me back my focus."
              </p>
              <div className="text-[#00A8E8] font-semibold">
                – Physician, Direct Primary Care
              </div>
            </div>
            <div className="bg-[#36454F] p-8 rounded-lg">
              <p className="text-gray-300 mb-6 italic leading-relaxed">
                "The idea of an AI that helps me with board prep based on the patients I actually saw this week... that's not just a time-saver, it makes me a fundamentally better doctor. It's a game-changer."
              </p>
              <div className="text-[#00A8E8] font-semibold">
                – Physician, Internal Medicine
              </div>
            </div>
            <div className="bg-[#36454F] p-8 rounded-lg">
              <p className="text-gray-300 mb-6 italic leading-relaxed">
                "We saw an immediate impact. Our physicians are finishing notes in real-time and our administrative overhead has been cut in half. We're a more sustainable practice because of Ignite."
              </p>
              <div className="text-[#00A8E8] font-semibold">
                – Clinic Director, Independent Practice
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="bg-[#36454F] py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#F5F5F5] mb-8">
            It's Time for a Reckoning
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-12 leading-relaxed">
            The future of medicine will be defined by those who refuse to accept broken systems. This is more than a product; it's a movement to restore autonomy to physicians and put humanity back at the center of healthcare.
          </p>
          <a href="#join" className="bg-[#00A8E8] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors inline-block">
            Join the Movement
          </a>
        </div>
      </section>

      {/* Interest Form */}
      <InterestForm />
    </>
  )
}
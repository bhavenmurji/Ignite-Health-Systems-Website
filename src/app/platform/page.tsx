import InterestForm from '../../components/InterestForm'

export default function PlatformPage() {
  return (
    <>
      {/* Dr. Murji Quote */}
      <section className="bg-gradient-to-br from-[#36454F] via-[#2a363f] to-[#36454F] py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <blockquote className="text-2xl md:text-3xl text-[#F5F5F5] mb-8 italic leading-relaxed">
            "My dream is Ignite—AI that eliminates the endless clicking between screens so I can be a supercharged human doctor. Instead of fragmenting my attention across multiple platforms, I get one unified intelligence layer that makes me brilliant at the bedside, not just busy at the computer."
          </blockquote>
          <cite className="text-xl text-[#00A8E8] font-semibold">
            – Dr. Bhaven Murji, Founder
          </cite>
        </div>
      </section>

      {/* From Document-Centric Past to AI-Native Future */}
      <section className="bg-[#2a363f] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-[#F5F5F5] text-center mb-8">
            From a Document-Centric Past to an AI-Native Future
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-5xl mx-auto text-center leading-relaxed">
            The fundamental problem with healthcare technology is that it was built on the wrong foundation. Today's EMRs are document-centric digital versions of paper charts, designed in the 1990s for billing and compliance. They are not, and have never been, tools for clinical thinking. This foundational flaw is the source of the clicks, the clutter, and the cognitive burnout every physician endures. Ignite is the clean slate: an AI-native platform built from the ground up to function as an extension of the physician's mind.
          </p>
        </div>
      </section>

      {/* Current AI Reality: The Maze of Fragmentation */}
      <section className="bg-[#36454F] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-[#F5F5F5] text-center mb-8">
            The "Current AI" Reality: The Maze of Fragmentation
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-5xl mx-auto text-center mb-16 leading-relaxed">
            Even with the latest AI scribes, your day is a constant, exhausting context-switch between disconnected systems:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#2a363f] p-8 rounded-lg border-l-4 border-red-500">
              <h3 className="text-xl font-bold text-red-400 mb-4">EMR (Epic/Cerner)</h3>
              <p className="text-gray-300">A digital filing cabinet where you spend 67% of your time just searching for information.</p>
            </div>
            <div className="bg-[#2a363f] p-8 rounded-lg border-l-4 border-red-500">
              <h3 className="text-xl font-bold text-red-400 mb-4">Transcription AI (DAX Copilot)</h3>
              <p className="text-gray-300">A "blind" listener that can't see chart data, forcing you to narrate lab results that are on the screen in front of you.</p>
            </div>
            <div className="bg-[#2a363f] p-8 rounded-lg border-l-4 border-red-500">
              <h3 className="text-xl font-bold text-red-400 mb-4">Clinical Guidelines (UpToDate)</h3>
              <p className="text-gray-300">A separate library requiring you to leave your workflow, search, and manually copy-paste recommendations.</p>
            </div>
            <div className="bg-[#2a363f] p-8 rounded-lg border-l-4 border-red-500">
              <h3 className="text-xl font-bold text-red-400 mb-4">Research Portals (PubMed/OpenEvidence)</h3>
              <p className="text-gray-300">Another disconnected silo for deeper investigation.</p>
            </div>
            <div className="bg-[#2a363f] p-8 rounded-lg border-l-4 border-red-500">
              <h3 className="text-xl font-bold text-red-400 mb-4">Board Prep (AAFP/UWorld)</h3>
              <p className="text-gray-300">A completely separate universe of study questions with zero connection to your actual clinical practice.</p>
            </div>
            <div className="bg-[#2a363f] p-8 rounded-lg border-l-4 border-red-500">
              <h3 className="text-xl font-bold text-red-400 mb-4">Practice Management</h3>
              <p className="text-gray-300">Yet another system for membership billing, scheduling, and patient onboarding, especially critical in DPC settings.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Ignite Future: A Unified Clinical OS */}
      <section className="bg-[#2a363f] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-[#F5F5F5] text-center mb-8">
            The Ignite Future: A Unified Clinical OS
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-5xl mx-auto text-center mb-16 leading-relaxed">
            Ignite replaces the maze with a single, unified intelligence layer—a true Clinical Operating System.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-[#36454F] p-8 rounded-lg border-l-4 border-[#00A8E8]">
              <h3 className="text-2xl font-bold text-[#00A8E8] mb-6">Intelligent Precharting</h3>
              <p className="text-gray-300 leading-relaxed">
                Ignite's multi-agent system analyzes your schedule and patient histories. It surfaces critical trends, highlights potential care gaps, and integrates the latest evidence before you see the patient.
              </p>
            </div>
            <div className="bg-[#36454F] p-8 rounded-lg border-l-4 border-[#00A8E8]">
              <h3 className="text-2xl font-bold text-[#00A8E8] mb-6">Supercharged Patient Care</h3>
              <p className="text-gray-300 leading-relaxed">
                Walk into the room fully present. Ignite listens to the ambient conversation while simultaneously accessing and reasoning over the full chart history, providing real-time clinical decision support.
              </p>
            </div>
            <div className="bg-[#36454F] p-8 rounded-lg border-l-4 border-[#00A8E8]">
              <h3 className="text-2xl font-bold text-[#00A8E8] mb-6">Autonomous Practice Management</h3>
              <p className="text-gray-300 leading-relaxed">
                For DPC and independent practices, Ignite automates membership management, renewals, patient onboarding, and billing.
              </p>
            </div>
            <div className="bg-[#36454F] p-8 rounded-lg border-l-4 border-[#00A8E8]">
              <h3 className="text-2xl font-bold text-[#00A8E8] mb-6">Integrated Lifelong Learning</h3>
              <p className="text-gray-300 leading-relaxed">
                Ignite transforms your practice into your study guide, analyzing your clinical decisions to generate personalized board-style questions and learning modules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Tangible Impact: Reclaiming Your Practice */}
      <section className="bg-[#36454F] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-[#F5F5F5] text-center mb-8">
            The Tangible Impact: Reclaiming Your Practice
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-5xl mx-auto text-center mb-16 leading-relaxed">
            This is a revolution in your workday, with a validated ROI of $3.20 for every $1 invested in AI.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[#2a363f] p-8 rounded-lg text-center">
              <div className="text-4xl font-bold text-[#00A8E8] mb-4">70+</div>
              <h3 className="text-xl font-bold text-[#F5F5F5] mb-2">Hours Per Month</h3>
              <p className="text-gray-300">Eradicate the "pajama time" spent on after-hours charting.</p>
            </div>
            <div className="bg-[#2a363f] p-8 rounded-lg text-center">
              <div className="text-4xl font-bold text-[#00A8E8] mb-4">15+</div>
              <h3 className="text-xl font-bold text-[#F5F5F5] mb-2">Minutes Per Encounter</h3>
              <p className="text-gray-300">Stop clicking and start thinking.</p>
            </div>
            <div className="bg-[#2a363f] p-8 rounded-lg text-center">
              <div className="text-4xl font-bold text-[#00A8E8] mb-4">90%</div>
              <h3 className="text-xl font-bold text-[#F5F5F5] mb-2">Documentation Time</h3>
              <p className="text-gray-300">Move from hours of evening work to real-time review.</p>
            </div>
            <div className="bg-[#2a363f] p-8 rounded-lg text-center">
              <div className="text-4xl font-bold text-[#00A8E8] mb-4">$3.20</div>
              <h3 className="text-xl font-bold text-[#F5F5F5] mb-2">ROI Per Dollar</h3>
              <p className="text-gray-300">Boost Clinical Excellence & Autonomy: Operate your independent practice with the efficiency and intelligence of a large health system.</p>
            </div>
          </div>

          <div className="text-center mt-16">
            <a href="#join" className="bg-[#00A8E8] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors inline-block">
              Join the Innovation Council
            </a>
          </div>
        </div>
      </section>

      {/* Interest Form */}
      <InterestForm />
    </>
  )
}
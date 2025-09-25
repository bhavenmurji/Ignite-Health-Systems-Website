import InterestForm from '../../components/InterestForm'

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-[#36454F] via-[#2a363f] to-[#36454F] py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[#F5F5F5] mb-8">
            A Mission Forged in the Crucible
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
            Dr. Bhaven Murji's quest to build Ignite Health Systems is not a business venture; it is a philosophical reckoning forged through profound personal struggle, frontline clinical experience across three continents, and an unwavering belief that technology must serve humanity.
          </p>
        </div>
      </section>

      {/* The Crucible Year */}
      <section className="bg-[#2a363f] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#F5F5F5] mb-8">
                The Crucible Year: Rebuilding from Nothing
              </h2>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                In 2021, his UK medical career path erased by the pandemic, Dr. Murji arrived in Philadelphia with nothing but a suitcase. In a single, grueling year, he passed all three USMLE licensing exams while simultaneously training for and completing Ironman Maryland. To pay his rent, he worked early morning shifts at Starbucks and sold government-subsidized phones on street corners.
              </p>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed mt-6">
                This period of intense hardship became his crucible, cementing a core philosophy: when systems fail, true character is revealed by the will to build something better.
              </p>
            </div>
            <div className="bg-[#36454F] p-8 rounded-lg border-l-4 border-[#00A8E8]">
              <h3 className="text-2xl font-bold text-[#00A8E8] mb-4">The Crucible Year Highlights</h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <span className="text-[#00A8E8] mr-3 mt-1">•</span>
                  <span>Passed all three USMLE exams in one year</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#00A8E8] mr-3 mt-1">•</span>
                  <span>Completed Ironman Maryland triathlon</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#00A8E8] mr-3 mt-1">•</span>
                  <span>Worked early morning shifts at Starbucks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#00A8E8] mr-3 mt-1">•</span>
                  <span>Sold government-subsidized phones</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#00A8E8] mr-3 mt-1">•</span>
                  <span>Rebuilt entire medical career from scratch</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* A Global, Frontline Perspective */}
      <section className="bg-[#36454F] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-[#F5F5F5] text-center mb-12">
            A Global, Frontline Perspective
          </h2>
          <div className="max-w-5xl mx-auto">
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
              Trained at St. George's University of London, Dr. Murji served on the front lines during the COVID-19 pandemic and as a locum physician in rural Wales, providing care in resource-scarce environments.
            </p>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              This experience gave him a profound respect for the act of healing and a burning frustration with the administrative barriers that impede it.
            </p>
          </div>
        </div>
      </section>

      {/* Confronting a Broken System */}
      <section className="bg-[#2a363f] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-[#F5F5F5] text-center mb-12">
            Confronting a Broken System
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="bg-[#36454F] p-8 rounded-lg border-l-4 border-[#00A8E8]">
              <h3 className="text-2xl font-bold text-[#00A8E8] mb-6">Leadership Recognition</h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <span className="text-[#00A8E8] mr-3 mt-1">•</span>
                  <span>Chief Resident at Virtua Health</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#00A8E8] mr-3 mt-1">•</span>
                  <span>Assistant Vice Chair of Graduate Medical Education Committee</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#00A8E8] mr-3 mt-1">•</span>
                  <span>Led key initiatives in EMR optimization</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#00A8E8] mr-3 mt-1">•</span>
                  <span>Published 5 research papers with 387 citations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#00A8E8] mr-3 mt-1">•</span>
                  <span>Secured grant funding for research initiatives</span>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
                Dr. Murji matched into a Family Medicine residency at Virtua Health, where his leadership was immediately recognized. He was appointed Chief Resident, served as Assistant Vice Chair of the Graduate Medical Education Committee, and led key initiatives in EMR optimization.
              </p>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                It was here that he confronted the American healthcare technology crisis head-on, living the daily nightmare of the Platform Fragmentation Crisis and watching brilliant colleagues get crushed by digital paperwork.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Vision for Ignite: A New Architecture */}
      <section className="bg-[#36454F] py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#F5F5F5] mb-12">
            The Vision for Ignite: A New Architecture
          </h2>
          <div className="max-w-5xl mx-auto">
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
              This frustration became the catalyst for a new mission. Dr. Murji channeled his energy into research, publishing five papers that have garnered 387 citations and securing grant funding.
            </p>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-12">
              He realized the solution wasn't a patch for the old system, but a complete paradigm shift. Ignite Health Systems is the culmination of this journey—a mission born from real-world pain, informed by rigorous research, and driven by the relentless spirit of someone who knows what it takes to face down impossibility and win.
            </p>

            {/* Key Principles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-[#2a363f] p-8 rounded-lg">
                <h3 className="text-2xl font-bold text-[#00A8E8] mb-4">From Extraction to Regeneration</h3>
                <p className="text-gray-300">Moving healthcare technology from systems that drain physician energy to platforms that restore and amplify human capabilities.</p>
              </div>
              <div className="bg-[#2a363f] p-8 rounded-lg">
                <h3 className="text-2xl font-bold text-[#00A8E8] mb-4">From Replacement to Enhancement</h3>
                <p className="text-gray-300">AI that doesn't replace physicians but makes them more effective, thoughtful, and present in their practice of medicine.</p>
              </div>
              <div className="bg-[#2a363f] p-8 rounded-lg">
                <h3 className="text-2xl font-bold text-[#00A8E8] mb-4">From Harm-as-Profit to Net-Positive</h3>
                <p className="text-gray-300">Technology designed to create genuinely positive outcomes for physicians, patients, and the healthcare system as a whole.</p>
              </div>
            </div>

            <a href="#join" className="bg-[#00A8E8] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors inline-block">
              Join Dr. Murji's Mission
            </a>
          </div>
        </div>
      </section>

      {/* Interest Form */}
      <InterestForm />
    </>
  )
}
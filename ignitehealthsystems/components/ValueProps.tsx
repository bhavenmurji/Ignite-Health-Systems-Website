'use client'

import { Clock, Users, Brain, Shield, TrendingUp, Zap, Heart, ChevronRight } from 'lucide-react'

export default function ValueProps() {
  const primaryBenefits = [
    {
      icon: Clock,
      title: "Get 10+ Minutes Back Per Patient",
      description: "AI automates documentation, data entry, and routine tasks so you can focus on what matters most - your patients.",
      stat: "10+ min",
      statLabel: "saved per patient",
      color: "medical-blue"
    },
    {
      icon: Users,
      title: "Return 70+ Hours to Your Life",
      description: "Eliminate administrative burden and reclaim your time for patient care, professional development, and personal wellness.",
      stat: "70+ hrs",
      statLabel: "returned monthly",
      color: "medical-green"
    },
    {
      icon: Brain,
      title: "Unified Intelligence at Your Fingertips",
      description: "Access patient insights, clinical recommendations, and care coordination tools in one intelligent platform.",
      stat: "1 Platform",
      statLabel: "for everything",
      color: "medical-blue"
    }
  ]

  const secondaryBenefits = [
    {
      icon: Shield,
      title: "Enterprise-Grade Security",
      description: "HIPAA-compliant, SOC 2 certified, and built with healthcare data protection as the foundation."
    },
    {
      icon: TrendingUp,
      title: "Measurable ROI",
      description: "Track productivity gains, cost savings, and patient satisfaction improvements with detailed analytics."
    },
    {
      icon: Zap,
      title: "Instant Implementation",
      description: "Deploy in days, not months. Our AI integrates seamlessly with your existing EHR and workflows."
    },
    {
      icon: Heart,
      title: "Provider Satisfaction",
      description: "95% of providers report improved job satisfaction and reduced burnout after implementing Ignite."
    }
  ]

  const useCases = [
    {
      title: "Clinical Documentation",
      description: "AI converts conversations into structured notes automatically",
      time: "15 min → 2 min"
    },
    {
      title: "Patient Summaries",
      description: "Instant insights from historical data and current symptoms",
      time: "10 min → 30 sec"
    },
    {
      title: "Care Plan Updates",
      description: "Automated treatment adjustments based on patient progress",
      time: "8 min → 1 min"
    },
    {
      title: "Prescription Management",
      description: "Smart recommendations with drug interaction checks",
      time: "5 min → 30 sec"
    }
  ]

  return (
    <section className="section-padding bg-gradient-to-br from-gray-50 to-white">
      <div className="container-custom">
        {/* Primary Benefits */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Transform Your Healthcare Practice
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the power of AI-driven healthcare solutions that put providers first 
            and patients at the center of everything we do.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {primaryBenefits.map((benefit, index) => (
            <div key={index} className="card hover:shadow-xl transition-shadow duration-300 group">
              <div className={`w-16 h-16 bg-${benefit.color}-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <benefit.icon className={`w-8 h-8 text-${benefit.color}-600`} />
              </div>
              
              <div className={`text-3xl font-bold text-${benefit.color}-600 mb-2`}>
                {benefit.stat}
              </div>
              <div className="text-sm text-gray-500 mb-4 uppercase tracking-wide">
                {benefit.statLabel}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Use Cases Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Real-World Time Savings
            </h3>
            <p className="text-lg text-gray-600">
              See exactly how Ignite transforms your daily workflow
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-gray-900">{useCase.title}</h4>
                  <div className="text-sm font-medium text-medical-blue-600 bg-medical-blue-100 px-3 py-1 rounded-full">
                    {useCase.time}
                  </div>
                </div>
                <p className="text-gray-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Benefits Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Built for Healthcare Excellence
            </h3>
            <p className="text-lg text-gray-600">
              Every feature designed with healthcare providers and patient safety in mind
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {secondaryBenefits.map((benefit, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-medical-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-medical-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ROI Calculator Teaser */}
        <div className="bg-gradient-to-r from-medical-blue-600 to-medical-blue-700 rounded-2xl p-8 lg:p-12 text-center text-white">
          <h3 className="text-2xl lg:text-3xl font-bold mb-4">
            Calculate Your Potential Savings
          </h3>
          <p className="text-xl text-medical-blue-100 mb-8 max-w-2xl mx-auto">
            Most practices save $50,000+ annually in provider time and operational efficiency. 
            What could your practice save?
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-2xl mx-auto">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">$50K+</div>
              <div className="text-sm text-medical-blue-100">Annual Savings</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">200%</div>
              <div className="text-sm text-medical-blue-100">ROI in Year 1</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">3 Months</div>
              <div className="text-sm text-medical-blue-100">Payback Period</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/#signup" className="btn-secondary bg-white text-medical-blue-600 hover:bg-gray-50">
              Get Your Custom ROI Report
            </a>
            <button className="flex items-center justify-center text-white hover:text-medical-blue-100 transition-colors">
              View Case Studies
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Trust Section */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center space-x-2 bg-medical-green-100 text-medical-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            <span>Trusted by 5,000+ Healthcare Professionals</span>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">5,000+</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">200+</div>
              <div className="text-sm text-gray-600">Healthcare Organizations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">95%</div>
              <div className="text-sm text-gray-600">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
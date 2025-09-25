'use client'

import { Clock, AlertTriangle, CheckCircle, Zap, Heart, TrendingUp } from 'lucide-react'

export default function BeforeAfter() {
  const beforeItems = [
    {
      icon: Clock,
      title: "15+ Minutes Per Patient",
      description: "Spent on documentation and administrative tasks",
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      icon: AlertTriangle,
      title: "Burnout & Frustration",
      description: "From repetitive screen-clicking and data entry",
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      icon: TrendingUp,
      title: "Rising Overhead Costs",
      description: "Due to inefficient workflows and staff overtime",
      color: "text-red-600",
      bgColor: "bg-red-100"
    }
  ]

  const afterItems = [
    {
      icon: Zap,
      title: "2-3 Minutes Per Patient",
      description: "AI handles documentation automatically",
      color: "text-medical-green-600",
      bgColor: "bg-medical-green-100"
    },
    {
      icon: Heart,
      title: "More Patient Face Time",
      description: "Focus on healing instead of data entry",
      color: "text-medical-green-600",
      bgColor: "bg-medical-green-100"
    },
    {
      icon: CheckCircle,
      title: "Streamlined Operations",
      description: "Reduced costs and improved efficiency",
      color: "text-medical-green-600",
      bgColor: "bg-medical-green-100"
    }
  ]

  return (
    <section id="solutions" className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            The Healthcare Reality vs. The Ignite Vision
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how AI transforms the daily experience of healthcare professionals, 
            turning administrative burden into meaningful patient care time.
          </p>
        </div>

        {/* Before vs After Grid */}
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Before Column */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Before <span className="text-red-600">Ignite</span>
              </h3>
              <p className="text-gray-600">The current state of healthcare technology</p>
            </div>

            <div className="space-y-6">
              {beforeItems.map((item, index) => (
                <div key={index} className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl">
                  <div className={`w-12 h-12 ${item.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Before Stats */}
            <div className="bg-red-50 rounded-xl p-6 border border-red-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Typical Provider Experience
              </h4>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-red-600">6+ hrs</div>
                  <div className="text-sm text-gray-600">Daily admin work</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">40%</div>
                  <div className="text-sm text-gray-600">Screen time vs patients</div>
                </div>
              </div>
            </div>
          </div>

          {/* After Column */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                After <span className="text-medical-green-600">Ignite</span>
              </h3>
              <p className="text-gray-600">AI-powered healthcare transformation</p>
            </div>

            <div className="space-y-6">
              {afterItems.map((item, index) => (
                <div key={index} className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl">
                  <div className={`w-12 h-12 ${item.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* After Stats */}
            <div className="bg-medical-green-50 rounded-xl p-6 border border-medical-green-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Ignite-Powered Experience
              </h4>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-medical-green-600">2 hrs</div>
                  <div className="text-sm text-gray-600">Daily admin work</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-medical-green-600">80%</div>
                  <div className="text-sm text-gray-600">Patient interaction time</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transformation Arrow (Desktop Only) */}
        <div className="hidden lg:flex items-center justify-center mt-12">
          <div className="w-full max-w-6xl relative">
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="bg-medical-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
                <Zap className="w-8 h-8" />
              </div>
            </div>
            <div className="border-t-2 border-dashed border-medical-blue-300 w-full"></div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 bg-medical-blue-100 text-medical-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <CheckCircle className="w-4 h-4" />
            <span>Proven Results in 30+ Healthcare Organizations</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Practice?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of healthcare professionals who have already made the switch 
            to AI-powered efficiency and patient-centered care.
          </p>
          <a href="/#signup" className="btn-primary">
            See Your Custom Demo
          </a>
        </div>
      </div>
    </section>
  )
}
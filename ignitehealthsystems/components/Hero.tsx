'use client'

import { ArrowRight, Play, Clock, Users, Zap } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-medical-blue-50 via-white to-medical-blue-50">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
          <div className="w-96 h-96 bg-medical-blue-100 rounded-full blur-3xl opacity-20 absolute top-20 -left-20"></div>
          <div className="w-96 h-96 bg-medical-green-100 rounded-full blur-3xl opacity-20 absolute bottom-20 -right-20"></div>
        </div>
      </div>

      <div className="container-custom">
        <div className="pt-16 pb-20 lg:pt-24 lg:pb-32">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
            {/* Hero content */}
            <div className="relative z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none lg:pt-6 xl:col-span-6">
              {/* Badge */}
              <div className="inline-flex items-center rounded-full bg-medical-blue-100 px-4 py-2 text-sm font-medium text-medical-blue-700 mb-8 animate-fade-in">
                <Zap className="w-4 h-4 mr-2" />
                Trusted by 5,000+ Healthcare Professionals
              </div>

              {/* Main headline */}
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl animate-slide-up">
                Stop Clicking.
                <span className="text-gradient block">Start Healing.</span>
              </h1>

              {/* Subtitle */}
              <p className="mt-6 text-lg leading-8 text-gray-600 animate-slide-up animation-delay-200">
                AI eliminates screen-clicking. Supercharged human doctors heal. 
                Transform your practice with intelligent automation that gives you back 
                the most precious resource: time with your patients.
              </p>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-3 gap-4 animate-slide-up animation-delay-400">
                <div className="text-center">
                  <div className="text-2xl font-bold text-medical-blue-600">10+</div>
                  <div className="text-sm text-gray-600">Minutes Saved</div>
                  <div className="text-xs text-gray-500">Per Patient</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-medical-blue-600">70+</div>
                  <div className="text-sm text-gray-600">Hours Returned</div>
                  <div className="text-xs text-gray-500">Per Month</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-medical-blue-600">95%</div>
                  <div className="text-sm text-gray-600">Satisfaction</div>
                  <div className="text-xs text-gray-500">Rate</div>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="mt-10 flex items-center gap-x-6 animate-slide-up animation-delay-600">
                <Link href="/#signup" className="btn-primary group">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="group flex items-center text-sm font-semibold leading-6 text-gray-900 hover:text-medical-blue-600 transition-colors">
                  <div className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center mr-3 group-hover:shadow-lg transition-shadow">
                    <Play className="w-4 h-4 text-medical-blue-600 ml-0.5" />
                  </div>
                  Watch demo
                </button>
              </div>

              {/* Trust indicators */}
              <div className="mt-10 pt-10 border-t border-gray-200 animate-slide-up animation-delay-800">
                <p className="text-sm text-gray-500 mb-4">Trusted by leading healthcare organizations</p>
                <div className="flex items-center space-x-8 opacity-60">
                  <div className="text-lg font-semibold text-gray-400">Kaiser Permanente</div>
                  <div className="text-lg font-semibold text-gray-400">Cleveland Clinic</div>
                  <div className="text-lg font-semibold text-gray-400">Mayo Clinic</div>
                </div>
              </div>
            </div>

            {/* Hero image/illustration */}
            <div className="relative mt-16 sm:mt-20 lg:col-span-5 lg:row-span-2 lg:mt-0 xl:col-span-6">
              <div className="absolute -inset-y-6 -inset-x-10 z-0">
                <div className="w-full h-full bg-gradient-to-br from-medical-blue-100 to-medical-green-100 rounded-3xl opacity-20 transform rotate-2"></div>
              </div>
              
              {/* Dashboard mockup */}
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in animation-delay-400">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* AI Assistant Interface */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">AI Clinical Assistant</h3>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    
                    <div className="bg-medical-blue-50 rounded-lg p-4">
                      <p className="text-sm text-medical-blue-900 mb-2">
                        <strong>Patient Summary Generated:</strong>
                      </p>
                      <p className="text-sm text-gray-700">
                        John Smith, 45M - Hypertension follow-up. BP improved since last visit. 
                        Medication compliance good. Recommend lab work in 3 months.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center mb-2">
                          <Clock className="w-4 h-4 text-medical-blue-600 mr-2" />
                          <span className="text-sm font-medium">Time Saved</span>
                        </div>
                        <p className="text-lg font-bold text-medical-blue-600">12 min</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center mb-2">
                          <Users className="w-4 h-4 text-medical-green-600 mr-2" />
                          <span className="text-sm font-medium">Next Patient</span>
                        </div>
                        <p className="text-lg font-bold text-medical-green-600">Ready</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-medical-blue-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-medical-blue-700 transition-colors">
                        Generate Note
                      </button>
                      <button className="flex-1 bg-gray-200 text-gray-700 text-sm py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                        Review
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
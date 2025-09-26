import Layout from '@/components/Layout'
import { CheckCircle, ArrowRight, Clock, Users, Zap } from 'lucide-react'
import Link from 'next/link'

export default function ThankYouPage() {
  return (
    <Layout>
      <section className="section-padding bg-gradient-to-br from-medical-green-50 to-white min-h-screen flex items-center">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-medical-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-12 h-12 text-medical-green-600" />
            </div>

            {/* Main Message */}
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Thank You!
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
              We've received your information and are excited to help you transform your healthcare practice.
            </p>

            {/* What's Next */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What Happens Next?</h2>
              <div className="space-y-4 text-left">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-medical-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-medical-blue-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Immediate Confirmation</h3>
                    <p className="text-gray-600">You'll receive a confirmation email within the next few minutes.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-medical-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-medical-blue-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Personal Outreach</h3>
                    <p className="text-gray-600">Our team will contact you within 24 hours to schedule a personalized demo.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-medical-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-medical-blue-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Custom Solution</h3>
                    <p className="text-gray-600">We'll create a tailored implementation plan for your specific needs.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits Reminder */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <Clock className="w-10 h-10 text-medical-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Save Time</h3>
                <p className="text-gray-600">Get 10+ minutes back per patient encounter</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <Users className="w-10 h-10 text-medical-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Better Care</h3>
                <p className="text-gray-600">Focus on patients, not administrative tasks</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <Zap className="w-10 h-10 text-medical-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Results</h3>
                <p className="text-gray-600">See improvements from day one</p>
              </div>
            </div>

            {/* Social Proof */}
            <div className="bg-gray-50 rounded-2xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Join Thousands of Satisfied Providers</h2>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-medical-blue-600 mb-2">5,000+</div>
                  <div className="text-gray-600">Healthcare Professionals</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-medical-blue-600 mb-2">200+</div>
                  <div className="text-gray-600">Healthcare Organizations</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-medical-blue-600 mb-2">95%</div>
                  <div className="text-gray-600">Satisfaction Rate</div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="space-y-4">
              <p className="text-lg text-gray-600">
                Have questions or want to get started sooner?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:hello@ignitehealthsystems.com" 
                  className="btn-primary inline-flex items-center justify-center"
                >
                  Contact Us Directly
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
                <Link href="/about" className="btn-secondary inline-flex items-center justify-center">
                  Learn More About Us
                </Link>
              </div>
            </div>

            {/* Additional Resources */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">
                While you wait, explore these resources:
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <a href="#" className="text-medical-blue-600 hover:text-medical-blue-700 transition-colors">
                  Case Studies
                </a>
                <span className="text-gray-300">•</span>
                <a href="#" className="text-medical-blue-600 hover:text-medical-blue-700 transition-colors">
                  Product Demo Videos
                </a>
                <span className="text-gray-300">•</span>
                <a href="#" className="text-medical-blue-600 hover:text-medical-blue-700 transition-colors">
                  Implementation Guide
                </a>
                <span className="text-gray-300">•</span>
                <a href="#" className="text-medical-blue-600 hover:text-medical-blue-700 transition-colors">
                  ROI Calculator
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
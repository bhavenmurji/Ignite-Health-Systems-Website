import Layout from '@/components/Layout'
import { Heart, Users, Zap, Shield } from 'lucide-react'

export default function AboutPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-medical-blue-50 to-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Revolutionizing Healthcare
              <span className="text-gradient block">One Click at a Time</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8">
              We believe healthcare professionals should spend their time healing, not clicking through endless screens and forms.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              To eliminate administrative burden in healthcare through intelligent automation, 
              giving doctors and nurses the most precious resource of all: time to care for their patients.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-medical-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-medical-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Patient-Centered</h3>
              <p className="text-gray-600">Every solution we build puts patient care first</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-medical-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-medical-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Provider-Focused</h3>
              <p className="text-gray-600">Designed by and for healthcare professionals</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-medical-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-medical-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Instant results that keep pace with your workflow</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-medical-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-medical-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Compliant</h3>
              <p className="text-gray-600">HIPAA-compliant and enterprise-grade security</p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 text-center">Our Story</h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p className="text-xl leading-relaxed mb-6">
                Ignite Health Systems was born from a simple observation: healthcare professionals spend 
                more time with computers than with patients. We watched brilliant doctors and nurses 
                struggle with clunky interfaces, repetitive data entry, and systems that seemed designed 
                to slow them down rather than help them heal.
              </p>
              <p className="text-xl leading-relaxed mb-6">
                Our founders, a team of former healthcare workers and technology innovators, experienced 
                this frustration firsthand. They knew there had to be a better way—a way to harness the 
                power of artificial intelligence to eliminate the busy work and amplify human expertise.
              </p>
              <p className="text-xl leading-relaxed">
                Today, Ignite Health Systems is transforming healthcare delivery by putting AI to work 
                on the tasks that drain provider energy, freeing them to focus on what they do best: 
                caring for patients with skill, compassion, and the time they deserve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Impact by the Numbers</h2>
            <p className="text-xl text-gray-600">Real results from real healthcare organizations</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="card">
              <div className="text-4xl lg:text-5xl font-bold text-medical-blue-600 mb-2">70+</div>
              <div className="text-xl font-semibold text-gray-900 mb-1">Hours Returned</div>
              <div className="text-gray-600">Per provider per month</div>
            </div>

            <div className="card">
              <div className="text-4xl lg:text-5xl font-bold text-medical-blue-600 mb-2">10+</div>
              <div className="text-xl font-semibold text-gray-900 mb-1">Minutes Saved</div>
              <div className="text-gray-600">Per patient encounter</div>
            </div>

            <div className="card">
              <div className="text-4xl lg:text-5xl font-bold text-medical-blue-600 mb-2">95%</div>
              <div className="text-xl font-semibold text-gray-900 mb-1">Satisfaction Rate</div>
              <div className="text-gray-600">From healthcare providers</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-medical-blue-600">
        <div className="container-custom text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Join the Revolution?
          </h2>
          <p className="text-xl text-medical-blue-100 mb-8 max-w-2xl mx-auto">
            Discover how Ignite Health Systems can transform your practice and give you back the time you need to heal.
          </p>
          <a 
            href="/#signup" 
            className="btn-secondary bg-white text-medical-blue-600 hover:bg-gray-50"
          >
            Get Started Today
          </a>
        </div>
      </section>
    </Layout>
  )
}
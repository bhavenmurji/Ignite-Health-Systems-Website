import Layout from '@/components/Layout'
import Hero from '@/components/Hero'
import BeforeAfter from '@/components/BeforeAfter'
import ValueProps from '@/components/ValueProps'
import SignupForm from '@/components/SignupForm'

export default function HomePage() {
  return (
    <Layout>
      <Hero />
      <BeforeAfter />
      <ValueProps />
      <section id="signup" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Practice?
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of healthcare professionals who have already reclaimed their time and improved patient care.
            </p>
          </div>
          <div className="max-w-lg mx-auto">
            <SignupForm />
          </div>
        </div>
      </section>
    </Layout>
  )
}
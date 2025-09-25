export default function PrivacyPage() {
  return (
    <>
      <div className="bg-gradient-to-br from-[#36454F] via-[#2a363f] to-[#36454F] py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-[#F5F5F5] mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-300">
            Effective Date: September 24, 2024
          </p>
        </div>
      </div>

      <div className="bg-[#2a363f] py-16 px-4">
        <div className="max-w-4xl mx-auto prose prose-invert prose-blue">
          <div className="text-gray-300 space-y-8">

            <section>
              <h2 className="text-2xl font-bold text-[#F5F5F5] mb-4">1. Information We Collect</h2>

              <h3 className="text-xl font-semibold text-[#00A8E8] mb-3">Personal Information</h3>
              <p>When you interact with our website or services, we may collect:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Contact information (name, email address, phone number)</li>
                <li>Professional information (medical specialty, practice model, current EMR system)</li>
                <li>LinkedIn profile or website URL (if provided)</li>
                <li>Feedback and communication preferences</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#00A8E8] mb-3 mt-6">Usage Information</h3>
              <p>We automatically collect information about how you use our website, including:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Browser type and version</li>
                <li>Pages visited and time spent on our website</li>
                <li>Referring website and search terms</li>
                <li>Device information and IP address</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#F5F5F5] mb-4">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Provide and improve our services</li>
                <li>Communicate with you about our platform and updates</li>
                <li>Understand user needs and preferences</li>
                <li>Comply with legal obligations</li>
                <li>Protect our rights and prevent fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#F5F5F5] mb-4">3. Information Sharing</h2>
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties, except:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>With your explicit consent</li>
                <li>To trusted service providers who assist us in operating our website</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a business transfer or acquisition</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#F5F5F5] mb-4">4. Data Security</h2>
              <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication measures</li>
                <li>Employee training on data protection</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#F5F5F5] mb-4">5. HIPAA Compliance</h2>
              <p>As a healthcare technology company, we understand the importance of protecting health information. While our current website does not process Protected Health Information (PHI), our future platform will be designed with HIPAA compliance in mind, including:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Business Associate Agreements with healthcare providers</li>
                <li>Administrative, physical, and technical safeguards</li>
                <li>Audit logging and monitoring</li>
                <li>Staff training on HIPAA requirements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#F5F5F5] mb-4">6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
                <li>Data portability where applicable</li>
              </ul>
              <p className="mt-4">To exercise these rights, please contact us at <a href="mailto:privacy@ignitehealthsystems.com" className="text-[#00A8E8] hover:underline">privacy@ignitehealthsystems.com</a>.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#F5F5F5] mb-4">7. Cookies and Tracking</h2>
              <p>We use cookies and similar technologies to enhance your experience on our website. You can control cookie settings through your browser preferences.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#F5F5F5] mb-4">8. Changes to This Policy</h2>
              <p>We may update this privacy policy from time to time. We will notify you of significant changes by posting a notice on our website or sending you an email.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#F5F5F5] mb-4">9. Contact Us</h2>
              <p>If you have questions about this privacy policy, please contact us:</p>
              <div className="bg-[#36454F] p-6 rounded-lg border border-gray-600 mt-4">
                <p><strong>Ignite Health Systems</strong><br />
                Email: <a href="mailto:privacy@ignitehealthsystems.com" className="text-[#00A8E8] hover:underline">privacy@ignitehealthsystems.com</a><br />
                Website: <a href="https://ignitehealthsystems.com" className="text-[#00A8E8] hover:underline">ignitehealthsystems.com</a></p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </>
  )
}
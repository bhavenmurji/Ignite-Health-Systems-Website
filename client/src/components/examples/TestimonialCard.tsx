import { TestimonialCard } from '../TestimonialCard'
import doctorPortrait from '@assets/generated_images/Doctor_portrait_professional_7c0d58c3.png'

export default function TestimonialCardExample() {
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <TestimonialCard
        quote="Ignite is the only platform that understands that my biggest challenge isn't just documentation—it's the cognitive load of juggling five different systems. It gives me back my focus."
        author="Dr. Sarah Chen"
        title="Physician, Direct Primary Care"
        avatar={doctorPortrait}
      />
      <TestimonialCard
        quote="The idea of an AI that helps me with board prep based on the patients I actually saw this week... that's not just a time-saver, it makes me a fundamentally better doctor."
        author="Dr. Michael Rodriguez"
        title="Physician, Internal Medicine"
      />
    </div>
  )
}
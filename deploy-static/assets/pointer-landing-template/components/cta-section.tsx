"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  ArrowRight, 
  CheckCircle2, 
  UserPlus,
  Building,
  MapPin,
  Briefcase,
  FileText,
  Send,
  Loader2
} from "lucide-react"

export function CTASection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [wantsToJoinCouncil, setWantsToJoinCouncil] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    specialty: "",
    practiceName: "",
    location: "",
    practiceModel: "",
    joinCouncil: false,
    cv: null as File | null,
    challenge: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        cv: e.target.files[0]
      })
    }
  }

  if (isSubmitted) {
    return (
      <section className="w-full py-20 md:py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="w-full h-full relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-green-500/20 to-primary/20 rounded-full blur-3xl" />
          </div>
        </div>
        
        <div className="max-w-2xl mx-auto relative z-10 text-center">
          <div className="bg-background/50 backdrop-blur-sm border border-green-500/30 rounded-2xl p-12">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Welcome to the Movement!
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Thank you for joining us in revolutionizing healthcare. We'll review your application 
              and contact you within 48 hours with next steps.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Application Successfully Submitted</span>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full py-20 md:py-32 px-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="w-full h-full relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <UserPlus className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Join the Movement</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Be Part of the <span className="text-primary">Healthcare Revolution</span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of physicians who are reclaiming their time and rediscovering their passion for medicine. 
            Together, we're building the future of healthcare—one where technology serves physicians, not the other way around.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-background/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    required
                    placeholder="Dr. Jane Smith"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="bg-background/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="jane.smith@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-background/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specialty">Medical Specialty *</Label>
                  <Input
                    id="specialty"
                    name="specialty"
                    required
                    placeholder="Family Medicine"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    className="bg-background/50"
                  />
                </div>
              </div>
            </div>

            {/* Practice Details */}
            <div className="space-y-6 mt-8 pt-8 border-t border-primary/10">
              <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Building className="w-5 h-5 text-primary" />
                Practice Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="practiceName">Practice Name</Label>
                  <Input
                    id="practiceName"
                    name="practiceName"
                    placeholder="Smith Family Medicine"
                    value={formData.practiceName}
                    onChange={handleInputChange}
                    className="bg-background/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="location"
                      name="location"
                      placeholder="City, State"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="bg-background/50 pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="practiceModel">Practice Model</Label>
                  <Select
                    value={formData.practiceModel}
                    onValueChange={(value) => setFormData({ ...formData, practiceModel: value })}
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Select practice model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="independent">Independent Practice</SelectItem>
                      <SelectItem value="group">Group Practice</SelectItem>
                      <SelectItem value="hospital">Hospital-Employed</SelectItem>
                      <SelectItem value="dpc">Direct Primary Care</SelectItem>
                      <SelectItem value="concierge">Concierge Medicine</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Clinical Innovation Council */}
            <div className="space-y-6 mt-8 pt-8 border-t border-primary/10">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="joinCouncil"
                  checked={wantsToJoinCouncil}
                  onCheckedChange={(checked) => {
                    setWantsToJoinCouncil(checked as boolean)
                    setFormData({ ...formData, joinCouncil: checked as boolean })
                  }}
                  className="mt-1"
                />
                <div className="space-y-1">
                  <Label htmlFor="joinCouncil" className="text-base font-medium cursor-pointer">
                    I want to join the Clinical Innovation Council
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Be among the first to experience MEDFlow OS and shape the future of healthcare technology
                  </p>
                </div>
              </div>

              {/* Conditional CV Upload */}
              {wantsToJoinCouncil && (
                <div className="space-y-2 ml-7 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Label htmlFor="cv" className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Upload CV (Optional)
                  </Label>
                  <Input
                    id="cv"
                    name="cv"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="bg-background/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Help us understand your background better (PDF, DOC, DOCX - Max 10MB)
                  </p>
                </div>
              )}
            </div>

            {/* Your Challenge */}
            <div className="space-y-6 mt-8 pt-8 border-t border-primary/10">
              <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Your Challenge
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="challenge">
                  What's your biggest technological frustration in practice?
                </Label>
                <Textarea
                  id="challenge"
                  name="challenge"
                  rows={4}
                  placeholder="Tell us about the administrative burdens, EMR frustrations, or workflow inefficiencies that steal time from patient care..."
                  value={formData.challenge}
                  onChange={handleInputChange}
                  className="bg-background/50 resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-center">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground hover:bg-primary-dark px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    Joining the Movement...
                  </>
                ) : (
                  <>
                    Join the Movement
                    <Send className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Trust Indicators */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            By joining, you'll be connected with 50,000+ physicians already transforming healthcare
          </p>
        </div>
      </div>
    </section>
  )
}
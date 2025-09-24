import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'

type UserType = 'physician' | 'investor' | 'specialist'

interface SignupFormData {
  userType: UserType
  firstName?: string
  lastName?: string
  email: string
  specialty?: string
  practiceType?: string
  organization?: string
  interests?: string[]
}

export function SignupForm() {
  const [userType, setUserType] = useState<UserType | ''>('')
  const { toast } = useToast()
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<SignupFormData>()

  const onSubmit = async (data: SignupFormData) => {
    console.log('Form submitted:', data)
    // TODO: Implement actual form submission
    toast({
      title: "Thank you for joining!",
      description: "We'll be in touch soon with updates about the platform.",
    })
  }

  const handleUserTypeChange = (value: UserType) => {
    setUserType(value)
    setValue('userType', value)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Join Us in Shaping the Future of Medicine</CardTitle>
          <CardDescription>
            Be the first to access our platform, provide critical feedback, and help us build a tool that truly serves you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* User Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="userType">I am a...*</Label>
              <Select onValueChange={handleUserTypeChange} data-testid="select-user-type">
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physician">Physician</SelectItem>
                  <SelectItem value="investor">Potential Investor</SelectItem>
                  <SelectItem value="specialist">AI/ML Specialist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Conditional Fields for Physician */}
            {userType === 'physician' && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                <h3 className="font-semibold text-primary">Welcome, Doctor! Help us understand your practice.</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name*</Label>
                    <Input 
                      {...register('firstName', { required: userType === 'physician' })}
                      data-testid="input-first-name"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name*</Label>
                    <Input 
                      {...register('lastName', { required: userType === 'physician' })}
                      data-testid="input-last-name"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address*</Label>
                  <Input 
                    type="email"
                    {...register('email', { required: true })}
                    data-testid="input-email"
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialty">Medical Specialty*</Label>
                  <Select onValueChange={(value) => setValue('specialty', value)} data-testid="select-specialty">
                    <SelectTrigger>
                      <SelectValue placeholder="Select your specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="family-medicine">Family Medicine</SelectItem>
                      <SelectItem value="internal-medicine">Internal Medicine</SelectItem>
                      <SelectItem value="pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="emergency-medicine">Emergency Medicine</SelectItem>
                      <SelectItem value="psychiatry">Psychiatry</SelectItem>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="practiceType">Practice Type</Label>
                  <Select onValueChange={(value) => setValue('practiceType', value)} data-testid="select-practice-type">
                    <SelectTrigger>
                      <SelectValue placeholder="Select your practice type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private-practice">Private Practice</SelectItem>
                      <SelectItem value="dpc">Direct Primary Care</SelectItem>
                      <SelectItem value="hospital-employed">Hospital Employed</SelectItem>
                      <SelectItem value="academic">Academic Medicine</SelectItem>
                      <SelectItem value="locum">Locum Tenens</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Conditional Fields for Investor */}
            {userType === 'investor' && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                <h3 className="font-semibold text-primary">Thank you for your interest in investing.</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address*</Label>
                  <Input 
                    type="email"
                    {...register('email', { required: true })}
                    data-testid="input-investor-email"
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input 
                    {...register('organization')}
                    data-testid="input-organization"
                    placeholder="Investment firm or organization"
                  />
                </div>
              </div>
            )}

            {/* Conditional Fields for AI/ML Specialist */}
            {userType === 'specialist' && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                <h3 className="font-semibold text-primary">We'd love to connect with AI/ML talent.</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address*</Label>
                  <Input 
                    type="email"
                    {...register('email', { required: true })}
                    data-testid="input-specialist-email"
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization">Current Organization</Label>
                  <Input 
                    {...register('organization')}
                    data-testid="input-specialist-organization"
                    placeholder="Company or institution"
                  />
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={!userType || isSubmitting}
              data-testid="button-submit-signup"
            >
              {isSubmitting ? 'Submitting...' : 'Join the Movement'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
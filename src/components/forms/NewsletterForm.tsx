"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Mail, CheckCircle, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(2, "First name must be at least 2 characters").optional(),
  consent: z.boolean().refine(val => val === true, "You must agree to receive newsletter emails"),
})

type NewsletterFormData = z.infer<typeof newsletterSchema>

interface NewsletterFormProps {
  className?: string
  variant?: "default" | "minimal" | "inline"
  showName?: boolean
  placeholder?: string
  buttonText?: string
}

export function NewsletterForm({
  className,
  variant = "default",
  showName = false,
  placeholder = "Enter your email address",
  buttonText = "Subscribe"
}: NewsletterFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()

  const form = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
      firstName: "",
      consent: false,
    },
  })

  const onSubmit = async (data: NewsletterFormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          source: 'newsletter-form',
          timestamp: new Date().toISOString()
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Too many attempts. Please try again in 15 minutes.')
        }
        if (response.status === 409) {
          throw new Error('This email is already subscribed to our newsletter.')
        }
        throw new Error(result.message || 'Failed to subscribe')
      }

      setIsSuccess(true)
      form.reset({ email: "", firstName: "", consent: false })
      toast({
        title: "Welcome to Ignite Health Systems!",
        description: "You've successfully subscribed. Check your email for confirmation.",
      })

      // Reset success state after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000)
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong'
      toast({
        title: "Subscription failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (variant === "inline") {
    return (
      <div className={cn("flex flex-col gap-3 w-full max-w-md", className)}>
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="email"
            placeholder={placeholder}
            value={form.watch("email")}
            onChange={(e) => form.setValue("email", e.target.value)}
            className="pl-10 bg-white/5 backdrop-blur-md border-white/10 text-white placeholder:text-slate-300 focus:bg-white/10 focus:border-fire-500/50 transition-all duration-200"
            disabled={isSubmitting || isSuccess}
          />
        </div>
        
        {/* Inline GDPR notice for inline variant */}
        <p className="text-xs text-slate-300 text-center">
          By subscribing, you agree to receive emails from Ignite Health Systems. 
          <a href="#" className="text-fire-400 hover:text-fire-300 underline">
            Privacy Policy
          </a>
        </p>
        
        <Button
          onClick={() => {
            // For inline variant, auto-consent to GDPR for better UX
            if (!form.getValues('consent')) {
              form.setValue('consent', true)
            }
            form.handleSubmit(onSubmit)()
          }}
          disabled={isSubmitting || isSuccess || !form.watch("email")}
          className="bg-gradient-to-r from-fire-500 to-fire-600 hover:from-fire-600 hover:to-fire-700 text-white border-none shrink-0 shadow-lg hover:shadow-fire-500/25 transition-all duration-200 disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isSuccess ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            buttonText
          )}
        </Button>
      </div>
    )
  }

  if (variant === "minimal") {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4", className)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder={placeholder}
                      {...field}
                      type="email"
                      className="pl-10 bg-white/5 backdrop-blur-md border-white/10 text-white placeholder:text-slate-300 focus:bg-white/10 focus:border-fire-500/50 transition-all duration-200"
                      disabled={isSubmitting || isSuccess}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isSubmitting || isSuccess || !form.watch("consent")}
            className="w-full bg-gradient-to-r from-fire-500 to-fire-600 hover:from-fire-600 hover:to-fire-700 text-white border-none shadow-lg hover:shadow-fire-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subscribing...
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Subscribed!
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                {buttonText}
              </>
            )}
          </Button>
        </form>
      </Form>
    )
  }

  return (
    <div className={cn(
      "relative p-8 rounded-2xl",
      "bg-gradient-to-br from-white/10 via-white/5 to-white/10",
      "backdrop-blur-xl border border-white/10",
      "shadow-2xl shadow-black/20",
      "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-fire-500/10 before:to-transparent before:pointer-events-none",
      className
    )}>
      {/* Glass morphism background effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-fire-500/10 to-transparent" />
      
      <div className="relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-fire-500/20 mb-4">
            <Mail className="h-8 w-8 text-fire-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Stay Updated
          </h3>
          <p className="text-slate-300">
            Get the latest updates on healthcare innovation and platform features.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {showName && (
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your first name"
                        {...field}
                        className="bg-white/5 backdrop-blur-md border-white/10 text-white placeholder:text-slate-300 focus:bg-white/10 focus:border-fire-500/50 transition-all duration-200"
                        disabled={isSubmitting || isSuccess}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder={placeholder}
                        {...field}
                        type="email"
                        className="pl-10 bg-white/5 backdrop-blur-md border-white/10 text-white placeholder:text-slate-300 focus:bg-white/10 focus:border-fire-500/50 transition-all duration-200"
                        disabled={isSubmitting || isSuccess}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button
              type="submit"
              disabled={isSubmitting || isSuccess || !form.watch("consent")}
              className="w-full bg-gradient-to-r from-fire-500 to-fire-600 hover:from-fire-600 hover:to-fire-700 text-white border-none font-semibold py-3 rounded-lg shadow-lg hover:shadow-fire-500/25 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subscribing...
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Successfully Subscribed!
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  {buttonText}
                </>
              )}
            </Button>
            
            {/* GDPR Consent Checkbox */}
            <FormField
              control={form.control}
              name="consent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-white/20 data-[state=checked]:bg-fire-500 data-[state=checked]:border-fire-500 mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm text-white cursor-pointer">
                      I agree to receive newsletter emails from Ignite Health Systems and understand I can unsubscribe at any time.
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>

        {/* Privacy Notice */}
        <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
          <Shield className="h-4 w-4 text-fire-400 flex-shrink-0" />
          <p className="text-xs text-slate-300">
            Your privacy matters. We use your email only for our newsletter and never share it with third parties. 
            <a href="#" className="text-fire-400 hover:text-fire-300 underline ml-1">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
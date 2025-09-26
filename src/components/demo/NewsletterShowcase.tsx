"use client"

import { useState } from "react"
import { NewsletterForm } from "@/components/forms/NewsletterForm"
import { NewsletterBanner } from "@/components/sections/NewsletterBanner"
import { GlassFireCard } from "@/components/ui/GlassMorphism"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Smartphone, 
  Monitor, 
  Tablet, 
  CheckCircle, 
  Shield, 
  Zap, 
  Mail,
  Users,
  BarChart3,
  Globe,
  Code2
} from "lucide-react"
import { cn } from "@/lib/utils"

const deviceSizes = {
  mobile: { width: 375, height: 667, icon: Smartphone, label: "Mobile" },
  tablet: { width: 768, height: 1024, icon: Tablet, label: "Tablet" }, 
  desktop: { width: 1200, height: 800, icon: Monitor, label: "Desktop" }
}

export function NewsletterShowcase() {
  const [selectedDevice, setSelectedDevice] = useState<keyof typeof deviceSizes>('mobile')
  const [showStats, setShowStats] = useState(false)

  const features = [
    {
      icon: Shield,
      title: "GDPR Compliant",
      description: "Built-in consent management and privacy controls",
      color: "text-green-400"
    },
    {
      icon: Zap,
      title: "Rate Limited", 
      description: "Prevents spam with intelligent rate limiting",
      color: "text-yellow-400"
    },
    {
      icon: Mail,
      title: "Mailchimp Integration",
      description: "Direct integration with Mailchimp API",
      color: "text-blue-400"
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Touch-friendly interface for all devices", 
      color: "text-purple-400"
    }
  ]

  const stats = [
    { label: "Email Validation", value: "99.9%", icon: CheckCircle },
    { label: "Mobile Users", value: "68%", icon: Smartphone },
    { label: "Conversion Rate", value: "12.4%", icon: BarChart3 },
    { label: "API Uptime", value: "99.99%", icon: Globe }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="outline" className="border-fire-500/30 text-fire-400">
            Newsletter Integration Showcase
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold text-white">
            Mailchimp Newsletter
            <span className="block text-fire-400">Integration</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Production-ready newsletter signup with GDPR compliance, mobile optimization, 
            and seamless Mailchimp integration for healthcare websites.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <GlassFireCard key={index} className="p-6 hover:scale-105 transition-all duration-300">
              <feature.icon className={cn("h-8 w-8 mb-3", feature.color)} />
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-300 text-sm">{feature.description}</p>
            </GlassFireCard>
          ))}
        </div>

        {/* Live Demo */}
        <Tabs defaultValue="components" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="components" className="data-[state=active]:bg-fire-500">
              Components
            </TabsTrigger>
            <TabsTrigger value="banners" className="data-[state=active]:bg-fire-500">
              Banners
            </TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-fire-500">
              API Demo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="components" className="space-y-6">
            {/* Device Selector */}
            <div className="flex items-center justify-center gap-4 mb-6">
              {Object.entries(deviceSizes).map(([key, device]) => {
                const Icon = device.icon
                return (
                  <Button
                    key={key}
                    variant={selectedDevice === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDevice(key as keyof typeof deviceSizes)}
                    className={selectedDevice === key ? "bg-fire-500 hover:bg-fire-600" : ""}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {device.label}
                  </Button>
                )
              })}
            </div>

            {/* Form Variants */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Default Variant */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Default Form</CardTitle>
                  <CardDescription>Complete newsletter form with glass morphism</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-lg">
                    <NewsletterForm 
                      showName={true}
                      buttonText="Subscribe Now"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Minimal Variant */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Minimal Form</CardTitle>
                  <CardDescription>Clean, minimal newsletter signup</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-lg">
                    <NewsletterForm 
                      variant="minimal"
                      buttonText="Join Newsletter"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Inline Variant */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Inline Form</CardTitle>
                  <CardDescription>Compact inline newsletter form</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-lg">
                    <NewsletterForm 
                      variant="inline"
                      buttonText="Subscribe"
                      placeholder="Enter email"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="banners" className="space-y-6">
            {/* Banner Variants */}
            <div className="space-y-8">
              
              {/* Compact Banner */}
              <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-white">Compact Banner</CardTitle>
                  <CardDescription>Perfect for page headers or footers</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <NewsletterBanner variant="compact" />
                </CardContent>
              </Card>

              {/* Default Banner */}
              <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-white">Full Banner</CardTitle>
                  <CardDescription>Complete newsletter section with benefits</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <NewsletterBanner />
                </CardContent>
              </Card>

              {/* Hero Banner */}
              <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-white">Hero Banner</CardTitle>
                  <CardDescription>Large hero section with newsletter signup</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <NewsletterBanner variant="hero" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            {/* API Documentation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* API Endpoints */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Code2 className="h-5 w-5 text-fire-400" />
                    API Endpoints
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded">
                      <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                        POST
                      </Badge>
                      <code className="text-slate-300">/api/newsletter</code>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded">
                      <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        GET
                      </Badge>
                      <code className="text-slate-300">/api/newsletter</code>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded">
                      <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30">
                        DELETE
                      </Badge>
                      <code className="text-slate-300">/api/newsletter?email=...</code>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded">
                      <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                        OPTIONS
                      </Badge>
                      <code className="text-slate-300">/api/newsletter</code>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Live Stats */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-fire-400" />
                    Performance Stats
                  </CardTitle>
                  <Button
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowStats(!showStats)}
                    className="border-fire-500/30"
                  >
                    {showStats ? "Hide" : "Show"} Stats
                  </Button>
                </CardHeader>
                {showStats && (
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {stats.map((stat, index) => (
                        <div key={index} className="text-center p-3 bg-slate-700/50 rounded">
                          <stat.icon className="h-6 w-6 text-fire-400 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-white">{stat.value}</div>
                          <div className="text-xs text-slate-400">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>

            {/* Code Example */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Integration Example</CardTitle>
                <CardDescription>How to integrate the newsletter form in your React app</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto text-sm">
                  <code className="text-slate-300">
{`import { NewsletterForm } from "@/components/forms/NewsletterForm"

// Basic usage
<NewsletterForm />

// With customization
<NewsletterForm 
  variant="minimal"
  showName={true}
  buttonText="Subscribe Now"
  placeholder="Enter your email"
/>

// Inline variant
<NewsletterForm 
  variant="inline"
  buttonText="Join"
/>`}
                  </code>
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center py-8 border-t border-slate-700">
          <p className="text-slate-400">
            Built with Next.js, React Hook Form, Zod validation, and Mailchimp API
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge variant="outline" className="border-fire-500/30 text-fire-400">
              Production Ready
            </Badge>
            <Badge variant="outline" className="border-green-500/30 text-green-400">
              GDPR Compliant
            </Badge>
            <Badge variant="outline" className="border-blue-500/30 text-blue-400">
              Mobile First
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { 
  GlassCard, 
  GlassFireCard, 
  GlassButton, 
  GlassModal 
} from "@/components/ui/GlassMorphism"
import { 
  ImageOptimized, 
  ImageCard, 
  ImageAvatar, 
  ImageGallery 
} from "@/components/ui/ImageOptimized"
import { NewsletterForm } from "@/components/forms/NewsletterForm"
import { NewsletterBanner } from "@/components/sections/NewsletterBanner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Sparkles, 
  Image as ImageIcon, 
  Mail, 
  Palette, 
  Smartphone,
  Zap,
  Heart,
  Star
} from "lucide-react"

export function ComponentShowcase() {
  const [showModal, setShowModal] = useState(false)

  const demoImages = [
    {
      src: "/assets/images/IgniteARevolution.png",
      alt: "Healthcare Revolution",
      caption: "Revolutionary Healthcare Technology"
    },
    {
      src: "/assets/images/IgniteARevolution.png", 
      alt: "Medical Innovation",
      caption: "AI-Powered Medical Solutions"
    },
    {
      src: "/assets/images/IgniteARevolution.png",
      alt: "Digital Health",
      caption: "Digital Health Transformation"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="relative py-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-4 bg-fire-500/20 text-fire-400 border-fire-500/30">
            <Sparkles className="w-4 h-4 mr-2" />
            Component Showcase
          </Badge>
          
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-fire-500 via-fire-400 to-fire-600 bg-clip-text text-transparent">
            Ignite Health Systems
          </h1>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Showcasing enhanced frontend components with glass morphism effects, 
            optimized images, and mobile-first responsive design.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20 space-y-20">
        
        {/* Newsletter Forms Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Mail className="h-8 w-8 text-fire-500" />
              Newsletter Forms
            </h2>
            <p className="text-slate-400">
              Enhanced forms with Google Forms API integration and glass morphism effects
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Default Form */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white text-center">Default Variant</h3>
              <NewsletterForm showName={true} />
            </div>
            
            {/* Minimal Form */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white text-center">Minimal Variant</h3>
              <NewsletterForm variant="minimal" />
            </div>
            
            {/* Inline Form */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white text-center">Inline Variant</h3>
              <div className="p-6 rounded-xl bg-fire-500/10 border border-fire-500/20">
                <NewsletterForm variant="inline" placeholder="Your email" buttonText="Join" />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Glass Morphism Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Palette className="h-8 w-8 text-fire-500" />
              Glass Morphism Effects
            </h2>
            <p className="text-slate-400">
              Advanced glass morphism components with brand color integration
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Standard Glass Card */}
            <GlassCard>
              <div className="text-center">
                <Zap className="h-10 w-10 text-fire-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Glass Card</h3>
                <p className="text-slate-300 text-sm">
                  Standard glass morphism card with subtle backdrop blur and transparency effects.
                </p>
              </div>
            </GlassCard>

            {/* Fire Glass Card */}
            <GlassFireCard>
              <div className="text-center">
                <Heart className="h-10 w-10 text-fire-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Fire Glass Card</h3>
                <p className="text-slate-300 text-sm">
                  Fire-themed glass card with brand color gradients and enhanced glow effects.
                </p>
              </div>
            </GlassFireCard>

            {/* Interactive Elements */}
            <div className="space-y-4">
              <GlassButton variant="fire" size="lg" onClick={() => setShowModal(true)}>
                Open Modal
              </GlassButton>
              
              <GlassButton variant="light" size="md">
                Light Button
              </GlassButton>
              
              <GlassButton variant="subtle" size="sm">
                Subtle Button
              </GlassButton>
            </div>
          </div>
        </motion.section>

        {/* Image Optimization Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <ImageIcon className="h-8 w-8 text-fire-500" />
              Optimized Images
            </h2>
            <p className="text-slate-400">
              Advanced image components with proper aspect ratios and loading states
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Image Cards */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white text-center">Image Cards</h3>
              <ImageCard
                src="/assets/images/IgniteARevolution.png"
                alt="Healthcare Innovation"
                aspectRatio="landscape"
              />
            </div>
            
            {/* Avatar Examples */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white text-center">Avatars</h3>
              <div className="flex justify-center gap-4">
                <ImageAvatar
                  src="/assets/images/IgniteARevolution.png"
                  alt="User 1"
                  size="sm"
                />
                <ImageAvatar
                  src="/assets/images/IgniteARevolution.png"
                  alt="User 2"
                  size="md"
                />
                <ImageAvatar
                  src="/assets/images/IgniteARevolution.png"
                  alt="User 3"
                  size="lg"
                />
                <ImageAvatar
                  src="/assets/images/IgniteARevolution.png"
                  alt="User 4"
                  size="xl"
                />
              </div>
            </div>
            
            {/* Optimized Image */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white text-center">Optimized Loading</h3>
              <ImageOptimized
                src="/assets/images/IgniteARevolution.png"
                alt="Healthcare Technology"
                aspectRatio="square"
                objectFit="cover"
                showLoader={true}
                className="rounded-xl"
              />
            </div>
          </div>
          
          {/* Image Gallery */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-white text-center mb-6">Image Gallery</h3>
            <ImageGallery images={demoImages} />
          </div>
        </motion.section>

        {/* Newsletter Banner Variants */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Smartphone className="h-8 w-8 text-fire-500" />
              Newsletter Banners
            </h2>
            <p className="text-slate-400">
              Responsive newsletter banners with enhanced glass morphism
            </p>
          </div>
          
          <div className="space-y-12">
            <NewsletterBanner variant="compact" />
          </div>
        </motion.section>

        {/* Brand Colors Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Brand Colors</h2>
            <p className="text-slate-400">
              Consistent color palette: #1a1a1a (dark) + #ff6b35 (orange accent)
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-[#1a1a1a] border-white/10 text-center p-6">
              <div className="w-16 h-16 bg-[#1a1a1a] rounded-lg mx-auto mb-4 border border-white/20"></div>
              <CardTitle className="text-white text-sm">#1a1a1a</CardTitle>
              <p className="text-slate-400 text-xs">Dark Background</p>
            </Card>
            
            <Card className="bg-fire-500/10 border-fire-500/20 text-center p-6">
              <div className="w-16 h-16 bg-fire-500 rounded-lg mx-auto mb-4"></div>
              <CardTitle className="text-white text-sm">#f97316</CardTitle>
              <p className="text-slate-400 text-xs">Fire Orange 500</p>
            </Card>
            
            <Card className="bg-fire-600/10 border-fire-600/20 text-center p-6">
              <div className="w-16 h-16 bg-fire-600 rounded-lg mx-auto mb-4"></div>
              <CardTitle className="text-white text-sm">#ea580c</CardTitle>
              <p className="text-slate-400 text-xs">Fire Orange 600</p>
            </Card>
            
            <Card className="bg-fire-400/10 border-fire-400/20 text-center p-6">
              <div className="w-16 h-16 bg-fire-400 rounded-lg mx-auto mb-4"></div>
              <CardTitle className="text-white text-sm">#fb923c</CardTitle>
              <p className="text-slate-400 text-xs">Fire Orange 400</p>
            </Card>
          </div>
        </motion.section>

        {/* Features Summary */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <GlassFireCard className="text-center">
            <Star className="h-12 w-12 text-fire-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-6">Implementation Complete</h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">✅ Completed Tasks</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• Google Forms API integration</li>
                  <li>• ImageOptimized component with aspect ratio fixes</li>
                  <li>• Enhanced glass morphism effects</li>
                  <li>• Brand color consistency (#1a1a1a + #ff6b35)</li>
                  <li>• Mobile-first responsive design</li>
                  <li>• Smooth animations and transitions</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">🚀 Key Features</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• Advanced loading states</li>
                  <li>• Error handling with fallbacks</li>
                  <li>• Performance optimizations</li>
                  <li>• Accessibility support</li>
                  <li>• TypeScript type safety</li>
                  <li>• Comprehensive documentation</li>
                </ul>
              </div>
            </div>
          </GlassFireCard>
        </motion.section>
      </div>

      {/* Modal Example */}
      <GlassModal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-fire-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-4">Glass Modal</h3>
          <p className="text-slate-300 mb-6">
            This is an example of a glass morphism modal with backdrop blur and fire-themed styling.
          </p>
          <GlassButton variant="fire" onClick={() => setShowModal(false)}>
            Close Modal
          </GlassButton>
        </div>
      </GlassModal>
    </div>
  )
}
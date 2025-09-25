"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useAnimationControls, useInView } from "framer-motion"
import { ImageOptimized } from "@/components/ui/ImageOptimized"
import { 
  Play, 
  MousePointer, 
  Users, 
  Star, 
  ArrowRight, 
  Zap, 
  Clock, 
  Target,
  TrendingUp,
  Award,
  CheckCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface EnhancedHeroProps {
  isVisible?: boolean
  onCtaClick?: () => void
  onExploreClick?: () => void
  showDemo?: boolean
}

export function EnhancedHero({ 
  isVisible = true, 
  onCtaClick, 
  onExploreClick,
  showDemo = true 
}: EnhancedHeroProps) {
  const [clickCount, setClickCount] = useState(0)
  const [showClickDemo, setShowClickDemo] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [statsAnimation, setStatsAnimation] = useState(false)
  
  const heroRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(heroRef, { once: true, margin: "-100px" })
  const controls = useAnimationControls()

  // Simulate click fatigue demonstration
  const handleClickDemo = () => {
    setClickCount(prev => prev + 1)
    if (clickCount >= 5) {
      setShowClickDemo(true)
    }
  }

  // Trust indicators data
  const trustStats = [
    { icon: Users, value: "10,000+", label: "Healthcare Professionals", delay: 0.2 },
    { icon: Clock, value: "87%", label: "Time Reduction", delay: 0.4 },
    { icon: Target, value: "99.9%", label: "Accuracy Rate", delay: 0.6 },
    { icon: TrendingUp, value: "156%", label: "Productivity Boost", delay: 0.8 }
  ]

  // Testimonials data
  const testimonials = [
    {
      text: "Ignite reduced our administrative tasks by 70%. Game-changing!",
      author: "Dr. Sarah Chen",
      role: "Chief Medical Officer",
      company: "Metro Health System",
      avatar: "/assets/images/testimonials/sarah-chen.jpg"
    },
    {
      text: "Finally, technology that actually saves time instead of wasting it.",
      author: "Michael Rodriguez",
      role: "IT Director", 
      company: "Regional Medical Center",
      avatar: "/assets/images/testimonials/michael-rodriguez.jpg"
    },
    {
      text: "Our staff productivity increased 150% within the first month.",
      author: "Dr. Emma Thompson",
      role: "Hospital Administrator",
      company: "Central Valley Medical",
      avatar: "/assets/images/testimonials/emma-thompson.jpg"
    }
  ]

  // Social proof badges
  const certifications = [
    { name: "HIPAA Compliant", icon: Award },
    { name: "SOC 2 Certified", icon: CheckCircle },
    { name: "ISO 27001", icon: Award },
    { name: "FDA Approved", icon: CheckCircle }
  ]

  // Start animations when component becomes visible
  useEffect(() => {
    if (isVisible && isInView) {
      controls.start("visible")
      setStatsAnimation(true)
    }
  }, [isVisible, isInView, controls])

  // Rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  // Animation variants
  const containerVariants = {
    hidden: { 
      opacity: 0,
      background: "linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(26,26,26,0.6) 100%)"
    },
    visible: { 
      opacity: 1,
      background: "linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(26,26,26,0.2) 100%)",
      transition: { 
        duration: 2,
        ease: "easeInOut",
        staggerChildren: 0.2
      }
    }
  }

  const heroContentVariants = {
    hidden: { 
      opacity: 0, 
      y: 60, 
      scale: 0.95,
      filter: "blur(20px)"
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      filter: "blur(0px)",
      transition: { 
        duration: 1.5, 
        ease: [0.33, 1, 0.68, 1],
        delay: 0.3
      }
    }
  }

  const slideUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [-2, 2, -2],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  if (!isVisible) return null

  return (
    <motion.section
      ref={heroRef}
      className="enhanced-hero relative min-h-screen-responsive flex items-center justify-center full-width-constrained motion-container"
      initial="hidden"
      animate={controls}
      variants={containerVariants}
    >
      {/* Background with blur transition */}
      <motion.div 
        className="absolute inset-0 w-full h-full"
        initial={{ filter: "blur(20px)", opacity: 0.6 }}
        animate={{ filter: "blur(5px)", opacity: 0.8 }}
        transition={{ duration: 3, ease: "easeInOut" }}
      >
        <ImageOptimized
          src="/assets/images/IgniteARevolution.png"
          alt="Healthcare Technology Background"
          fill
          objectFit="cover"
          objectPosition="center"
          priority
          quality={95}
          sizes="100vw"
          className="w-full h-full"
        />
        
        {/* Fire gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-orange-900/60 via-red-800/30 to-yellow-600/20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-transparent to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </motion.div>

      {/* Main Content Grid */}
      <div className="hero-content relative z-10 container-responsive">
        <div className="hero-grid items-center">
        
        {/* Left Column - Main Hero Content */}
        <motion.div
          className="text-center lg:text-left full-width-constrained"
          variants={heroContentVariants}
        >
          {/* Problem Statement Badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-red-500/20 border border-red-400/30 rounded-full px-4 py-2 mb-6"
            variants={slideUpVariants}
          >
            <MousePointer className="w-4 h-4 text-red-400" />
            <span className="text-red-200 text-sm font-medium">Click Fatigue Epidemic</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            className="text-hero-responsive font-bold mb-6 leading-none max-w-4xl typography-responsive"
            variants={slideUpVariants}
            style={{
              background: "linear-gradient(135deg, #ff6b35 0%, #ff8c42 25%, #ffd23f 50%, #ff6b35 75%, #ff4757 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 0 30px rgba(255, 107, 53, 0.5), 0 0 60px rgba(255, 71, 87, 0.3)",
              filter: "drop-shadow(0 4px 20px rgba(255, 107, 53, 0.4))"
            }}
          >
            Plagued by click fatigue?
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-subtitle-responsive text-gray-200 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 typography-responsive"
            variants={slideUpVariants}
            style={{ textShadow: "0 2px 10px rgba(0, 0, 0, 0.7)" }}
          >
            Healthcare workers waste <span className="text-orange-400 font-semibold">4.2 hours daily</span> on 
            redundant clicks. Our AI revolution cuts through the noise.
          </motion.p>

          {/* Click Demo Interactive Element */}
          <AnimatePresence>
            {showDemo && (
              <motion.div
                className="mb-8 p-6 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/80 font-medium">Try clicking this button:</span>
                  <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-400/30">
                    Clicks: {clickCount}
                  </Badge>
                </div>
                
                <Button
                  variant="outline"
                  onClick={handleClickDemo}
                  className="w-full mb-4 border-orange-400/50 text-orange-300 hover:bg-orange-500/20"
                  disabled={showClickDemo}
                >
                  {showClickDemo ? "See the problem?" : "Submit Form"}
                </Button>

                {showClickDemo && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center p-4 bg-red-500/20 rounded-lg border border-red-400/30"
                  >
                    <p className="text-red-200 text-sm">
                      You just experienced click fatigue! Healthcare workers do this 
                      <span className="font-bold text-red-100"> thousands of times daily.</span>
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Call-to-Action Buttons */}
          <motion.div
            className="button-group mb-8"
            variants={slideUpVariants}
          >
            <Button
              size="lg"
              onClick={onExploreClick || onCtaClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative group px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
            >
              <motion.span
                className="flex items-center gap-2"
                animate={isHovered ? { x: -5 } : { x: 0 }}
                transition={{ duration: 0.2 }}
              >
                Start Revolution
                <motion.div
                  animate={isHovered ? { x: 5 } : { x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.span>
              
              {/* Button glow effect */}
              <motion.div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%)",
                  backgroundSize: "200% 200%"
                }}
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 border-white/30 text-white hover:bg-white/10 font-medium rounded-xl backdrop-blur-sm"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Social Proof - Certifications */}
          <motion.div
            className="flex flex-wrap justify-center lg:justify-start gap-3"
            variants={slideUpVariants}
          >
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                className="flex items-center gap-2 bg-green-500/20 border border-green-400/30 rounded-full px-3 py-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2 + index * 0.1 }}
              >
                <cert.icon className="w-3 h-3 text-green-400" />
                <span className="text-green-200 text-xs font-medium">{cert.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Column - Interactive Elements & Stats */}
        <motion.div
          className="space-y-8 full-width-constrained"
          variants={heroContentVariants}
        >
          {/* Trust Statistics Cards */}
          <div className="stats-grid">
            {trustStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={statsAnimation ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: stat.delay, duration: 0.6 }}
                variants={floatingVariants}
                whileInView="animate"
                viewport={{ once: true }}
              >
                <Card className="bg-black/40 backdrop-blur-md border-white/10 hover:border-orange-400/50 transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <motion.div
                      className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 flex items-center justify-center"
                      variants={pulseVariants}
                      whileInView="animate"
                      viewport={{ once: true }}
                    >
                      <stat.icon className="w-6 h-6 text-orange-400" />
                    </motion.div>
                    <motion.div
                      className="text-2xl font-bold text-white mb-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: stat.delay + 0.3 }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-sm text-gray-300">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Testimonial Carousel */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <Card className="bg-black/40 backdrop-blur-md border-white/10 overflow-hidden">
              <CardContent className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <div className="flex justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    <blockquote className="text-white/90 mb-4 italic">
                      "{testimonials[currentTestimonial].text}"
                    </blockquote>
                    
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-red-400 flex items-center justify-center text-white font-semibold">
                        {testimonials[currentTestimonial].author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="text-left">
                        <div className="text-white font-medium text-sm">
                          {testimonials[currentTestimonial].author}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {testimonials[currentTestimonial].role}, {testimonials[currentTestimonial].company}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Testimonial indicators */}
                <div className="flex justify-center gap-2 mt-4">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentTestimonial 
                          ? 'bg-orange-400 w-6' 
                          : 'bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Before/After Demo Teaser */}
          <motion.div
            className="relative group cursor-pointer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowClickDemo(true)}
          >
            <Card className="bg-gradient-to-r from-red-500/20 to-green-500/20 border-transparent overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white font-semibold">Workflow Comparison</span>
                  <Zap className="w-5 h-5 text-yellow-400" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="space-y-2">
                    <div className="text-red-300 font-medium">Before Ignite</div>
                    <div className="text-3xl font-bold text-red-400">847</div>
                    <div className="text-xs text-red-200">clicks per task</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-green-300 font-medium">With Ignite</div>
                    <div className="text-3xl font-bold text-green-400">3</div>
                    <div className="text-xs text-green-200">clicks per task</div>
                  </div>
                </div>
                
                <motion.div
                  className="mt-4 text-center text-white/70 text-sm group-hover:text-white transition-colors"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Click to see interactive demo →
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100, -20],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
    </motion.section>
  )
}
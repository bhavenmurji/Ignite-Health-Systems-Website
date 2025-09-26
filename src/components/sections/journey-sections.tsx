'use client';

import React, { useRef, useEffect, useState, memo, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  HeartIcon, 
  LightBulbIcon, 
  SparklesIcon, 
  FireIcon, 
  StarIcon,
  ArrowRightIcon,
  PlayIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

// Journey Stage Data
const journeyStages = [
  {
    id: 'recognition',
    title: 'Problem Recognition',
    subtitle: 'The Weight of What Is',
    description: 'Every healthcare hero reaches a moment where the system\'s burdens become impossible to ignore.',
    content: 'You feel it in the late nights, the endless documentation, the disconnect from why you chose healthcare. The spark that once drove you feels dimmed by bureaucracy and burnout.',
    icon: HeartIcon,
    color: 'from-gray-600 to-gray-800',
    accentColor: 'text-red-400',
    image: '/assets/images/BhavenMurjiNeedsACoFounder.png',
    testimonial: {
      quote: "The documentation burden was consuming my time with patients. I realized I needed to reclaim the joy of nursing.",
      author: "Dr. Sarah Martinez, RN",
      role: "Critical Care Nurse, 8 years"
    },
    stats: {
      primary: "75%",
      secondary: "of healthcare professionals report documentation impedes patient care",
      source: "AMIA 25x5 Task Force Survey, 2024",
      link: "/assets/AcademicPapers/documentation-burden-analysis.md"
    },
    cta: "I recognize this feeling"
  },
  {
    id: 'awakening',
    title: 'Awakening',
    subtitle: 'The Spark Ignites',
    description: 'Something stirs within. A realization that you have more power than you knew.',
    content: 'It starts small - a moment of clarity, a conversation with a colleague, or witnessing someone who still has that fire. You begin to see that change isn\'t just possible, it\'s necessary.',
    icon: LightBulbIcon,
    color: 'from-amber-600 to-orange-700',
    accentColor: 'text-amber-400',
    image: '/assets/images/NeuralNetwork.png',
    testimonial: {
      quote: "The moment I realized I could be part of the solution instead of just complaining about the problems.",
      author: "Dr. Marcus Williams",
      role: "Emergency Physician, 12 years"
    },
    stats: {
      primary: "99%",
      secondary: "physician satisfaction improvement under Direct Primary Care model",
      source: "Society of Actuaries Study, 2020",
      link: "/assets/AcademicPapers/DPC Market Growth Validation.md"
    },
    cta: "I'm ready to awaken"
  },
  {
    id: 'transformation',
    title: 'Transformation',
    subtitle: 'The Inner Work',
    description: 'True revolution begins within. You start reshaping your relationship with your calling.',
    content: 'You discover tools, communities, and approaches that reignite your purpose. Each small change builds momentum. You\'re not just surviving your work - you\'re thriving in it.',
    icon: SparklesIcon,
    color: 'from-blue-600 to-indigo-700',
    accentColor: 'text-blue-400',
    image: '/assets/images/RocketOnHorsevsNewCar.png',
    testimonial: {
      quote: "I found my voice again. I remembered why I became a therapist and how to make a real difference.",
      author: "Lisa Rodriguez, PT",
      role: "Physical Therapist, 15 years"
    },
    stats: {
      primary: "43.2%",
      secondary: "of physicians reported burnout symptoms in 2024 - transformation reduces this",
      source: "National Academy Study, 2024",
      link: "/assets/AcademicPapers/documentation-burden-analysis.md"
    },
    cta: "Begin my transformation"
  },
  {
    id: 'revolution',
    title: 'Revolution',
    subtitle: 'The Fire Spreads',
    description: 'Your inner transformation becomes an outer force. You\'re no longer just changed - you\'re changing everything around you.',
    content: 'You become the leader you always had within you. Your team feels it. Your patients see it. The revolution you started in your heart is now transforming your entire workplace.',
    icon: FireIcon,
    color: 'from-red-600 to-pink-700',
    accentColor: 'text-red-400',
    image: '/assets/images/IgniteARevolution.png',
    testimonial: {
      quote: "I went from burned out to lighting fires of change in everyone around me. I'm leading the revolution I wanted to see.",
      author: "Dr. James Patterson",
      role: "Chief of Medicine, Children's Hospital"
    },
    stats: {
      primary: "70%",
      secondary: "of DPC practices established in last 4 years - rapid leadership-driven expansion",
      source: "Society of Actuaries Analysis, 2020",
      link: "/assets/AcademicPapers/DPC Market Growth Validation.md"
    },
    cta: "Lead the revolution"
  },
  {
    id: 'new-reality',
    title: 'New Reality',
    subtitle: 'The Revolution Complete',
    description: 'You\'ve not just changed your career - you\'ve revolutionized healthcare, one heart at a time.',
    content: 'This is who you always were meant to be. A healthcare revolutionary who transforms not just patients, but the entire system. Your journey inspires others to find their own revolution within.',
    icon: StarIcon,
    color: 'from-purple-600 to-indigo-800',
    accentColor: 'text-purple-400',
    image: '/assets/images/ProofOfConceptFinalVision.png',
    testimonial: {
      quote: "I'm not the same person who started this journey. I'm the healthcare leader I was always meant to be.",
      author: "Dr. Amanda Foster",
      role: "Healthcare Innovation Director"
    },
    stats: {
      primary: "∞",
      secondary: "potential when you discover the revolution within"
    },
    cta: "Discover your revolution"
  }
];

// Individual Journey Stage Component
const JourneyStage: React.FC<{
  stage: typeof journeyStages[0];
  index: number;
  isActive: boolean;
  progress: number;
}> = ({ stage, index, isActive, progress }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (stageRef.current) {
      observer.observe(stageRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const IconComponent = stage.icon;

  return (
    <motion.div
      ref={stageRef}
      className="relative min-h-screen flex items-center justify-center py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 1 }}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${stage.image})` }}
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${stage.color} opacity-85`} />
        <div className="absolute inset-0 bg-black opacity-40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            className="text-white space-y-8"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Stage Number */}
            <div className="flex items-center space-x-4">
              <motion.div
                className="w-16 h-16 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-2xl font-bold">{index + 1}</span>
              </motion.div>
              <div className="h-1 flex-1 bg-white bg-opacity-20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: isVisible ? `${(index + 1) * 20}%` : 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>

            {/* Icon and Title */}
            <div className="space-y-4">
              <motion.div
                className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${stage.color} ring-4 ring-white ring-opacity-20`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <IconComponent className={`w-10 h-10 ${stage.accentColor}`} />
              </motion.div>

              <div>
                <motion.h2
                  className="text-5xl font-bold mb-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: isVisible ? 0 : 20, opacity: isVisible ? 1 : 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {stage.title}
                </motion.h2>
                <motion.p
                  className={`text-xl ${stage.accentColor} font-medium`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: isVisible ? 0 : 20, opacity: isVisible ? 1 : 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  {stage.subtitle}
                </motion.p>
              </div>
            </div>

            {/* Description */}
            <motion.p
              className="text-xl leading-relaxed text-gray-100"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: isVisible ? 0 : 20, opacity: isVisible ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {stage.description}
            </motion.p>

            {/* Expandable Content */}
            <motion.div
              className="space-y-6"
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: showDetails ? 'auto' : 0, 
                opacity: showDetails ? 1 : 0 
              }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-lg text-gray-200 leading-relaxed">
                {stage.content}
              </p>

              {/* Stats */}
              <motion.div 
                className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 cursor-pointer hover:bg-opacity-20 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (stage.stats.link) {
                    // For now, show an alert with the source. In production, this would navigate to the paper
                    alert(`Source: ${stage.stats.source}\n\nThis statistic comes from peer-reviewed research. Click to learn more about the methodology and findings.`);
                  }
                }}
              >
                <div className="text-center">
                  <div className={`text-4xl font-bold ${stage.accentColor} mb-2`}>
                    {stage.stats.primary}
                  </div>
                  <div className="text-sm text-gray-200 mb-2">
                    {stage.stats.secondary}
                  </div>
                  {stage.stats.source && (
                    <div className="text-xs text-gray-300 opacity-75 flex items-center justify-center space-x-1">
                      <span>📊 {stage.stats.source}</span>
                      <span className="text-blue-300">• Click for details</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>

            {/* Toggle Details Button */}
            <motion.button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors duration-200"
              whileHover={{ x: 10 }}
            >
              <span>{showDetails ? 'Show Less' : 'Learn More'}</span>
              <motion.div
                animate={{ rotate: showDetails ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDownIcon className="w-5 h-5" />
              </motion.div>
            </motion.button>

            {/* CTA Button */}
            <motion.button
              className={`bg-gradient-to-r ${stage.color} hover:opacity-90 text-white px-8 py-4 rounded-full font-semibold flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: isVisible ? 0 : 20, opacity: isVisible ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <span>{stage.cta}</span>
              <ArrowRightIcon className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Right Content - Testimonial */}
          <motion.div
            className="space-y-8"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: isVisible ? 0 : 100, opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Testimonial Card */}
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
              <div className="space-y-6">
                {/* Quote */}
                <div className="relative">
                  <div className="text-6xl text-white opacity-20 absolute -top-4 -left-2">"</div>
                  <p className="text-lg text-white leading-relaxed relative z-10 pl-8">
                    {stage.testimonial.quote}
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-800 font-bold text-lg">
                      {stage.testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {stage.testimonial.author}
                    </div>
                    <div className="text-sm text-gray-200">
                      {stage.testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Element */}
            <motion.div
              className="bg-black bg-opacity-30 backdrop-blur-sm rounded-xl p-6 cursor-pointer hover:bg-opacity-40 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-semibold mb-1">
                    Watch {stage.testimonial.author}'s Story
                  </h4>
                  <p className="text-gray-300 text-sm">
                    3 min video journey
                  </p>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <PlayIcon className="w-6 h-6 text-white ml-1" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      {index < journeyStages.length - 1 && (
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDownIcon className="w-8 h-8 text-white opacity-60" />
        </motion.div>
      )}
    </motion.div>
  );
};

// Main Journey Sections Component
const JourneySections: React.FC = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      const stageIndex = Math.floor(latest * journeyStages.length);
      setCurrentStage(Math.min(stageIndex, journeyStages.length - 1));
    });

    return unsubscribe;
  }, [scrollYProgress]);

  return (
    <div ref={containerRef} className="relative">
      {/* Fixed Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500 z-50"
        style={{ scaleX: scrollYProgress }}
        initial={{ scaleX: 0 }}
      />

      {/* Journey Navigation */}
      <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
        <div className="space-y-4">
          {journeyStages.map((stage, index) => (
            <motion.div
              key={stage.id}
              className={`w-4 h-4 rounded-full cursor-pointer transition-all duration-200 ${
                index === currentStage 
                  ? 'bg-white shadow-lg scale-125' 
                  : 'bg-white bg-opacity-30 hover:bg-opacity-60'
              }`}
              whileHover={{ scale: 1.2 }}
              onClick={() => {
                const element = document.getElementById(stage.id);
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-red-900 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-red-400 rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.6, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 3
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto px-4">
          <motion.h1
            className="text-6xl md:text-8xl font-bold text-white mb-6"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            The Revolution
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">
              {' '}Within
            </span>
          </motion.h1>
          
          <motion.p
            className="text-2xl md:text-3xl text-gray-300 leading-relaxed"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Every healthcare hero has a moment when they discover the power to transform 
            not just their practice, but themselves
          </motion.p>

          <motion.div
            className="pt-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <button
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-12 py-6 rounded-full text-xl font-semibold transition-all duration-200 shadow-2xl hover:shadow-red-500/25"
              onClick={() => {
                document.getElementById('recognition')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Begin Your Journey
            </button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDownIcon className="w-8 h-8 text-white opacity-60" />
        </motion.div>
      </motion.div>

      {/* Journey Stages */}
      {journeyStages.map((stage, index) => (
        <div key={stage.id} id={stage.id}>
          <JourneyStage
            stage={stage}
            index={index}
            isActive={index === currentStage}
            progress={scrollYProgress.get()}
          />
        </div>
      ))}

      {/* Final CTA Section */}
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-black relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="text-center space-y-8 max-w-4xl mx-auto px-4">
          <motion.h2
            className="text-5xl md:text-7xl font-bold text-white mb-6"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Your Revolution
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              {' '}Starts Now
            </span>
          </motion.h2>
          
          <motion.p
            className="text-xl text-gray-300 leading-relaxed mb-12"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join thousands of healthcare professionals who have discovered the power within themselves 
            to transform their practice, their teams, and their industry.
          </motion.p>

          <motion.div
            className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200 shadow-xl hover:shadow-purple-500/25 w-full sm:w-auto">
              Start My Revolution
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200 w-full sm:w-auto">
              Learn More
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
});

export default JourneySections;
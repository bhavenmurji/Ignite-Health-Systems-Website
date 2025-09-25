"use client"

import type React from "react"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqData = [
  {
    question: "What is Pointer and who is it for?",
    answer:
      "Pointer is an AI-powered development platform designed for developers, teams, and organizations who want toaccelerate their coding workflow. It's perfect for both individual developers looking to enhance their productivity and teams seeking seamless collaboration tools.",
  },
  {
    question: "How does Pointer's AI code review work?",
    answer:
      "Our AI analyzes your code in real-time, providing intelligent suggestions for improvements, catching potential bugs, and ensuring best practices. It learns from your coding patterns and adapts to your team's standards, making code reviews faster and more consistent.",
  },
  {
    question: "Can I integrate Pointer with my existing tools?",
    answer:
      "Yes! Pointer offers one-click integrations with popular development tools including GitHub, GitLab, VS Code, Slack, and many more. Our MCP connectivity allows you to easily manage and configure server access across your entire development stack.",
  },
  {
    question: "What's included in the free plan?",
    answer:
      "The free plan includes real-time code suggestions, basic integrations, single MCP server connection, up to 2 AI coding agents, and Vercel deployments with Pointer branding. It's perfect for individual developers getting started.",
  },
  {
    question: "How do parallel coding agents work?",
    answer:
      "Our parallel coding agents can work on different parts of your codebase simultaneously, solving complex problems faster than traditional single-threaded approaches. You can launch multiple agents to handle different tasks like bug fixes, feature development, and code optimization concurrently.",
  },
  {
    question: "Is my code secure with Pointer?",
    answer:
      "Absolutely. We use enterprise-grade security measures including end-to-end encryption, secure data transmission, and compliance with industry standards. Your code never leaves your secure environment without your explicit permission, and we offer on-premises deployment options for enterprise customers.",
  },
]

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}

const FAQItem = ({ question, answer, isOpen, onToggle }: FAQItemProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onToggle()
  }
  return (
    <div
      className={`w-full card-enhanced hover:shadow-lg transition-all duration-500 ease-out cursor-pointer group ${isOpen ? 'ring-1 ring-primary/20' : ''}`}
      onClick={handleClick}
    >
      {/* Enhanced Question Header */}
      <div className="w-full px-6 py-5 flex justify-between items-center gap-6 text-left transition-all duration-300 ease-out">
        <div className="flex-1">
          <h3 className="heading-5 text-foreground group-hover:text-foreground transition-colors duration-300">
            {question}
          </h3>
        </div>
        <div className="flex justify-center items-center">
          <ChevronDown
            className={`w-6 h-6 text-muted-foreground group-hover:text-foreground-muted transition-all duration-500 ease-out ${isOpen ? "rotate-180 scale-110 text-primary" : "rotate-0 scale-100"}`}
          />
        </div>
      </div>
      
      {/* Enhanced Answer Section */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
        style={{
          transitionProperty: "max-height, opacity, padding",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div
          className={`px-6 transition-all duration-500 ease-out ${isOpen ? "pb-6 pt-2 translate-y-0" : "pb-0 pt-0 -translate-y-2"}`}
        >
          <div className="body-base text-foreground-muted leading-relaxed">
            {answer}
          </div>
        </div>
      </div>
    </div>
  )
}

export function FAQSection() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())
  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }
  return (
    <section className="w-full pt-[66px] pb-20 md:pb-40 px-5 relative flex flex-col justify-center items-center">
      <div className="w-[300px] h-[500px] absolute top-[150px] left-1/2 -translate-x-1/2 origin-top-left rotate-[-33.39deg] bg-primary/10 blur-[100px] z-0" />
      {/* Enhanced Section Header */}
      <div className="self-stretch section-spacing flex flex-col justify-center items-center relative z-10">
        <div className="flex flex-col items-center gap-6 max-w-4xl mx-auto">
          <h2 className="heading-2 text-center max-w-[435px]">
            Frequently Asked Questions
          </h2>
          <div className="max-w-2xl">
            <p className="body-large text-center">
              Everything you need to know about Pointer and how it can transform your development workflow
            </p>
          </div>
        </div>
        
        {/* Visual Separator */}
        <div className="divider max-w-xs mx-auto mt-8" />
      </div>
      {/* Enhanced FAQ List */}
      <div className="w-full max-w-4xl pt-0.5 pb-12 md:pb-16 flex flex-col gap-6 relative z-10">
        {faqData.map((faq, index) => (
          <FAQItem key={index} {...faq} isOpen={openItems.has(index)} onToggle={() => toggleItem(index)} />
        ))}
      </div>
    </section>
  )
}

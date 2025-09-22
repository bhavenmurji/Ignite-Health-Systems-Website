"use client"

import type React from "react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Flame, ChevronUp } from "lucide-react"
import Link from "next/link"
import { useSmoothScroll } from "@/hooks/use-smooth-scroll"
import { cn } from "@/lib/utils"

export function Header() {
  const { scrollToElement, isScrolling, activeSection } = useSmoothScroll()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { name: "The Platform", href: "#platform", id: "platform" },
    { name: "Our Approach", href: "#approach", id: "approach" },
    { name: "The Founder", href: "#founder", id: "founder" },
    { name: "Join the Movement", href: "#join", id: "join" }
  ]

  // Handle scroll visibility and scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Header visibility logic
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      
      // Scroll to top button visibility
      setShowScrollTop(currentScrollY > 600)
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        const keyMap: { [key: string]: string } = {
          '1': '#platform',
          '2': '#approach', 
          '3': '#founder',
          '4': '#join',
          't': 'top'
        }
        
        if (keyMap[e.key]) {
          e.preventDefault()
          if (e.key === 't') {
            scrollToTop()
          } else {
            handleScroll(e as any, keyMap[e.key])
          }
        }
      }
      
      // ESC to close mobile menu
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement> | KeyboardEvent, href: string) => {
    e.preventDefault()
    setIsMenuOpen(false) // Close mobile menu on navigation
    
    scrollToElement(href, {
      duration: 1000,
      easing: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
      offset: 80
    })
  }

  const scrollToTop = () => {
    scrollToElement(document.body, {
      duration: 800,
      offset: 0
    })
  }

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full py-4 px-6 backdrop-blur-md bg-background/80 border-b border-border/40 transition-all duration-300 ease-in-out",
        isVisible ? "translate-y-0" : "-translate-y-full",
        isScrolling && "pointer-events-none"
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Flame className="h-6 w-6 text-primary" />
              <span className="text-foreground text-xl font-semibold">Ignite Health Systems</span>
            </div>
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleScroll(e, item.href)}
                  className={cn(
                    "relative px-4 py-2 rounded-full font-medium transition-all duration-200 ease-in-out focus-ring",
                    "hover:text-foreground hover:bg-primary/10 hover:scale-105",
                    activeSection === item.id
                      ? "text-primary bg-primary/10 shadow-sm"
                      : "text-muted-foreground"
                  )}
                  title={`Navigate to ${item.name} (Alt+${navItems.indexOf(item) + 1})`}
                >
                  {item.name}
                  {activeSection === item.id && (
                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
                  )}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#join" onClick={(e) => handleScroll(e, "#join")} className="hidden md:block">
              <Button className="bg-primary text-primary-foreground hover:bg-primary-dark px-6 py-2 rounded-full font-medium shadow-sm hover:scale-105 transition-all duration-200 focus-ring">
                Join the Movement
              </Button>
            </Link>
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-foreground focus-ring">
                  <Menu className="h-7 w-7" />
                  <span className="sr-only">Toggle navigation menu (Press Escape to close)</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="bg-background border-t border-border text-foreground">
                <SheetHeader>
                  <SheetTitle className="text-left text-xl font-semibold text-foreground">Navigation</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-6">
                  {navItems.map((item, index) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={(e) => handleScroll(e, item.href)}
                      className={cn(
                        "flex items-center justify-between py-3 px-2 rounded-lg text-lg transition-all duration-200 focus-ring",
                        "hover:text-foreground hover:bg-primary/10",
                        activeSection === item.id
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground"
                      )}
                    >
                      <span>{item.name}</span>
                      <span className="text-xs text-muted-foreground">Alt+{index + 1}</span>
                    </Link>
                  ))}
                  <Link href="#join" onClick={(e) => handleScroll(e, "#join")} className="w-full mt-4">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary-dark px-6 py-2 rounded-full font-medium shadow-sm focus-ring">
                      Join the Movement
                    </Button>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={cn(
            "fixed bottom-6 right-6 z-40 p-3 bg-primary text-primary-foreground rounded-full shadow-lg",
            "hover:bg-primary-dark hover:scale-110 transition-all duration-300 focus-ring",
            "animate-in slide-in-from-bottom-2 fade-in-0"
          )}
          title="Scroll to top (Alt+T)"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
      
      {/* Keyboard shortcuts help */}
      <div className="sr-only" aria-live="polite">
        Use Alt+1-4 to navigate sections, Alt+T to scroll to top, Escape to close menu
      </div>
    </>
  )
}
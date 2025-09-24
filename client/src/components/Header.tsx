import { Link, useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './ThemeToggle'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import igniteLogo from '@assets/Ignite Logo_1758739687681.png'

const navigation = [
  { name: 'Platform', href: '/platform' },
  { name: 'About Dr. Murji', href: '/about' },
  { name: 'Episodes', href: '/episodes' },
]

export function Header() {
  const [location] = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-3 hover-elevate px-2 py-1 rounded-md">
              <img 
                src={igniteLogo} 
                alt="Ignite Health Systems Logo" 
                className="h-8 w-8 object-contain"
              />
              <span className="font-semibold text-lg">Ignite Health</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} data-testid={`link-${item.name.toLowerCase().replace(' ', '-')}`}>
                <span className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === item.href ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Button data-testid="button-join-council">
              Join Innovation Council
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background py-4">
            <nav className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href} data-testid={`link-mobile-${item.name.toLowerCase().replace(' ', '-')}`}>
                  <span className={`text-sm font-medium transition-colors hover:text-primary ${
                    location === item.href ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {item.name}
                  </span>
                </Link>
              ))}
              <Button className="mt-4" data-testid="button-join-council-mobile">
                Join Innovation Council
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
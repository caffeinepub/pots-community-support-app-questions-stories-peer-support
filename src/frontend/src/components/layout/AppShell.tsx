import { Outlet, Link, useNavigate } from '@tanstack/react-router';
import { Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import LoginButton from '../auth/LoginButton';
import ProfileSetupDialog from '../auth/ProfileSetupDialog';

export default function AppShell() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ProfileSetupDialog />
      
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
              <img 
                src="/assets/generated/pots-mark.dim_512x512.png" 
                alt="POTS Community" 
                className="h-8 w-8 rounded-lg"
              />
              <span className="hidden sm:inline">POTS Community</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/' })}
              >
                Feed
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/create' })}
              >
                Share
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/guidelines' })}
              >
                Guidelines
              </Button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <LoginButton />
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t">
            <nav className="container py-4 flex flex-col gap-2">
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => {
                  navigate({ to: '/' });
                  setMobileMenuOpen(false);
                }}
              >
                Feed
              </Button>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => {
                  navigate({ to: '/create' });
                  setMobileMenuOpen(false);
                }}
              >
                Share
              </Button>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => {
                  navigate({ to: '/guidelines' });
                  setMobileMenuOpen(false);
                }}
              >
                Guidelines
              </Button>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p className="flex items-center gap-1.5">
            © 2026. Built with <Heart className="h-4 w-4 text-primary fill-primary" /> using{' '}
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-center md:text-right">
            A supportive space for the POTS community
          </p>
        </div>
      </footer>
    </div>
  );
}

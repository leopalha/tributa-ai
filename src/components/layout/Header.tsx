import { Bell, Search, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { UserNav } from '@/components/layout/user-nav';
import Link from '@/components/ui/custom-link';
import { ObligationsNotifications } from '../fiscal/ObligationsNotifications';
import { Notifications } from './Notifications';
import { Logo } from '@/components/ui/logo';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo />
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/dashboard" className="transition-colors hover:text-foreground/80">
              Dashboard
            </Link>
            <Link
              href="/dashboard/recuperacao"
              className="transition-colors hover:text-foreground/80"
            >
              Recuperação
            </Link>
            <Link
              href="/dashboard/marketplace"
              className="transition-colors hover:text-foreground/80"
            >
              Marketplace Universal
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Notifications />
          <ObligationsNotifications />
          <UserNav />
        </div>
      </div>
    </header>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';
import { Skeleton } from '@/components/ui/skeleton';

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[hsl(var(--background))]/95 backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--background))]/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="text-xl font-heading tracking-tight font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              {siteConfig.name}
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {siteConfig.mainNav.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'transition-colors hover:text-[hsl(var(--primary))]',
                  pathname === item.href
                    ? 'text-[hsl(var(--foreground))] font-semibold'
                    : 'text-[hsl(var(--muted-foreground))]'
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search component will go here */}
          </div>
          <nav className="flex items-center space-x-2">
            <ThemeToggle />

            {status === 'loading' && <Skeleton className="h-8 w-8 rounded-full" />}

            {status === 'authenticated' && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8 ring-2 ring-primary/10 transition-all hover:ring-primary/30">
                      <AvatarImage src={user.image || ''} alt={user.name || ''} />
                      <AvatarFallback className="bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]">
                        {user.name
                          ?.split(' ')
                          .map((n: string) => n[0])
                          .join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name || 'Usuário'}</p>
                      <p className="text-xs leading-none text-[hsl(var(--muted-foreground))]">
                        {user.email || 'Email não disponível'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center cursor-pointer">
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/tc" className="flex items-center cursor-pointer">
                      <span>Meus TCs</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center cursor-pointer">
                      <span>Configurações</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-[hsl(var(--destructive))] focus:text-[hsl(var(--destructive))]"
                    onClick={() => signOut({ callbackUrl: '/login' })}
                  >
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {status === 'unauthenticated' && (
              <Button asChild variant="default" size="sm" className="gap-1">
                <Link href="/login">Entrar</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

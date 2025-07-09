import Link from '@/components/ui/custom-link';
import { usePathname } from '@/lib/router-utils';
import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  disabled?: boolean;
  external?: boolean;
}

interface SideNavProps {
  items: NavItem[];
  className?: string;
}

export function SideNav({ items, className }: SideNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn('flex flex-col space-y-1', className)}>
      {items.map(item => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]',
              pathname === item.href
                ? 'bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]'
                : 'transparent',
              item.disabled && 'pointer-events-none opacity-60'
            )}
          >
            {Icon && <Icon className="mr-2 h-4 w-4" />}
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}

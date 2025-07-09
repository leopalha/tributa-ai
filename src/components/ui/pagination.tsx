import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingsCount?: number;
}

// Componentes adicionais para compatibilidade
export const PaginationContent = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center space-x-2', className)} {...props} />
  )
);
PaginationContent.displayName = 'PaginationContent';

export const PaginationItem = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('', className)} {...props} />
);
PaginationItem.displayName = 'PaginationItem';

export const PaginationLink = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & {
    isActive?: boolean;
  }
>(({ className, isActive, ...props }, ref) => (
  <Button
    ref={ref}
    variant={isActive ? 'default' : 'outline'}
    size="icon"
    className={cn('h-8 w-8', className)}
    {...props}
  />
));
PaginationLink.displayName = 'PaginationLink';

export const PaginationPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => (
  <Button ref={ref} variant="outline" size="icon" className={cn('h-8 w-8', className)} {...props}>
    <ChevronLeft className="h-4 w-4" />
  </Button>
));
PaginationPrevious.displayName = 'PaginationPrevious';

export const PaginationNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => (
  <Button ref={ref} variant="outline" size="icon" className={cn('h-8 w-8', className)} {...props}>
    <ChevronRight className="h-4 w-4" />
  </Button>
));
PaginationNext.displayName = 'PaginationNext';

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingsCount = 1,
}: PaginationProps) {
  // Generate page numbers to display
  const generatePagination = () => {
    // Always show first page
    const firstPage = 1;
    // Always show last page
    const lastPage = totalPages;

    // Pages to show before current page
    let leftSiblingIndex = Math.max(currentPage - siblingsCount, firstPage);
    // Pages to show after current page
    let rightSiblingIndex = Math.min(currentPage + siblingsCount, lastPage);

    // Determine if we should show ellipsis
    const shouldShowLeftDots = leftSiblingIndex > firstPage + 1;
    const shouldShowRightDots = rightSiblingIndex < lastPage - 1;

    // Pages array
    const pageNumbers: (number | string)[] = [];

    // Add first page
    pageNumbers.push(firstPage);

    // Add left ellipsis if needed
    if (shouldShowLeftDots) {
      pageNumbers.push('...');
    }

    // Add sibling pages and current page
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i !== firstPage && i !== lastPage) {
        pageNumbers.push(i);
      }
    }

    // Add right ellipsis if needed
    if (shouldShowRightDots) {
      pageNumbers.push('...');
    }

    // Add last page if more than one page
    if (lastPage > firstPage) {
      pageNumbers.push(lastPage);
    }

    return pageNumbers;
  };

  const pages = generatePagination();

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        title="Primeira página"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        title="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center space-x-1">
        {pages.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="mx-1 text-gray-400">
                ...
              </span>
            );
          }

          const pageNumber = page as number;
          return (
            <Button
              key={pageNumber}
              variant={currentPage === pageNumber ? 'default' : 'outline'}
              size="icon"
              onClick={() => onPageChange(pageNumber)}
              className="h-8 w-8"
            >
              {pageNumber}
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        title="Próxima página"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        title="Última página"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

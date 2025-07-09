import React from 'react';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

const PaginationComponent = React.forwardRef<HTMLDivElement, PaginationProps>(
  ({ currentPage, totalPages, onPageChange, maxVisiblePages = 5, className, ...props }, ref) => {
    const getPageNumbers = () => {
      const pages: (number | string)[] = [];
      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        const half = Math.floor((maxVisiblePages - 2) / 2);
        pages.push(1);
        if (currentPage > 1 + half + 1) {
          pages.push('...');
        }
        const start = Math.max(2, currentPage - half);
        const end = Math.min(totalPages - 1, currentPage + half);
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
        if (currentPage < totalPages - half - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
      return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-center space-x-2', className)}
        {...props}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pageNumbers.map((page, index) => (
          <React.Fragment key={index}>
            {typeof page === 'number' ? (
              <Button
                variant={currentPage === page ? 'default' : 'outline'}
                size="icon"
                onClick={() => onPageChange(page)}
                aria-label={`Go to page ${page}`}
              >
                {page}
              </Button>
            ) : (
              <span className="flex h-9 w-9 items-center justify-center">
                <MoreHorizontal className="h-4 w-4" />
              </span>
            )}
          </React.Fragment>
        ))}

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }
);
PaginationComponent.displayName = 'PaginationComponent';

export { PaginationComponent };

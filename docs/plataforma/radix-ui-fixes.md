# Radix UI Infinite Loop Fixes

This document explains the fixes implemented to address the "Maximum update depth exceeded" errors that occur with Radix UI components.

## The Problem

Radix UI components can sometimes create infinite rendering loops due to their ref handling mechanism:

1. The error appears as: `Error: Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.`
2. The root cause is related to `@radix-ui/react-compose-refs` which can trigger too many state updates when refs are forwarded.
3. This most commonly occurs with components like Popover, Dialog, and Select when they're being rendered conditionally or have state changes that affect their visibility.

## The Solution

We've created several utility components to fix this issue:

### 1. `SafeRefWrapper`

A component that safely handles refs to prevent infinite loops:

```tsx
// src/components/ui/safe-ref-wrapper.tsx
import React, { useRef } from 'react';

export function SafeRefWrapper<T extends HTMLElement>({
  children,
}: {
  children: React.ReactNode;
}) {
  const stableRef = useRef<T | null>(null);
  const updateScheduled = useRef(false);
  
  const safeRef = React.useCallback((node: T | null) => {
    if (node !== stableRef.current && !updateScheduled.current) {
      updateScheduled.current = true;
      requestAnimationFrame(() => {
        stableRef.current = node;
        updateScheduled.current = false;
      });
    }
  }, []);
  
  return React.cloneElement(React.Children.only(children) as React.ReactElement, {
    ref: safeRef,
  });
}
```

### 2. Safe Radix Components

We've created safe versions of commonly used Radix UI components:

```tsx
// Import and use these instead of the regular Radix UI components
import { 
  SafePopover,
  SafePopoverTrigger,
  SafeDrawer,
  SafeDrawerTrigger,
  SafeSelect,
  SafeSelectTrigger
} from '@/components/ui/safe-radix-components';

// Use them like this:
<SafePopover>
  <SafePopoverTrigger>Open</SafePopoverTrigger>
  <PopoverContent>Content</PopoverContent>
</SafePopover>
```

## How to Fix Infinite Loop Errors

If you encounter "Maximum update depth exceeded" errors:

1. Look for Radix UI components in the error stack trace (usually in PopoverTrigger, Dialog, Select, etc.)
2. Replace those components with our safe versions:

```tsx
// Before:
<Popover>
  <PopoverTrigger>Trigger</PopoverTrigger>
  <PopoverContent>Content</PopoverContent>
</Popover>

// After:
<SafePopover>
  <SafePopoverTrigger>Trigger</SafePopoverTrigger>
  <PopoverContent>Content</PopoverContent>
</SafePopover>
```

3. Also ensure:
   - All buttons have `type="button"` attribute
   - Event handlers use `useCallback` to prevent recreation on each render
   - Avoid state updates inside effects that would trigger re-renders

## Running the Fix Scripts

We've added scripts to help fix HTML and CSS issues:

```bash
# Fix button type attributes and form field ids
npm run fix:html

# Fix CSS vendor prefixes order
npm run fix:css

# Run both scripts
npm run fix:all
```

## Additional Notes

- The infinite loop often appears in complex UIs with multiple state updates
- Components that conditionally render Radix UI elements are particularly prone to this issue
- Using our safe components isolates the ref handling problem and prevents cascading state updates 
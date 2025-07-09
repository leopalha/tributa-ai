import { createSafeComponent } from '@/components/ui/safe-ref-wrapper';
import * as React from 'react';

/**
 * Utility to create safe versions of Radix UI components that fix infinite loop issues.
 *
 * This function applies our SafeRefWrapper to components that would otherwise create
 * infinite loops due to ref handling issues.
 *
 * @example
 * // Create safe versions of Popover components
 * const { Root: SafePopover, Trigger: SafePopoverTrigger } = createSafeRadixComponents({
 *   Root: Popover,
 *   Trigger: PopoverTrigger,
 * });
 */
export function createSafeRadixComponents<T extends Record<string, React.ComponentType<any>>>(
  components: T
): { [K in keyof T]: React.ComponentType<React.ComponentProps<T[K]>> } {
  const result = {} as { [K in keyof T]: React.ComponentType<React.ComponentProps<T[K]>> };

  for (const key in components) {
    result[key] = createSafeComponent(components[key]);
  }

  return result;
}

/**
 * Helper to apply the SafeRefWrapper to a single Radix UI component.
 *
 * @example
 * // Create a safe version of Dialog.Root
 * const SafeDialog = createSafeRadixComponent(Dialog.Root);
 */
export function createSafeRadixComponent<T extends React.ComponentType<any>>(
  component: T
): React.ComponentType<React.ComponentProps<T>> {
  return createSafeComponent(component);
}

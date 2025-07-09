import { createSafeRadixComponents } from '@/utils/radix-fix';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as DrawerPrimitive from '@radix-ui/react-dialog'; // Drawer uses Dialog under the hood
import * as SelectPrimitive from '@radix-ui/react-select';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

/**
 * Safe Popover components
 *
 * Use these instead of the regular Popover components to avoid infinite loops.
 * Examples:
 *
 * <SafePopover>
 *   <SafePopoverTrigger>Click me</SafePopoverTrigger>
 *   <PopoverContent>Content</PopoverContent>
 * </SafePopover>
 */
export const {
  Root: SafePopover,
  Trigger: SafePopoverTrigger,
  Anchor: SafePopoverAnchor,
} = createSafeRadixComponents({
  Root: PopoverPrimitive.Root,
  Trigger: PopoverPrimitive.Trigger,
  Anchor: PopoverPrimitive.Anchor,
});

/**
 * Safe Dialog components
 */
export const { Root: SafeDialog, Trigger: SafeDialogTrigger } = createSafeRadixComponents({
  Root: DialogPrimitive.Root,
  Trigger: DialogPrimitive.Trigger,
});

/**
 * Safe Drawer components
 */
export const { Root: SafeDrawer, Trigger: SafeDrawerTrigger } = createSafeRadixComponents({
  Root: DrawerPrimitive.Root,
  Trigger: DrawerPrimitive.Trigger,
});

/**
 * Safe Select components
 */
export const { Root: SafeSelect, Trigger: SafeSelectTrigger } = createSafeRadixComponents({
  Root: SelectPrimitive.Root,
  Trigger: SelectPrimitive.Trigger,
});

/**
 * Safe DropdownMenu components
 */
export const { Root: SafeDropdownMenu, Trigger: SafeDropdownMenuTrigger } =
  createSafeRadixComponents({
    Root: DropdownMenuPrimitive.Root,
    Trigger: DropdownMenuPrimitive.Trigger,
  });

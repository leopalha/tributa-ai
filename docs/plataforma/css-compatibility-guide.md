# CSS Compatibility and Best Practices Guide

This document outlines common CSS compatibility issues in our application and how to fix them.

## CSS Vendor Prefixes

For cross-browser compatibility, use both standard CSS properties and vendor-prefixed versions:

```css
/* Example of proper vendor prefix usage */
.element {
  /* Vendor prefixes first */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  /* Standard property last */
  user-select: none;
}
```

## Common Issues and Fixes

### Text Size Adjustment

```css
html,
:host {
  -webkit-text-size-adjust: 100%;
  -moz-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
  text-size-adjust: 100%;
}
```

### Backdrop Filter

```css
.glass-effect {
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}
```

### Mask Image

```css
.masked-element {
  -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0) 0%, black 10%);
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0) 0%, black 10%);
}
```

### User Select

```css
.no-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
```

### Appearance

```css
button {
  -webkit-appearance: none;
  appearance: none;
}
```

### Background Clip

```css
.text-gradient {
  background: linear-gradient(to right, var(--color-1), var(--color-2));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

## Performance Optimization

### Avoid Layout Triggering Properties in Animations

Instead of animating `height` which triggers layout:

```css
/* Better performance using transform */
@keyframes optimized-accordion {
  from {
    transform: scaleY(0);
    transform-origin: top;
  }
  to {
    transform: scaleY(1);
    transform-origin: top;
  }
}
```

### Use will-change Sparingly

```css
.will-animate {
  will-change: transform;
}
```

## HTML Best Practices

1. **Always add type attributes to buttons**:
   ```jsx
   <button type="button">Click me</button>
   ```

2. **Ensure form fields have id or name attributes**:
   ```jsx
   <input id="email" name="email" />
   ```

3. **Properly associate labels with form fields**:
   ```jsx
   <label htmlFor="email">Email</label>
   <input id="email" name="email" />
   ```

4. **Avoid inline styles**:
   ```jsx
   // Bad
   <div style={{ color: 'red' }}>Text</div>
   
   // Good
   <div className="text-red">Text</div>
   ```

## Running the HTML Fix Script

We've created a utility script to automatically fix common HTML issues:

```bash
node scripts/fix-html-warnings.js
```

This script will:
- Add missing type attributes to buttons
- Add id attributes to form fields missing both id and name
- Identify labels without proper for attributes (requires manual review) 
# Priscus UI Style Guide

This document outlines the styling guidelines for the Priscus application, ensuring a consistent dark theme UI across all components.

## Color Palette

The application uses a consistent dark theme with the following color variables:

```css
--color-bg-primary: #181818;       /* Main background color */
--color-bg-secondary: #1f2937;     /* Secondary background (cards, panels) */
--color-bg-tertiary: #111827;      /* Tertiary background (item rows) */
--color-border-primary: #374151;   /* Primary border color */
--color-border-secondary: #4b5563; /* Secondary border color */
--color-text-primary: #ffffff;     /* Primary text color */
--color-text-secondary: #94a3b8;   /* Secondary text color */
--color-text-muted: #9ca3af;       /* Muted text color */
--color-accent-blue: #60a5fa;      /* Blue accent color */
--color-accent-orange: #f59e0b;    /* Orange accent color */
--color-accent-green: #10b981;     /* Green accent color */
--color-error: #ef4444;            /* Error color */
```

## Typography

- Primary headings: 24px, #ffffff
- Secondary headings: 18px, #ffffff
- Body text: 16px, #94a3b8
- Small text: 14px, #9ca3af
- Mini text: 12px, #9ca3af

## Containers

All main content containers should use:
- Dark background (#181818)
- 32px padding
- 16px border radius
- Box shadow: 0 4px 24px rgba(0,0,0,0.4)
- Max width: 1200px
- Margin: 32px auto

## Cards

Card elements should use:
- Background: #1f2937
- Border: 1px solid #374151
- Border radius: 12px
- Box shadow: 0 4px 12px rgba(0,0,0,0.3)

## Buttons

Buttons should use:
- Background: #1f2937
- Border: 1px solid #374151
- Text color: #94a3b8
- Border radius: 8px
- Padding: 12px 24px
- Hover state: Background: #374151, Text: #ffffff
- Active state: Background: #3b82f6, Text: #ffffff

## Forms

Form inputs should use:
- Background: #111827
- Border: 2px solid #374151
- Text color: #ffffff
- Border radius: 6px
- Focus state: Border color: #60a5fa

## Animations

Use consistent animations for highlighting elements:

```css
@keyframes pulse-connection {
  0% { 
    transform: scale(1);
    text-shadow: 0 0 5px rgba(245, 158, 11, 0.5);
  }
  100% { 
    transform: scale(1.3);
    text-shadow: 0 0 10px rgba(245, 158, 11, 0.8);
  }
}
```

## Global Component Classes

To maintain consistency, use the global component classes from `src/styles/globalComponents.css`:

```css
.component-container { /* For main containers */ }
.component-header { /* For section headers */ }
.component-content { /* For content layouts */ }
.component-card { /* For card elements */ }
.highlight-element { /* For highlighted elements with animation */ }
```

## Responsive Design

For responsive layouts:
- Use flex layouts that stack on smaller screens
- At max-width: 1024px, convert horizontal layouts to vertical
- Ensure all text remains readable at smaller sizes

This style guide ensures visual consistency across all components in the Priscus application.

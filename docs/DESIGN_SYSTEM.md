# StudyMate Design System

## Overview
StudyMate uses a modern, professional design system with consistent colors, typography, spacing, and components. The system supports both light and dark modes with smooth transitions.

## Color Palette

### Light Mode Colors
- **Background**: `#fafbfc` - Main app background
- **Surface**: `#ffffff` - Card and component backgrounds
- **Surface Elevated**: `#f8f9fa` - Elevated surfaces and hover states
- **Primary**: `#6366f1` - Main brand color, buttons, links
- **Primary Hover**: `#4f46e5` - Primary button hover state
- **Accent**: `#10b981` - Success states, completed tasks
- **Text Primary**: `#0f172a` - Main text color
- **Text Secondary**: `#475569` - Secondary text, labels
- **Text Muted**: `#94a3b8` - Muted text, placeholders

### Dark Mode Colors
- **Background**: `#0a0b0d` - Main app background
- **Surface**: `#111217` - Card and component backgrounds
- **Surface Elevated**: `#1a1b23` - Elevated surfaces and hover states
- **Primary**: `#7c3aed` - Main brand color, buttons, links
- **Primary Hover**: `#8b5cf6` - Primary button hover state
- **Accent**: `#06d6a0` - Success states, completed tasks
- **Text Primary**: `#f8fafc` - Main text color
- **Text Secondary**: `#cbd5e1` - Secondary text, labels
- **Text Muted**: `#64748b` - Muted text, placeholders

## Typography

### Font Families
- **Body**: Inter - Used for all body text, buttons, and general content
- **Heading**: Space Grotesk - Used for headings and titles

### Typography Scale
- **H1**: 48px, weight 600, Space Grotesk
- **H2**: 32px, weight 600, Space Grotesk
- **H3**: 24px, weight 500, Space Grotesk
- **Body**: 16px, weight 400, Inter
- **Small**: 14px, weight 400, Inter

### CSS Classes
```css
.text-h1 { font-size: 48px; font-weight: 600; font-family: var(--font-heading); }
.text-h2 { font-size: 32px; font-weight: 600; font-family: var(--font-heading); }
.text-h3 { font-size: 24px; font-weight: 500; font-family: var(--font-heading); }
.text-body { font-size: 16px; font-weight: 400; font-family: var(--font-body); }
.text-small { font-size: 14px; font-weight: 400; font-family: var(--font-body); }
```

## Spacing

### 8px Grid System
- **2**: 8px
- **3**: 12px
- **4**: 16px
- **5**: 20px
- **6**: 24px
- **8**: 32px
- **10**: 40px
- **12**: 48px
- **16**: 64px
- **20**: 80px
- **24**: 96px

## Border Radius

### Card Radius
- **Card Components**: 12px border radius
- **CSS Variable**: `--border-radius-card: 12px`

## Transitions

### Smooth Transitions
- **Duration**: 0.2s
- **Easing**: cubic-bezier(0.4, 0, 0.2, 1)
- **CSS Variable**: `--transition-smooth: 0.2s cubic-bezier(0.4, 0, 0.2, 1)`

## Components

### Buttons

#### Primary Button
```css
.btn-primary {
  @apply bg-primary text-white font-medium px-6 py-3 rounded-lg shadow-sm hover:bg-primary-hover hover:shadow-md transform hover:scale-[0.98] active:scale-[0.96] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2;
  transition: var(--transition-smooth);
}
```

#### Secondary Button
```css
.btn-secondary {
  @apply border border-border text-text-primary font-medium px-6 py-3 rounded-lg hover:bg-surface-elevated hover:border-primary/50 transform hover:scale-[0.98] active:scale-[0.96] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2;
  transition: var(--transition-smooth);
}
```

### Cards

#### Standard Card
```css
.card {
  @apply bg-surface-elevated border border-border rounded-card shadow-sm hover:shadow-md transition-all duration-200;
  border-radius: var(--border-radius-card);
}
```

#### Task Card
```css
.task-card {
  @apply card card-hover p-6 cursor-pointer;
  border-radius: var(--border-radius-card);
}
```

### Form Inputs

#### Input Field
```css
.input-field {
  @apply w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200;
  transition: var(--transition-smooth);
}
```

### Status Badges

#### Status Colors
- **Completed**: `bg-accent/10 text-accent border-accent/20`
- **In Progress**: `bg-primary/10 text-primary border-primary/20`
- **Pending**: `bg-amber-100 text-amber-800 border-amber-200`

#### Priority Colors
- **High**: `bg-red-100 text-red-800 border-red-200`
- **Medium**: `bg-yellow-100 text-yellow-800 border-yellow-200`
- **Low**: `bg-accent/10 text-accent border-accent/20`

## CSS Custom Properties

### Light Mode Variables
```css
:root {
  --color-background: #fafbfc;
  --color-surface: #ffffff;
  --color-surface-elevated: #f8f9fa;
  --color-primary: #6366f1;
  --color-primary-hover: #4f46e5;
  --color-accent: #10b981;
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-muted: #94a3b8;
  --color-border: #e2e8f0;
  --color-border-light: #f1f5f9;
  
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-heading: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  
  --text-h1: 48px;
  --text-h2: 32px;
  --text-h3: 24px;
  --text-body: 16px;
  --text-small: 14px;
  
  --transition-smooth: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --border-radius-card: 12px;
}
```

### Dark Mode Variables
```css
.dark,
.dark-mode {
  --color-background: #0a0b0d;
  --color-surface: #111217;
  --color-surface-elevated: #1a1b23;
  --color-primary: #7c3aed;
  --color-primary-hover: #8b5cf6;
  --color-accent: #06d6a0;
  --color-text-primary: #f8fafc;
  --color-text-secondary: #cbd5e1;
  --color-text-muted: #64748b;
  --color-border: #334155;
  --color-border-light: #475569;
}
```

## Theme Toggle

The theme system uses a `ThemeContext` that:
- Applies classes to the `html` element for Tailwind compatibility
- Persists theme preference in localStorage
- Provides smooth transitions between themes
- Supports both `.dark` and `.dark-mode` selectors

## Usage Guidelines

### Color Usage
- Use `text-text-primary` for main text content
- Use `text-text-secondary` for labels and secondary information
- Use `text-text-muted` for placeholders and disabled states
- Use `bg-surface` for main component backgrounds
- Use `bg-surface-elevated` for elevated surfaces and hover states

### Typography Usage
- Use `text-h1` for page titles
- Use `text-h2` for section headers
- Use `text-h3` for subsection headers
- Use `text-body` for general content
- Use `text-small` for captions and metadata

### Spacing Usage
- Use the 8px grid system for consistent spacing
- Prefer `space-y-4` (16px) for vertical spacing between sections
- Use `p-6` (24px) for card padding
- Use `gap-6` (24px) for grid gaps

### Component Usage
- Always use the predefined component classes for consistency
- Apply `transition: var(--transition-smooth)` for smooth animations
- Use `border-radius: var(--border-radius-card)` for card components
- Ensure all interactive elements have proper hover and focus states

## Accessibility

### Color Contrast
- All text colors meet WCAG AA contrast requirements
- Interactive elements have sufficient contrast ratios
- Focus states are clearly visible

### Typography
- Font sizes are readable on all devices
- Line heights provide adequate spacing
- Font weights provide clear hierarchy

### Interactions
- All interactive elements have hover and focus states
- Transitions are smooth but not distracting
- Touch targets meet minimum size requirements


















# Modern Card Design System

## Overview
StudyMate now features a premium, modern card design system with multi-layered shadows, smooth animations, and interactive elements that provide a delightful user experience.

## Card Styling Specifications

### Multi-Layered Shadows
```css
/* Default card shadow */
box-shadow: 0 1px 3px rgba(0,0,0,0.05), 
            0 4px 6px rgba(0,0,0,0.05), 
            0 8px 24px rgba(0,0,0,0.05);

/* Hover card shadow */
box-shadow: 0 4px 6px rgba(0,0,0,0.05), 
            0 8px 24px rgba(0,0,0,0.05), 
            0 16px 48px rgba(0,0,0,0.05);
```

### Border Radius & Borders
- **Border Radius**: 12px for all cards
- **Border**: 1px solid with 8% opacity of current text color
- **CSS Variable**: `--border-radius-card: 12px`

### Hover Effects
- **Transform**: `translateY(-2px)` on hover
- **Duration**: 0.3s smooth transitions
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)`

### Glassmorphism
- **Backdrop Filter**: `blur(20px)` on hover
- **Background**: Semi-transparent with gradient overlays

## Dashboard Cards

### StatCard Component
Features animated counters and gradient backgrounds:

```jsx
<StatCard
  title="Total Tasks"
  value={42}
  icon={TrendingUp}
  color="primary"
  gradient="primary"
  delay={0}
/>
```

#### Properties
- **title**: Card title
- **value**: Number to animate
- **icon**: Lucide React icon component
- **color**: Theme color (primary, accent, success, warning, error)
- **gradient**: Gradient type (primary, accent, success, warning, error, default)
- **delay**: Animation delay in 100ms increments

#### Features
- **Animated Counters**: Numbers count up from 0 on page load
- **Intersection Observer**: Animations trigger when cards come into view
- **Gradient Backgrounds**: Subtle gradients that appear on hover
- **Micro-icons**: Lucide React icons with color theming
- **Smooth Transitions**: 0.3s transitions for all interactions

### Gradient Types
```css
/* Primary gradient */
background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%);

/* Accent gradient */
background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%);

/* Success gradient */
background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%);
```

## Task Cards

### TaskCard Component
Enhanced task cards with interactive elements:

```jsx
<TaskCard
  task={task}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onStatusChange={handleStatusChange}
  onDragStart={handleDragStart}
  isDragging={false}
/>
```

#### Features

##### Priority Indicators
- **Left Border**: 4px colored border based on priority
- **Colors**: 
  - High: `#ef4444` (red)
  - Medium: `#f59e0b` (yellow)
  - Low: `#10b981` (green)

##### Status Badges
- **Rounded Corners**: `rounded-lg` (8px)
- **Soft Colors**: Using opacity-based colors
- **Icons**: Lucide React status icons
- **Animations**: Smooth color transitions

##### Hover Reveal Actions
- **Edit Button**: Pencil icon with blue hover
- **Delete Button**: Trash icon with red hover
- **Complete Button**: Check icon with green hover
- **Animation**: Fade in from opacity 0 to 100

##### Drag Handle
- **Grip Texture**: Dotted pattern using CSS gradients
- **Position**: Top-left corner
- **Visibility**: Appears on hover with 30% opacity
- **Cursor**: Changes to grab/grabbing on interaction

##### Completion Animation
```css
@keyframes taskComplete {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(100%);
  }
}
```

##### Progress Indicators
- **In-Progress Tasks**: Animated progress bar
- **Animation**: Width animates from 0 to 60%
- **Duration**: 1s ease-out animation

## CSS Classes

### Card Base Classes
```css
.card {
  @apply bg-surface-elevated rounded-card shadow-card transition-all duration-300;
  border-radius: var(--border-radius-card);
  border: 1px solid rgba(var(--color-text-primary-rgb), 0.08);
  backdrop-filter: blur(20px);
}

.card-hover {
  @apply hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300;
}

.card-hover:hover {
  backdrop-filter: blur(20px);
}
```

### Task Card Classes
```css
.task-card {
  @apply card card-hover p-6 cursor-pointer relative overflow-hidden;
  border-left: 4px solid transparent;
}

.task-actions {
  @apply absolute top-4 right-4 opacity-0 transition-opacity duration-200;
}

.task-card:hover .task-actions {
  @apply opacity-100;
}

.drag-handle {
  @apply absolute top-2 left-2 w-6 h-6 opacity-0 transition-opacity duration-200 cursor-grab;
  background-image: radial-gradient(circle, currentColor 1px, transparent 1px);
  background-size: 4px 4px;
  background-repeat: repeat;
}
```

### Status Badge Classes
```css
.status-badge {
  @apply px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200;
}

.status-completed {
  @apply bg-accent/10 text-accent border-accent/20;
}

.status-in-progress {
  @apply bg-primary/10 text-primary border-primary/20;
}

.status-pending {
  @apply bg-amber-100 text-amber-800 border-amber-200;
}
```

## Animation System

### Counter Animation
```javascript
const animateCounter = () => {
  const duration = 1000
  const steps = 60
  const increment = value / steps
  let current = 0

  const timer = setInterval(() => {
    current += increment
    if (current >= value) {
      setDisplayValue(value)
      clearInterval(timer)
    } else {
      setDisplayValue(Math.floor(current))
    }
  }, duration / steps)
}
```

### Framer Motion Animations
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: delay * 0.1 }}
  className="stat-card group"
>
```

## Responsive Design

### Grid Layouts
```css
/* Dashboard stats */
.grid-cols-1 md:grid-cols-2 lg:grid-cols-4

/* Task cards */
.grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

### Mobile Optimizations
- Touch-friendly button sizes (44px minimum)
- Reduced animations on mobile
- Optimized spacing for small screens
- Swipe gestures for task actions

## Accessibility

### Focus States
- Clear focus indicators on all interactive elements
- Keyboard navigation support
- Screen reader friendly labels and descriptions

### Color Contrast
- All text meets WCAG AA contrast requirements
- Status colors maintain sufficient contrast
- Hover states provide clear visual feedback

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .card-hover {
    transform: none;
  }
  
  .counter-animate {
    animation: none;
  }
}
```

## Performance Optimizations

### Intersection Observer
- Cards animate only when they come into view
- Reduces initial page load animations
- Improves performance on long lists

### CSS Transforms
- Using `transform` instead of `top/left` for animations
- Hardware acceleration for smooth 60fps animations
- Efficient shadow calculations

### Lazy Loading
- Icons load only when needed
- Progressive enhancement for animations
- Fallback states for slow connections

## Browser Support

### Modern Browsers
- Chrome 88+
- Firefox 87+
- Safari 14+
- Edge 88+

### Fallbacks
- CSS Grid fallback to Flexbox
- Backdrop-filter fallback to solid backgrounds
- Animation fallbacks for older browsers

## Usage Guidelines

### When to Use Each Card Type

#### StatCard
- Dashboard statistics
- Key metrics and KPIs
- Animated counters
- Icon-based information

#### TaskCard
- Task management
- Interactive task lists
- Drag and drop interfaces
- Status-based workflows

### Best Practices
1. **Consistent Spacing**: Use 8px grid system
2. **Smooth Transitions**: Always include transition properties
3. **Accessible Colors**: Ensure sufficient contrast ratios
4. **Performance**: Use intersection observers for animations
5. **Mobile First**: Design for mobile, enhance for desktop

### Animation Guidelines
1. **Duration**: 200-300ms for micro-interactions
2. **Easing**: Use `cubic-bezier(0.4, 0, 0.2, 1)` for smooth feel
3. **Staggering**: Delay animations by 100ms increments
4. **Reduced Motion**: Respect user preferences


















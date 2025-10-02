# Design Guidelines: Modern Data Console

## Design Approach
**System-Based Approach** with inspiration from Linear, Notion, and modern dashboard aesthetics. This is a utility-focused application where clarity, performance, and data readability are paramount, enhanced with subtle visual sophistication.

## Core Design Philosophy
Create a professional data management interface that feels premium and effortless to use. Balance functionality with aesthetic refinement—think "enterprise meets modern SaaS." The design should disappear when working, yet impress when noticed.

---

## Visual Design System

### Color Palette

**Dark Mode Primary** (Default):
- Background: 220 15% 8% (deep navy-black)
- Surface: 220 15% 12% (elevated panels)
- Border: 220 10% 20% (subtle dividers)
- Text Primary: 0 0% 98%
- Text Secondary: 220 5% 60%

**Accent Colors**:
- Primary: 210 100% 65% (vibrant blue for actions)
- Success: 145 65% 55% (for positive states)
- Warning: 35 90% 60% (status indicators)
- Danger: 0 75% 60% (critical actions)

**Interactive States**:
- Hover: Increase lightness by 5-8%
- Active: Reduce lightness by 5%
- Focus: 2px ring using primary color at 40% opacity

### Typography

**Font Stack**:
- Primary: 'Inter', system-ui, sans-serif (clean, modern data display)
- Monospace: 'JetBrains Mono', 'Fira Code', monospace (for data values)

**Type Scale**:
- Heading: 24px/28px, weight 600
- Subheading: 18px/24px, weight 500
- Body: 14px/20px, weight 400
- Data: 13px/18px, weight 400, monospace for numbers
- Caption: 12px/16px, weight 400

### Layout System

**Spacing Units**: Use Tailwind units of **2, 4, 6, 8, 12, 16** for consistency
- Component padding: p-6 to p-8
- Section gaps: gap-6 or gap-8
- Table cell padding: px-4 py-3

**Grid Structure**:
- Sidebar: Fixed 280px width (collapsible on mobile)
- Main content: Fluid with max-w-screen-2xl container
- Table layout: Auto-fit columns with min-width constraints

---

## Component Design

### Navigation
- Top bar: 64px height, sticky with backdrop blur
- Logo/title left-aligned with search bar center
- User controls and actions right-aligned
- Subtle bottom border (1px, border color)

### Data Table (Primary Component)
**Visual Treatment**:
- Elevated card surface (surface color) with subtle shadow
- Rounded corners: rounded-xl
- Header row: Slightly darker background, sticky on scroll
- Alternating row colors: Base + 2% lighter for even rows
- Cell borders: Minimal, use border color sparingly
- Hover state: Row highlight with 3% lighter background

**Editable 'First Contact Y/N' Column**:
- Implement as toggle switch (not checkbox)
- Switch design: 48px wide, 24px high, rounded-full
- Active state: Primary accent color with smooth transition
- Inactive state: Border-only with muted background
- Include subtle scale animation on toggle (scale-95 to scale-100)

**Typography in Table**:
- Headers: 12px uppercase tracking-wide, text-secondary
- Data cells: 13px monospace for numbers, regular for text
- Maintain consistent vertical rhythm with py-3

### Search & Filters
- Search bar: Prominent position with icon
- Input styling: Transparent background, bottom border on focus
- Filter chips: Pill-shaped with dismissible X icon
- Dropdown filters: Overlay panels with smooth slide-down animation

### Action Buttons
- Primary: Solid fill with primary color, rounded-lg
- Secondary: Outline style with hover fill
- Icon buttons: Square 40px, rounded-lg, hover background
- Size: px-6 py-2.5 for text buttons

### Loading & Empty States
- Skeleton loaders: Subtle shimmer animation on surface color
- Empty state: Centered icon, heading, and subtle description
- Loading spinner: Circular with primary color, 32px

---

## Interaction Design

### Animations (Minimal & Purposeful)
- Page transitions: 200ms ease-out fade
- Table row hover: 150ms ease-in-out
- Toggle switches: 200ms cubic-bezier for smooth feel
- Dropdown menus: 150ms slide with opacity fade
- NO parallax, NO scroll-triggered animations

### Micro-interactions
- Button press: Subtle scale-98 on active state
- Focus indicators: 2px ring with 4px offset
- Sort indicators: Smooth rotation on column headers
- Toast notifications: Slide from top-right corner

---

## Responsive Behavior

**Desktop (1024px+)**:
- Full sidebar visible
- Multi-column table display
- Search bar expanded

**Tablet (768px - 1023px)**:
- Collapsible sidebar with hamburger menu
- Horizontal scroll for table (with shadow indicators)
- Condensed padding

**Mobile (<768px)**:
- Bottom navigation bar for key actions
- Card-based table view (stack data vertically)
- Simplified filters with modal overlay

---

## Accessibility & Performance

- Maintain WCAG 2.1 AA contrast ratios (4.5:1 minimum)
- Keyboard navigation for all interactive elements
- Screen reader labels for icon-only buttons
- Lazy load table rows (virtualization for 100+ rows)
- Optimistic UI updates for toggle interactions
- Debounced search input (300ms delay)

---

## Special Features

**Download Functionality**:
- Floating action button (bottom-right, 56px circle)
- Icon: Download with subtle pulse on data change
- Success confirmation with toast notification

**Data Validation**:
- Real-time validation for editable field
- Inline error messages below affected row
- Success checkmark animation on save

**Smart Sorting**:
- Click column headers to sort
- Multi-sort with Shift+Click
- Visual indicator (arrow icon) for sort direction and priority

---

This design creates a sophisticated, productivity-focused interface that makes data management feel effortless while maintaining visual appeal through restrained elegance rather than decoration.
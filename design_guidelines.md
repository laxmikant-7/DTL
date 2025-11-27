# Citizen Grievance Portal - Design Guidelines

## Design Approach

**System Selected**: Material Design with Government Service Adaptations

**Rationale**: This is a utility-focused, information-dense civic application where clarity, accessibility, and trust are paramount. Material Design provides established patterns for forms, data displays, and state management that work across diverse user literacy levels.

## Core Design Principles

1. **Clarity Over Style**: Every element serves a functional purpose
2. **Accessibility First**: WCAG 2.1 AA compliance for inclusive access
3. **Trust & Credibility**: Professional, authoritative appearance befitting government services
4. **Cross-Literacy Design**: Icons + text labels, clear visual feedback

## Typography

- **Primary Font**: Roboto (Material Design standard, excellent multilingual support for English, Kannada, Hindi, Tamil)
- **Headings**: Roboto Medium, sizes: text-3xl (landing), text-2xl (page titles), text-xl (section headers)
- **Body**: Roboto Regular, text-base (forms, content), text-sm (helper text, metadata)
- **Emphasis**: Roboto Medium for labels, buttons, status badges
- **Line Height**: Generous 1.6-1.8 for readability across languages

## Layout System

**Spacing Units**: Tailwind units of 2, 4, 6, 8, 12, 16 (p-4, m-6, gap-8, etc.)

- **Mobile**: Single column, p-4 containers, compact spacing (gap-4)
- **Tablet**: p-6 containers, moderate spacing (gap-6)
- **Desktop**: max-w-6xl centered containers, p-8, generous spacing (gap-8)
- **Forms**: Consistent mb-6 between form groups, mb-2 for label-to-input

## Component Library

### Navigation
- **Top Bar**: Full-width, language dropdown (top-right), logo/title (left), logout/profile (right when logged in)
- **Mobile**: Hamburger menu, slide-in drawer navigation
- **Breadcrumbs**: For officer dashboard multi-level navigation

### Forms
- **Input Fields**: Full-width on mobile, max-w-md on desktop, clear labels above inputs, helper text below, error states with red text + border
- **Dropdowns**: Native select with custom styling, clear placeholder text
- **Text Areas**: Min 4 rows, expandable, character count for description fields
- **Buttons**: Primary (filled), Secondary (outlined), sizes: px-6 py-3 (default), px-4 py-2 (compact)
- **Validation**: Inline errors immediately below fields, success states with checkmark icons

### Data Display
- **Complaint Cards**: Border, rounded corners (rounded-lg), shadow-sm, padding p-6
- **Status Badges**: Rounded-full pills with status text, sizes px-3 py-1
- **Tables** (Officer Dashboard): Responsive, striped rows, sticky headers on scroll, sortable columns with icons

### Feedback & States
- **Loading**: Simple spinner, skeleton loaders for list items
- **Success Messages**: Green banner with checkmark icon (top of page)
- **Error Messages**: Red banner with alert icon
- **Empty States**: Icon + message + CTA for empty complaint lists

### Cards & Containers
- **Dashboard Cards**: White background, border, rounded-lg, shadow-sm, p-6, hover:shadow-md
- **Complaint ID Display**: Large text-2xl, monospace font for ID, bordered container with copy button
- **Officer Notes**: Indented, italic, with timestamp and officer name

## Page-Specific Layouts

### Landing Page
- **Hero Section**: 60vh, centered content, language dropdown prominently positioned top-right
- **Headline**: Large text-4xl, clear value proposition "Submit & Track Complaints"
- **Two CTA Buttons**: "Citizen Login" + "Officer Login" (prominent, side-by-side on desktop, stacked mobile)
- **Features Section**: 3-column grid (desktop), cards with icons for "Submit Complaint", "Track Status", "Quick Resolution"

### Registration/Login
- **Centered Card**: max-w-md, shadow-lg, p-8
- **Form Layout**: Vertical stack, clear field labels, password toggle visibility icon
- **Footer Links**: "Already registered?" / "New user?" toggle links

### Citizen Dashboard
- **Two-Column Desktop** (1/3 + 2/3): Sidebar with user profile summary + quick stats, main area for complaint form
- **Mobile**: Stacked, user stats in collapsed accordion
- **Complaint Form**: White card container, grouped fields with clear section headers

### Complaint Tracking
- **Search-First**: Prominent search input for complaint ID
- **Results Display**: Timeline view showing status progression with visual indicators (dots, connecting lines)
- **Status History**: Chronological list with timestamps, officer notes as expandable details

### Officer Dashboard
- **Metrics Row**: 3-4 stat cards showing total/pending/in-progress/resolved counts
- **Filters Bar**: Department dropdown, status filter, date range (sticky on scroll)
- **Complaints Table**: Compact on mobile (stack info), full table on desktop, inline status change dropdown, "Add Notes" action button

## Images

**Hero Image**: No large hero image for this application. Use subtle background pattern or solid neutral color with geometric accent shapes. This is a functional government portal - clarity and speed trump visual drama.

**Icons**: Material Icons via CDN - use throughout for:
- Form field prefixes (person, email, phone, location)
- Status indicators (check, clock, alert)
- Navigation items
- Category icons (electricity: bolt, water: droplet, roads: directions, waste: delete)

## Accessibility Requirements

- All form inputs with visible labels and proper `<label>` association
- ARIA labels for icon-only buttons
- Focus indicators with clear 2px outline offset
- Color not sole indicator (pair with icons/text)
- Keyboard navigation for all interactive elements
- Skip links for main content
- Language attribute updates on dropdown change

## Responsive Breakpoints

- Mobile: < 768px (sm)
- Tablet: 768px - 1024px (md)
- Desktop: > 1024px (lg)

## Animations

**Minimal & Purposeful**:
- Button hover: subtle shadow increase (150ms ease)
- Card hover: shadow-sm to shadow-md (200ms)
- Modal/drawer entry: slide-in 300ms ease-out
- Status badge changes: smooth transition 200ms
- NO scroll animations, parallax, or decorative motion
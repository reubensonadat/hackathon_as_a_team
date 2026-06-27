---
name: CityBins Utility System
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#3f4a36'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#6f7b64'
  outline-variant: '#becbb1'
  surface-tint: '#2b6c00'
  primary: '#2b6c00'
  on-primary: '#ffffff'
  primary-container: '#58cc02'
  on-primary-container: '#1e5000'
  inverse-primary: '#6be026'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfde'
  on-secondary-container: '#636262'
  tertiary: '#9a397a'
  on-tertiary: '#ffffff'
  tertiary-container: '#ff8ed4'
  on-tertiary-container: '#7b1f60'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#87fe45'
  primary-fixed-dim: '#6be026'
  on-primary-fixed: '#082100'
  on-primary-fixed-variant: '#1f5100'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#ffd8eb'
  tertiary-fixed-dim: '#ffaedd'
  on-tertiary-fixed: '#3b002c'
  on-tertiary-fixed-variant: '#7d2061'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Nunito Sans
    fontSize: 32px
    fontWeight: '900'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Nunito Sans
    fontSize: 24px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Nunito Sans
    fontSize: 20px
    fontWeight: '800'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Nunito Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: '1.5'
  body-md:
    fontFamily: Nunito Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: '1.5'
  label-bold:
    fontFamily: Nunito Sans
    fontSize: 14px
    fontWeight: '800'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-md:
    fontFamily: Nunito Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  margin-mobile: 20px
  gutter-mobile: 12px
---

## Brand & Style

The design system is built for high-utility civic engagement, specifically focused on waste management and urban logistics. The brand personality is "Industrial-Friendly"—combining the ruggedness of urban utility with an approachable, modern clarity. 

The visual style follows a **Chunky Functionalism** approach. It borrows the weight and high-contrast accessibility of neo-brutalism but softens the edges to ensure a welcoming user experience. The interface prioritizes oversized touch targets and extreme legibility to accommodate users who may be outdoors, in motion, or using the app in varied lighting conditions. The emotional response should be one of efficiency, reliability, and ease of use.

## Colors

The palette is anchored by **Vibrant Green (#58CC02)**, signaling action and ecological responsibility. This is paired with a **Soft Off-white (#F7F7F7)** background to reduce glare while maintaining high contrast.

- **Primary:** Used for the main action buttons and "Active" state indicators.
- **Secondary (Deep Charcoal):** Used for primary text and heavy borders to ensure WCAG AAA compliance.
- **Neutral:** Used for surface strokes and disabled states, providing structure without visual clutter.
- **Functional States:** Success uses the primary green; Error uses a high-visibility orange-red (#FF4B4B) to maintain the "chunky" high-contrast look.

## Typography

This design system uses **Nunito Sans** across all levels to take advantage of its rounded terminals, which complement the heavy corner radii of the UI. 

Weights are intentionally pushed toward the heavier end of the spectrum (700-900) to maintain a "chunky" feel. Headlines use tight line heights and negative letter spacing to create dense, impactful blocks of information. Body text remains highly legible with generous line spacing, ensuring that utility instructions are never missed.

## Layout & Spacing

The layout follows a strict **8px grid system** tailored for mobile-first utility. Given the "CityBins" context, vertical rhythm is prioritized to facilitate scrolling through lists and forms.

- **Margins:** A consistent 20px outer margin ensures content doesn't bleed into the edges of mobile displays.
- **Safe Areas:** Interactive elements maintain a minimum 48px height (tappable area) but are styled at 56px+ to emphasize the chunky aesthetic.
- **Stacking:** Elements use "Massive Padding" (24px internal padding for cards) to ensure high-contrast separation of information.

## Elevation & Depth

This design system eschews traditional soft shadows in favor of **Solid Tonal Offsets**. 

Hierarchy is created through:
1.  **Heavy Outlines:** 2px solid borders using the Secondary color (#232323).
2.  **Hard Shadows:** Elements may use a "block shadow" (a solid 4px offset in the secondary color) to simulate physical depth without using blurs.
3.  **Tonal Layers:** Surfaces sit on the #F7F7F7 background using white (#FFFFFF) for primary card containers, creating a subtle but clear distinction of the active "work area."

## Shapes

The shape language is defined by **Extreme Rounding**. All primary containers, buttons, and input fields utilize a minimum of 16px (rounded-2xl) radius. 

This rounding serves two purposes: it prevents the high-contrast black borders from feeling "aggressive" and it creates a distinct, recognizable silhouette for the CityBins brand. Large chips and utility badges use full pill-shaping (999px) to contrast against the more rectangular (but still rounded) primary cards.

## Components

### Buttons
Primary buttons are 56px minimum height, featuring a #58CC02 fill, a 2px solid black border, and 900-weight uppercase text. They use a hard 4px bottom-right shadow that disappears on "press" to provide tactile feedback.

### Cards
Utility cards use a white background, 2px black border, and 20px internal padding. Content inside cards is separated by 12px gaps. 

### Input Fields
Fields utilize a 2px border that thickens to 3px on focus. Labels sit outside the field in the `label-bold` style for maximum visibility. Tap targets for checkboxes and radio buttons are oversized (28px x 28px).

### Chips & Status
Status indicators for bin levels or collection days use high-contrast fills with the `label-bold` type. These are always pill-shaped to differentiate them from actionable buttons.

### Progress Bars
For "Bin Fullness," use thick 24px bars with a solid 2px border. The fill color is the primary green, transitioning to alert orange-red only when exceeding 90% capacity.
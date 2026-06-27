---
name: Urban Logic
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1b1b1b'
  on-surface-variant: '#4c4546'
  inverse-surface: '#303030'
  inverse-on-surface: '#f1f1f1'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#585f6c'
  on-secondary: '#ffffff'
  secondary-container: '#dce2f3'
  on-secondary-container: '#5e6572'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#141b2b'
  on-tertiary-container: '#7d8497'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#dce2f3'
  secondary-fixed-dim: '#c0c7d6'
  on-secondary-fixed: '#151c27'
  on-secondary-fixed-variant: '#404754'
  tertiary-fixed: '#dce2f7'
  tertiary-fixed-dim: '#c0c6db'
  on-tertiary-fixed: '#141b2b'
  on-tertiary-fixed-variant: '#404758'
  background: '#f9f9f9'
  on-background: '#1b1b1b'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  button:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: '0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  container-margin: 16px
  gutter: 12px
  section-gap: 24px
  stack-compact: 8px
  stack-loose: 16px
---

## Brand & Style
The brand personality is efficient, reliable, and invisible. Much like high-end logistics and ride-sharing platforms, the UI prioritizes utility and speed over decorative flair. It evokes a sense of "premium utility"—where the service is essential but the interface feels sophisticated and frictionless.

The design style is **Modern Corporate Minimalism**. It utilizes high-contrast action points (Black/White) against a soft, layered neutral backdrop. The aesthetic relies on precise alignment, generous whitespace, and a clear visual hierarchy to communicate trustworthiness and operational excellence.

## Colors
The palette is intentionally restrained to focus the user's attention on actions and status. 
- **Primary Action**: Solid Black (#000000) is reserved for the most important functional triggers.
- **Surface & Background**: A subtle distinction between the page background (#F3F4F6) and elevated surface cards (#FFFFFF) creates natural depth without needing heavy borders.
- **Typography**: Deep Charcoal (#111827) provides high legibility for primary information, while Gray (#6B7280) handles metadata and secondary labels to reduce visual noise.

## Typography
The system uses **Inter** for its neutral, geometric qualities that perform exceptionally well at small sizes in data-heavy environments.
- **Headlines**: Set in bold weights with tight letter-spacing to create a "commanding" presence.
- **Body**: Standardized at 16px for optimal readability on mobile devices.
- **Labels**: Used for secondary data points, often in uppercase or medium weights to distinguish from body text.

## Layout & Spacing
This design system utilizes a **fluid grid** with a 4px baseline rhythm. 
- **Mobile**: A 4-column grid with 16px side margins. 
- **Desktop**: A 12-column centered grid with a maximum content width of 1140px. 
Components are stacked using vertical "stacks"—8px for related items (like a label and input) and 16px for distinct blocks of information (like cards in a list).

## Elevation & Depth
Depth is conveyed through **Tonal Layers** supplemented by **Ambient Shadows**. 
- **Level 0**: Background (#F3F4F6) – The lowest layer.
- **Level 1**: Surfaces (#FFFFFF) – Used for cards and primary containers. These should feature a "Medium Shadow": `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`.
- **Interactions**: On hover or active state, cards may increase shadow spread slightly to imply lift.
- **Borders**: Used only when necessary to define boundaries on white-on-white areas, utilizing a thin 1px border in #E5E7EB.

## Shapes
The system uses **Rounded (8px)** corners across all primary UI components. This softens the high-contrast professional look, making the utility feel accessible rather than institutional. 
- Small components (chips/badges) use 4px (`rounded-sm`).
- Large containers (cards/modals) use 12px (`rounded-xl`) for a more modern, mobile-first appearance.

## Components
- **Buttons**: Primary buttons are solid Black with White text, 48px minimum height for touch accessibility. Secondary buttons are White with a light gray border (#D1D5DB) and Charcoal text.
- **Inputs**: Backgrounds are White with a 1px #D1D5DB border. On focus, the border transitions to Black with a 1px inner stroke. Labels are positioned above the field in `label-md` weight.
- **Cards**: Pure White background, 16px internal padding, and a `shadow-md`.
- **Navigation Bar**: A fixed white bottom bar. Icons are 24px thin-line style. The active state is indicated by a solid Black icon or a small 2px black bar below the icon.
- **Chips/Status**: Small badges with light gray backgrounds and #111827 text for neutral status (e.g., "Pending"), and green/red variants for success/error alerts.
Project Context: CityBins MVP
1. Project Overview
We are building "CityBins," a two-sided, on-demand waste management web application. It connects households (Residents) with independent waste collectors (Drivers).

The Vibe: A sleek, high-trust, premium utility app. It should look and feel like a modern ride-hailing or food delivery app (e.g., Uber, Bolt).

The Constraints: This is a rapid hackathon MVP sprint. The scope is strictly limited to core matchmaking.

2. Tech Stack & Environment
Frontend: React (Vite) and Tailwind CSS.

Backend / Database: Supabase. (Note: The backend architecture, schema, and real-time listeners are being managed expertly by Senam on the team. Assume the backend infrastructure is robust and highly capable; focus purely on the frontend integration and state management).

Target Device: Mobile-first web application. Desktop views should simply render a mobile-sized container (max-w-md) centered on the screen.

3. Design Assets
All UI reference images are located in the /design directory. Use these images as the definitive source of truth for layout, spacing, and component structure.

Visual Language: High-contrast monochrome (Crisp White backgrounds, Deep Charcoal/Black text and primary buttons).

Typography: Clean, geometric sans-serif (Inter).

Geometry: Tight rounded corners (rounded-lg) and subtle drop shadows (shadow-md) on cards. No thick, heavy borders.

Bottom Navigation: Minimalist white bar with crisp icons (Home, Requests, Account).

4. Core Features & Data Flow
Authentication: Google OAuth.

Resident Onboarding: Captures Phone Number (+233 prefix), Property Type, Area (e.g., Amamoma), closest Landmark, and GhanaPostGPS digital address. Crucial: We are prioritizing local digital addresses and landmarks over complex geocoding APIs.

Resident Dashboard: A clear CTA to "Request Immediate Pickup", allowing the user to select Bin Size to get an estimated fee.

Driver Dashboard: A static, stylized map graphic with UI hotspot pins (for visual effect only, no live Mapbox/Google Maps rendering). Below the static map is a real-time, scrollable list of active jobs in their zone.

The Match: Once a driver claims a job, the resident's UI updates instantly via Supabase real-time listeners, displaying the driver's name and a standard href="tel:..." button to coordinate the physical pickup.

5. Scope Boundaries (Out of Scope)
No Live GPS Routing: Do not implement live tracking or auto-dispatching algorithms. Drivers manually claim jobs from the feed. For navigation, utilize a simple deep link that pushes coordinates to the user's native Google Maps app.

No In-App Payments: Do not integrate Stripe, Paystack, or digital wallets. All transactions (Cash or direct MoMo) happen offline between the resident and the driver at the gate.

No In-App Chat: Rely strictly on native phone calls for coordination.

6. AI Agent Operating Directives
Implementation Strategy: Prioritize clean, modular React components using standard Tailwind utility classes.

Complexity Check: If a requested feature, UI component, or API integration appears highly complex or would require significant time to implement, pause and prompt me with a simplified workaround or alternative approach before writing the code. Do not silently go down a complex engineering rabbit hole.
# Product Requirements Document (PRD): GymScoreboard

## 1. Overview

### 1.1 Product Name
GymScoreboard

### 1.2 Product Description
GymScoreboard is a web-based application designed to simplify scorekeeping for gym teachers and coaches during physical education classes or sports events. It allows users to quickly configure a scoreboard for predefined sports (e.g., basketball, soccer, volleyball) or create custom scoreboards for unique activities. The application generates a unique, shareable link (with QR code) for a public display view that can be accessed on any device with a web browser, such as a projector, TV, or tablet. The scoreboard is controlled via an intuitive admin interface where users tap interactive elements to update scores, timers, fouls, and other stats in real-time. Updates are synchronized instantly between the control device and the display device(s) without requiring page refreshes.

The product emphasizes ease of use, requiring no downloads, installations, or accounts—just a modern web browser. It supports real-time collaboration if multiple admins are needed (e.g., assistant coaches) and is optimized for mobile and touch-screen devices.

### 1.3 Target Audience
- Primary: Gym teachers, physical education instructors, and coaches in K-12 schools, community centers, or recreational leagues.
- Secondary: Sports referees, event organizers, or anyone running informal games needing a simple digital scoreboard.

### 1.4 Business Goals
- Reduce setup time for scorekeeping from minutes (manual boards or apps) to seconds.
- Increase engagement in gym classes by providing a professional-looking, visible scoreboard.
- Achieve high user satisfaction through intuitive controls and reliability, targeting a Net Promoter Score (NPS) of 80+.
- Monetization: Free core version; premium features (e.g., custom themes, data export) via subscription ($4.99/month per user).

### 1.5 Scope
- In Scope: Configuration for predefined and custom sports, real-time updates, unique shareable links, touch-based controls, game clock management.
- Out of Scope: User accounts/login (sessions are anonymous and ephemeral), integration with external hardware (e.g., physical buzzers), advanced analytics (e.g., player stats tracking), offline mode.

### 1.6 Assumptions
- Users have access to at least two devices: one for control (e.g., smartphone/tablet) and one for display (e.g., projector-connected laptop).
- Internet connectivity is available; the app relies on real-time web technologies.
- Devices support modern browsers (Chrome, Safari, Firefox) with WebSocket capabilities.
- No data persistence beyond the session; games reset on page close.

### 1.7 Dependencies
- Backend: Cloud hosting (e.g., AWS/Heroku) for session management and real-time syncing.
- Frontend: HTML5, CSS3, JavaScript frameworks (e.g., React for UI, Socket.io for real-time).
- No third-party APIs required initially.

## 2. User Stories

### 2.1 Core User Story (Provided)
As a gym teacher, I want to open the app, select basketball as the sport, configure settings like number of periods and time per period, generate a unique URL/QR code, display the scoreboard on a visible screen via that URL, start the game, and update scores/stats/clock in real-time by tapping elements on my control device, so that everyone can see the live updates without interruptions.

### 2.2 Additional User Stories
- As a gym teacher, I want to select from predefined sports (basketball, soccer, volleyball, baseball, tennis) with auto-populated fields (e.g., scores, fouls, periods), so I can start quickly without manual setup.
- As a gym teacher, I want to create a custom scoreboard by defining fields like team names, score counters, timers, and custom stats (e.g., "laps completed"), so I can adapt it to non-standard activities like relay races.
- As a gym teacher, I want to pause/resume the game clock, add time (e.g., for injuries), and trigger end-of-period buzzers, so I can manage game flow accurately.
- As a gym teacher, I want the display view to be full-screen and read-only, showing large, visible elements (e.g., scores in bold fonts), while the control view has tappable buttons for updates, so the audience sees a clean interface.
- As a gym teacher, I want to share the unique link via QR code or copy-paste, allowing multiple display devices to connect simultaneously, so large groups can view from different angles.
- As an assistant coach, I want to join an existing session as a co-admin using a separate control link (optional password), so multiple people can update the board collaboratively.
- As a gym teacher, I want undo functionality for recent actions (e.g., accidental score increment) and a reset button for the entire game, so I can correct mistakes easily.
- As a gym teacher, I want customizable themes (e.g., school colors) and sound options (e.g., buzzer on/off), so the scoreboard feels personalized and engaging.

## 3. Functional Requirements

### 3.1 Sport Selection and Configuration
- Predefined Sports: Users select from a dropdown (basketball, soccer, volleyball, baseball, tennis). Each auto-loads relevant fields:
  - Basketball: Home/Away scores, fouls, timeouts, periods (default 4, 10 min each), shot clock (optional).
  - Soccer: Home/Away scores, halves (default 2, 45 min each), yellow/red cards.
  - Volleyball: Home/Away sets/points, timeouts.
  - Baseball: Home/Away runs, innings (default 9), outs, strikes/balls.
  - Tennis: Home/Away sets/games/points, tiebreakers.
- Custom Mode: Users define:
  - Team names (up to 2 teams, editable).
  - Counters (e.g., scores, fouls) with increment/decrement buttons.
  - Timers (main clock, shot clock) with start/stop/pause.
  - Text fields (e.g., "current batter").
- Settings: Number of periods/innings/halves, time per period (minutes:seconds), overtime rules (e.g., sudden death).

### 3.2 Session Creation and Sharing
- Upon configuration, generate a unique session ID (UUID-based).
- Provide a display URL (e.g., gymscoreboard.com/display/[sessionID]) and QR code for easy scanning.
- Optional: Generate a co-admin link with a simple PIN (4 digits) for shared control.
- Sessions expire after 24 hours of inactivity or manual close.

### 3.3 Control Interface
- Touch-friendly UI: Large buttons for +1/-1 on scores, fouls, etc.
- Clock Controls: Start/Stop/Pause button, add/subtract time slider (1-60 seconds).
- Real-time Sync: Updates push to all connected display views via WebSockets.
- Undo Stack: Last 5 actions reversible.
- Buzzer: Audio alert (toggleable) for clock zero or period end.

### 3.4 Display Interface
- Read-Only View: Full-screen mode encouraged (browser API).
- Large Fonts: Scores in 200pt+, timers in countdown format (MM:SS).
- Responsive Design: Adapts to screen size (mobile, tablet, desktop, projector).
- Multi-Device Support: Unlimited viewers per session.

### 3.5 Additional Features
- Export Game Log: Download a simple CSV of events (e.g., "Score update at 5:32") post-game.
- Themes: Basic color picker for teams/background.
- Accessibility: High contrast mode, screen reader support (ARIA labels).

## 4. Non-Functional Requirements

### 4.1 Performance
- Latency: Real-time updates <500ms.
- Scalability: Handle up to 50 concurrent display connections per session.
- Load Time: Initial page load <2 seconds on average broadband.

### 4.2 Security
- No user data stored; sessions are anonymous.
- Rate Limiting: Prevent abuse (e.g., max 100 updates/minute).
- HTTPS: All traffic encrypted.
- Display views cannot modify data; only listen for updates.

### 4.3 Usability
- Mobile-First: Fully responsive, touch-optimized.
- Intuitive Onboarding: 3-step wizard (select sport > configure > share link).
- Error Handling: Graceful messages (e.g., "No internet—updates paused").
- Localization: English only initially; expandable to Spanish/French.

### 4.4 Reliability
- Uptime: 99.9% target.
- Backup: Auto-save session state every 30 seconds to recover from disconnects.
- Browser Compatibility: Latest versions of Chrome, Safari, Firefox, Edge.

### 4.5 Analytics
- Anonymous Usage Tracking: Sessions created, sports selected (opt-out available).

## 5. UI/UX Wireframes (High-Level Description)
- Home Screen: Sport selection grid (icons for each sport + "Custom").
- Config Screen: Form with sliders/dropdowns for periods, times.
- Control Dashboard: Grid layout with team sections (scores left/right), clock center, stats below.
- Display View: Minimalist—giant scores, timer, no buttons.
- Use Material Design principles for buttons/icons.

## 6. Technical Architecture
- Frontend: React.js for dynamic UI, Tailwind CSS for styling.
- Backend: Node.js with Express for session management, Socket.io for real-time.
- Database: In-memory (Redis) for active sessions; no persistent storage.
- Deployment: Serverless (e.g., Vercel) for scalability.

## 7. Release Plan
- MVP: Predefined sports (basketball/soccer), basic controls, sharing.
- Version 1.1: Custom mode, themes, export.
- Testing: Unit tests for logic, user testing with 20 gym teachers.
- Launch Date: Q1 2026.

## 8. Risks and Mitigations
- Risk: Poor real-time performance on slow networks. Mitigation: Fallback to polling every 2 seconds.
- Risk: Users accidentally share control link. Mitigation: Optional PIN protection.
- Risk: Browser compatibility issues. Mitigation: Extensive cross-browser testing.

This PRD provides a comprehensive blueprint for developing GymScoreboard as a fully functional product.

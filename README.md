# Valentine Invite Frontend 💕

A beautiful, romantic web app for sending personalized Valentine's Day invitations with music, voice notes, and heartfelt messages.

## Features

- 🎵 **Music Selection** - Search and pick songs from YouTube
- 🎤 **Voice Notes** - Record or upload personal audio messages
- 💌 **Personalized Messages** - Write teaser + reveal messages
- 📅 **Meetup Planning** - Schedule your Valentine's date
- 📱 **Easy Sharing** - Copy link or share via WhatsApp
- 🎉 **Celebration Effects** - Confetti when invites are accepted

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS v4** for styling
- **React Router** for navigation
- **React Hot Toast** for notifications
- **Canvas Confetti** for celebrations

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running at `http://localhost:3000`

### Installation

1. Clone the repository:
   ```bash
   cd val-fe
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure the API URL in `.env`:
   ```
   VITE_API_URL=http://localhost:3000
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── InputField.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Modal.tsx
│   │   └── Toast.tsx
│   ├── AudioRecorder.tsx      # Voice recording
│   ├── AudioUploader.tsx      # Audio file upload
│   ├── DateTimePicker.tsx     # Date/time selection
│   ├── FloatingHearts.tsx     # Background animation
│   ├── MusicSearch.tsx        # YouTube music search
│   ├── ShareButtons.tsx       # Copy/WhatsApp sharing
│   ├── TimeRangeSelector.tsx  # Music clip selection
│   └── YouTubeEmbed.tsx       # YouTube player
├── lib/
│   └── api.ts                 # API client functions
├── pages/
│   ├── LandingPage.tsx        # Home page
│   ├── CreateInvitePage.tsx   # Invite creation form
│   ├── SharePage.tsx          # Share link page
│   └── ValentinePage.tsx      # Valentine's view
├── types/
│   └── index.ts               # TypeScript interfaces
├── App.tsx                    # Main app with routing
├── main.tsx                   # Entry point
└── index.css                  # Global styles
```

## API Endpoints

The frontend communicates with these backend endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/invite` | Create new invite |
| GET | `/invite/:token` | Get invite details |
| POST | `/invite/:token/accept` | Accept invite |
| POST | `/invite/:token/decline` | Decline invite |
| GET | `/music/search?q=&limit=` | Search YouTube |
| POST | `/upload/voice-note` | Upload voice note |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000` |

## License

MIT

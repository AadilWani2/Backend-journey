# MoodSync 🎵

> **A mood-aware music player.** Point your camera, let AI detect your expression, and get a random song that matches how you feel — automatically.

---

## Table of Contents

- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
  - [Root](#root)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Feature Breakdown](#feature-breakdown)
  - [Auth Feature](#auth-feature)
  - [Expression Feature](#expression-feature)
  - [Home Feature](#home-feature)
  - [Shared](#shared)
- [Frontend Architecture — 4-Tier Pattern](#frontend-architecture--4-tier-pattern)
- [API Reference](#api-reference)
- [Data Models](#data-models)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)

---

## How It Works

```
1. User opens app → Protected route checks auth via JWT cookie
2. User is authenticated → Home page loads with camera feed
3. User clicks "Detect My Mood" → MediaPipe reads face blendshapes
4. Mood is detected (happy / sad / surprised / neutral)
5. Frontend hits GET /api/song?mood=<detected_mood>
6. A random song from the matching mood is loaded into the Player
7. Song auto-plays immediately
8. When song ends → next random song of same mood plays automatically
9. User can re-detect mood at any time to switch genre
10. Admin can upload songs via the "+ Upload Song" popup modal
```

---

## Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| **React 18** | UI framework |
| **React Router v7** | Client-side routing |
| **SCSS (Sass)** | Component-scoped styling |
| **Axios** | HTTP client for API calls |
| **@mediapipe/tasks-vision** | Real-time face landmarking & blendshape detection |

### Backend
| Tool | Purpose |
|---|---|
| **Node.js + Express** | HTTP server & REST API |
| **MongoDB + Mongoose** | Database & ODM |
| **Redis (ioredis)** | Token blacklist cache for logout |
| **JWT (jsonwebtoken)** | Authentication tokens via cookies |
| **Multer** | Multipart file upload parsing |
| **ImageKit** | Cloud storage for song files & poster images |
| **node-id3** | Reads ID3 tags (title, cover art) from uploaded MP3s |
| **cookie-parser** | Parses HTTP cookies |
| **cors** | Cross-origin request handling |

---

## Project Structure

```
day15/
├── Backend/
│   ├── src/
│   │   ├── app.js                    ← Express app setup
│   │   ├── config/
│   │   │   ├── database.js           ← MongoDB connection
│   │   │   └── cache.js              ← Redis client setup
│   │   ├── controllers/
│   │   │   ├── auth.controller.js    ← Register, login, getMe, logout logic
│   │   │   └── song.controller.js    ← Upload song, get songs by mood
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js    ← JWT verification + Redis blacklist check
│   │   │   └── upload.middleware.js  ← Multer config (memory storage, 10MB limit)
│   │   ├── models/
│   │   │   ├── user.model.js         ← User schema (username, email, password)
│   │   │   ├── song.model.js         ← Song schema (url, posterURL, title, mood)
│   │   │   └── blacklist.model.js    ← Blacklisted JWT tokens (for logout)
│   │   ├── routes/
│   │   │   ├── auth.routes.js        ← /api/auth routes
│   │   │   └── song.routes.js        ← /api/song routes
│   │   └── services/
│   │       └── storage.service.js    ← ImageKit file upload wrapper
│   └── .env                          ← Environment variables (see below)
│
└── Frontend/
    └── src/
        ├── App.jsx                   ← Root component, wraps providers + router
        ├── app.routes.jsx            ← Route definitions (/, /login, /register)
        ├── main.jsx                  ← React DOM entry point
        └── features/
            ├── auth/                 ← Everything about authentication
            ├── home/                 ← Main app screen (camera + player + upload)
            ├── Expression/           ← Face detection logic & UI
            └── shared/               ← Global styles used across all features
```

---

## Feature Breakdown

### Auth Feature
`Frontend/src/features/auth/`

```
auth/
├── auth.context.jsx          ← React Context: stores { user, loading }
├── hooks/
│   └── useAuth.js            ← Business logic: handleLogin, handleRegister,
│                                handleGetMe (runs on mount), handleLogout
├── services/
│   └── auth.api.js           ← Axios calls to /api/auth/* endpoints
├── components/
│   ├── FormGroup.jsx         ← Reusable labeled <input> wrapper
│   └── Protected.jsx         ← Route guard: redirects to /login if not authed
├── pages/
│   ├── Login.jsx             ← Login form page
│   └── Register.jsx          ← Registration form page
└── style/
    ├── login.scss            ← Styles for both login + register pages
    └── register.scss         ← Imports login.scss (shared design)
```

**Flow:** `Protected` uses `useAuth` → if no `user`, redirect to `/login` → user submits form → `handleLogin` calls `auth.api.js` → sets `user` in context → React Router redirects to `/`.

---

### Expression Feature
`Frontend/src/features/Expression/`

```
Expression/
├── components/
│   ├── FaceExpression.jsx    ← Camera feed UI, mood badge, detect button
│   └── FaceExpression.scss   ← Styles for the camera section
└── utils/
    └── utils.js              ← MediaPipe init & detect functions
```

**`utils.js` — two exported functions:**

| Function | What it does |
|---|---|
| `init({ landmarkerRef, videoRef, streamRef })` | Loads MediaPipe WASM, creates FaceLandmarker model, opens webcam, attaches stream to `<video>` |
| `detect({ landmarkerRef, videoRef, setExpression })` | Runs one frame of face detection, reads blendshape scores, maps to a mood string, updates state, returns the mood |

**Blendshape → Mood mapping:**

| Condition | Mood |
|---|---|
| `mouthSmileLeft > 0.5` AND `mouthSmileRight > 0.5` | `happy` |
| `jawOpen > 0.1` AND `browInnerUp > 0.1` | `surprised` |
| `mouthFrownLeft > 0.00001` AND `mouthFrownRight > 0.00001` | `sad` |
| None of the above | `neutral` |

---

### Home Feature
`Frontend/src/features/home/`

```
home/
├── song.context.jsx          ← React Context: stores { song, loading, currentMood }
├── hooks/
│   └── useSong.js            ← Business logic: handleGetSong (fetches random song
│                                by mood), handleUploadSong (uploads MP3 + mood)
├── service/
│   └── song.api.js           ← Axios calls: getSong(mood), uploadSong(file, mood)
├── components/
│   ├── Player.jsx            ← HTML5 audio player (play/pause, seek, volume,
│   │                            speed, auto-play, auto-queue on song end)
│   ├── Player.scss           ← Glassmorphism horizontal player card styles
│   ├── UploadSongModal.jsx   ← Popup form: drag-and-drop MP3 + mood selector
│   └── UploadSongModal.scss  ← Modal overlay + form styles
└── pages/
    ├── Home.jsx              ← Main page: FaceExpression + Player + Upload button
    └── Home.scss             ← Home page layout styles
```

**Key behaviors in `Player.jsx`:**
- `song.url` changes → `audio.src` is set → `audio.play()` called → song auto-starts
- `onEnded` event → `handleGetSong({ mood: currentMoodRef.current })` → next random song queues automatically
- `currentMoodRef` (a `useRef`) keeps the mood fresh inside the event listener closure so stale closure bugs are avoided
- Controls: Play/Pause · Seek bar (click to jump) · ±5s skip · Volume slider + mute toggle · Speed selector (0.5× – 2×)

---

### Shared
`Frontend/src/features/shared/styles/`

```
shared/
└── styles/
    ├── global.scss           ← Reset, Inter font, body background (dark purple +
    │                            dot grid), .button class, html/body locked to 100vh
    └── button.scss           ← Legacy file (styles merged into global.scss)
```

---

## Frontend Architecture — 4-Tier Pattern

Every feature follows a strict 4-tier separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│  Tier 1 — Service  (*.api.js)                           │
│  Pure async functions. Only talks to the backend API.   │
│  No React. No state. Returns raw response data.         │
├─────────────────────────────────────────────────────────┤
│  Tier 2 — Hook  (use*.js)                               │
│  Reads from Context. Calls Service functions.           │
│  Manages loading/error state. Exposes handler functions.│
├─────────────────────────────────────────────────────────┤
│  Tier 3 — Component  (*.jsx + *.scss)                   │
│  Presentational UI. Calls Hook handlers on user events. │
│  Focused, reusable, no direct API knowledge.            │
├─────────────────────────────────────────────────────────┤
│  Tier 4 — Page  (pages/*.jsx)                           │
│  Composes components into a full screen.                │
│  Manages page-level state (showPlayer, showUpload).     │
│  Registered in app.routes.jsx.                          │
└─────────────────────────────────────────────────────────┘
```

**Example — Upload Song:**
```
UploadSongModal (Component) 
  → handleUploadSong() from useSong (Hook) 
    → uploadSong({ file, mood }) from song.api.js (Service) 
      → POST /api/song (Backend)
```

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| POST | `/register` | ✗ | `{ username, email, password }` | Create new account |
| POST | `/login` | ✗ | `{ email, password }` | Login, sets JWT cookie |
| GET | `/get-me` | ✓ | — | Returns current user from token |
| GET | `/logout` | ✓ | — | Blacklists token in Redis |

### Songs — `/api/song`

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| GET | `/?mood=happy` | ✗ | — | Returns all songs with matching mood |
| POST | `/` | ✗ | `FormData: { song (file), mood }` | Uploads MP3, extracts ID3 tags, stores in ImageKit |

> **Auth** uses HTTP-only cookies. The JWT token is automatically sent on every request via `withCredentials: true` in Axios.

---

## Data Models

### User
```js
{
  username : String (required, unique),
  email    : String (required, unique),
  password : String (required, not selected by default)
}
```

### Song
```js
{
  url       : String,              // ImageKit CDN URL of the MP3
  posterURL : String,              // ImageKit CDN URL of the cover image
  title     : String,              // Extracted from ID3 tags or filename
  mood      : "happy" | "sad" | "surprised"  // enum
}
```

### Blacklist
```js
{ token: String }  // Stores logged-out JWT tokens (checked by auth middleware)
```

---

## Environment Variables

Create `Backend/.env`:

```env
PORT=3000
MONGO_URI=mongodb://...
JWT_SECRET=your_jwt_secret

# Redis
REDIS_URL=redis://...

# ImageKit
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

---

## Running Locally

### Backend
```bash
cd Backend
npm install
npm start        # or: node src/server.js
# Runs on http://localhost:3000
```

### Frontend
```bash
cd Frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

> Make sure MongoDB and Redis are running before starting the backend.
